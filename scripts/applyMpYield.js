import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccount) {
  console.error('Missing FIREBASE_SERVICE_ACCOUNT env var');
  process.exit(1);
}
initializeApp({ credential: cert(JSON.parse(serviceAccount)) });

const db = getFirestore();

function dateId(d) {
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

async function calcBalance(col, accountId, upto) {
  const snap = await col.where('fromAccount', '==', accountId).where('date', '<=', upto.toISOString()).get();
  let bal = 0;
  snap.forEach((doc) => {
    const t = doc.data();
    const sign =
      t.type === 'expense' || t.type === 'asset_buy' || t.type === 'fee' || t.type === 'tax'
        ? -1
        : 1;
    bal += sign * t.amount;
  });
  return bal;
}

async function main() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const yieldDoc = await db.doc(`rates/mpYield/${dateId(yesterday)}`).get();
  const tna = yieldDoc.exists ? yieldDoc.data().tna : 0;

  const users = await db.collection('users').listDocuments();
  for (const user of users) {
    const accSnap = await user.collection('accounts').where('type', '==', 'mp_reserva').get();
    for (const acc of accSnap.docs) {
      const txCol = user.collection('tx');
      const existsSnap = await txCol
        .where('type', '==', 'yield')
        .where('date', '==', yesterday.toISOString())
        .where('fromAccount', '==', acc.id)
        .get();
      if (!existsSnap.empty) continue;
      const balance = await calcBalance(txCol, acc.id, yesterday);
      const amount = balance * (tna / 365 / 100);
      await txCol.add({
        type: 'yield',
        amount,
        date: yesterday.toISOString(),
        fromAccount: acc.id,
      });
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

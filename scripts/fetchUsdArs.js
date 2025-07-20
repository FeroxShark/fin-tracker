import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Fetching official USD rates requires external connectivity which may be
// restricted. Keep this script for future API access.

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccount) {
  console.error('Missing FIREBASE_SERVICE_ACCOUNT env var');
  process.exit(1);
}
initializeApp({ credential: cert(JSON.parse(serviceAccount)) });

const db = getFirestore();

async function main() {
  const resp = await fetch('https://dolarapi.com/v1/dolares/oficial');
  if (!resp.ok) throw new Error(`API error ${resp.status}`);
  const data = await resp.json();
  const rate = data.venta || data.sell || data.rate;
  const now = new Date();
  const id = now.toISOString().slice(0, 10).replace(/-/g, '');
  await db.doc(`rates/dailyUSD/${id}`).set({ rate, fetchedAt: now.toISOString() });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


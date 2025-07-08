import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccount) {
  console.error('Missing FIREBASE_SERVICE_ACCOUNT env var');
  process.exit(1);
}
initializeApp({ credential: cert(JSON.parse(serviceAccount)) });

const db = getFirestore();

async function main() {
  const endpoint = process.env.MP_YIELD_ENDPOINT;
  if (!endpoint) throw new Error('Missing MP_YIELD_ENDPOINT env var');
  const resp = await fetch(endpoint);
  if (!resp.ok) throw new Error(`API error ${resp.status}`);
  const data = await resp.json();
  const tna = data.tna || data.rate;
  const now = new Date();
  const id = now.toISOString().slice(0, 10).replace(/-/g, '');
  await db.doc(`rates/mpYield/${id}`).set({ tna, fetchedAt: now.toISOString() });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

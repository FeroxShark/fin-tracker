import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// This script requires an external API endpoint that isn't available yet.
// Leave the configuration in place so it can be enabled once access is granted.

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


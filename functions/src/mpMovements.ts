import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import mercadopago from "mercadopago";

admin.initializeApp();
mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN! });

export const syncMpMovements = functions.pubsub
  .schedule("every 24 hours")
  .timeZone("America/Argentina/Cordoba")
  .onRun(async () => {
    const { body } = await mercadopago.payment.search({
      qs: { offset: 0, limit: 1000 },
    });

    const batch = admin.firestore().batch();
    body.results.forEach((p: any) => {
      const ref = admin.firestore().doc(`mpMovements/${p.id}`);
      batch.set(
        ref,
        {
          status: p.status,
          description: p.description,
          amount: p.transaction_amount,
          fee: p.fee_details?.[0]?.amount || 0,
          net: p.net_received_amount,
          date: p.date_created,
        },
        { merge: true }
      );
    });
    await batch.commit();
  });

export const mpBalance = functions.https.onCall(async () => {
  const { data } = await mercadopago.get("/v1/account/balance", {
    access_token: process.env.MP_ACCESS_TOKEN,
  });
  return data;
});

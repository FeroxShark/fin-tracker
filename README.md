# Fin Tracker

This project uses React, Vite and Tailwind.

## Setup


1. Copy `.env.example` to `.env` and fill in your configuration. Each variable comes from your Firebase project unless otherwise noted:

   - `VITE_FIREBASE_API_KEY` – API key found in **Project settings > General**.
   - `VITE_FIREBASE_AUTH_DOMAIN` – your project's auth domain.
   - `VITE_FIREBASE_PROJECT_ID` – the project ID.
   - `VITE_FIREBASE_STORAGE_BUCKET` – storage bucket name.
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` – messaging sender ID.
   - `VITE_FIREBASE_APP_ID` – the web app ID.
   - `FIREBASE_SERVICE_ACCOUNT` – JSON credentials for a service account used by server-side scripts (required for Google Drive backups or Instant Payments).
   - `MP_YIELD_ENDPOINT` – Mercado Pago yield rates endpoint if you have external API access.
   - `MP_ACCESS_TOKEN` – private access token for Mercado Pago APIs used in Cloud Functions.
2. Install dependencies with `npm install`. This command will also create a `package-lock.json` file used by the build workflow.
3. Run `npm run dev` to start the development server.

At this stage you can sign in with Google and manage your data.
## Features

- Accounts and transactions are stored in Firestore under each user
- Offline persistence is enabled automatically
- Press **N** anywhere to quickly add a transaction

## Deploying your fork


After running `npm run build`, you can publish the contents of the `dist` folder to GitHub Pages. The `npm run deploy` script uses the `gh-pages` package to push the built files, which is equivalent to running:

```bash
npx gh-pages -d dist
```
## Further documentation

Additional project planning notes are available in [`docs/phase6-plan.md`](docs/phase6-plan.md) and [`docs/phase7-plan.md`](docs/phase7-plan.md).

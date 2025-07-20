# Fin Tracker

This project uses React, Vite and Tailwind.

## Setup

1. Copy `.env.example` to `.env` and fill it with your Firebase project keys.
2. Install dependencies with `npm install`.
   This command will also create a `package-lock.json` file used by the build workflow.
3. Run `npm run dev` to start the development server.

At this stage you can sign in with Google and manage your data.

## Features

- Accounts and transactions are stored in Firestore under each user
- Offline persistence is enabled automatically
- Press **N** anywhere to quickly add a transaction

## Deploying your fork

After running `npm run build`, you can publish the contents of the `dist` folder to GitHub Pages using the `gh-pages` package:

```bash
npx gh-pages -d dist
```

## Further documentation

Additional project planning notes are available in [`docs/phase6-plan.md`](docs/phase6-plan.md) and [`docs/phase7-plan.md`](docs/phase7-plan.md).

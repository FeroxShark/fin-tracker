# Fin Tracker (beta de Horizon)

Este proyecto utiliza React, Vite y Tailwind.

## Pasos para correrlo en local

1. Copia `.env.example` a `.env` y completa los valores de Firebase:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `FIREBASE_SERVICE_ACCOUNT` (solo para los scripts de servidor)
   - `MP_YIELD_ENDPOINT` (opcional, solo si cuentas con la API externa)
   - `MP_ACCESS_TOKEN` (para las funciones en Firebase)
2. Instala las dependencias con `npm install`.
3. Ejecuta `npm run dev` para iniciar el servidor de desarrollo.
4. Abre `http://localhost:5173` en tu navegador y accede con Google.

## Qué mantener

- Las cuentas y transacciones se guardan en Firestore por usuario.
- La aplicación funciona sin conexión gracias a la persistencia local.
- Puedes presionar **N** en cualquier momento para añadir una transacción.

# Fin Tracker (beta de Horizon)

Este proyecto utiliza React, Vite y Tailwind y se ejecuta completamente en tu navegador usando almacenamiento local.

Ahora incluye soporte para múltiples idiomas (inglés y español) y mejoras de accesibilidad.

## Pasos para correrlo en local

1. Instala las dependencias con `npm install`.
2. Ejecuta `npm run dev` para iniciar el servidor de desarrollo. El navegador se abrirá automáticamente en `http://localhost:5173`.

## Qué mantener

- Todos los datos se guardan localmente en tu navegador.
- Puedes presionar **N** en cualquier momento para añadir una transacción.

## Integración continua y despliegue

Este repositorio utiliza [GitHub Actions](https://github.com/features/actions) para ejecutar las pruebas, construir el proyecto y desplegar automáticamente la aplicación en GitHub Pages cuando se hace push a la rama `main`.

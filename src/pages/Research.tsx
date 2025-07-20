import { useState } from 'react'

export default function Research() {
  const [showInfo, setShowInfo] = useState(false)
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Investigación y Desarrollo</h1>
      <button onClick={() => setShowInfo(!showInfo)} className="border px-2 py-1">
        {showInfo ? 'Ocultar info' : 'Ver información'}
      </button>
      {showInfo && (
        <div className="mt-4 space-y-2">
          <div>
            <h2 className="font-semibold">Funciones disponibles</h2>
            <ul className="list-disc ml-5">
              <li>Inicio de sesión con Google</li>
              <li>Gestión de cuentas y transacciones</li>
              <li>Exportación e importación de datos</li>
            </ul>
          </div>
          <div className="mt-4">
            <h2 className="font-semibold">Próximas funciones</h2>
            <ul className="list-disc ml-5">
              <li>Integración con pagos instantáneos</li>
              <li>Sincronización con cuentas externas (Binance, Mercado Pago)</li>
              <li>Notificaciones y experiencia PWA</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}


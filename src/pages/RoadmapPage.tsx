import { FC } from 'react'
import Card from '../components/Card'

const RoadmapPage: FC = () => (
  <Card>
    <h2 className="text-2xl font-bold text-slate-800 mb-6">Roadmap</h2>
    <div className="grid gap-6 md:grid-cols-3">
      <div>
        <h3 className="text-lg font-semibold text-blue-600 mb-3">Shipped</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>Offline-first with local storage and migrations.</li>
          <li>Domain store con Value Objects y sanitización.</li>
          <li>Dashboard con métricas y gráficos.</li>
          <li>UI rediseñado: header sticky, sidebar, headers de página.</li>
          <li>Export/Import con checksum y soporte multi-idioma.</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-amber-600 mb-3">In Progress</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>Pluralización e Intl para formatos consistentes.</li>
          <li>Tests E2E de flujos clave con Playwright.</li>
          <li>Code-splitting por páginas y prefetch ligero.</li>
          <li>Accesibilidad: toasts aria-live, focus visible, atajos.</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-500 mb-3">Planned</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-500">
          <li>Presupuestos por categoría y reportes avanzados.</li>
          <li>Soporte de múltiples monedas y tipos de cambio.</li>
          <li>IndexedDB opcional para volúmenes grandes.</li>
          <li>Storybook/light Chromatic local para UI.</li>
        </ul>
      </div>
    </div>
  </Card>
)

export default RoadmapPage

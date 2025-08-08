import { FC } from 'react'
import Card from '../components/Card'

const RoadmapPage: FC = () => (
  <Card>
    <h2 className="text-2xl font-bold text-slate-800 mb-6">Roadmap & Features</h2>
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-blue-600 mb-3">Current Features (v1.0)</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>Fully offline functionality, all data stored in your browser.</li>
          <li>Dashboard with total balance, monthly summaries, and charts.</li>
          <li>Create, manage, and delete multiple accounts (Checking, Savings, etc.).</li>
          <li>Track income and expenses with detailed transactions.</li>
          <li>Keyboard shortcut 'N' to quickly add a new transaction.</li>
          <li>Set and track financial goals with progress visualization.</li>
          <li>Export and import all your data as a JSON file.</li>
          <li>Clean, responsive, and minimalist design.</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-500 mb-3">Planned for Future</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-500">
          <li>Budgeting tools with category limits.</li>
          <li>Recurring transactions.</li>
          <li>Advanced filtering and reporting.</li>
          <li>CSV data import/export support.</li>
          <li>Multiple currency support.</li>
          <li>Theming options (e.g., dark/light mode toggle).</li>
        </ul>
      </div>
    </div>
  </Card>
)

export default RoadmapPage

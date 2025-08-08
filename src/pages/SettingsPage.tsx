import { FC } from 'react'
import { Download, Upload, Trash2 } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'

interface Props {
  onExport: () => void
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClearData: () => void
}

const SettingsPage: FC<Props> = ({ onExport, onImport, onClearData }) => (
  <div className="space-y-8">
    <Card>
      <h3 className="text-lg font-bold text-slate-800 mb-4">Data Management</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <h4 className="font-semibold text-slate-700">Export Data</h4>
            <p className="text-sm text-slate-500">Download all your accounts, transactions, and goals as a JSON file.</p>
          </div>
          <Button onClick={onExport} variant="secondary"><Download className="w-4 h-4" /> Export</Button>
        </div>
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <h4 className="font-semibold text-slate-700">Import Data</h4>
            <p className="text-sm text-slate-500">Import data from a previously exported JSON file. This will overwrite current data.</p>
          </div>
          <label className="px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400 cursor-pointer">
            <Upload className="w-4 h-4" /> Import
            <input type="file" accept=".json" onChange={onImport} className="hidden" />
          </label>
        </div>
      </div>
    </Card>
    <Card>
      <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
      <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
        <div>
          <h4 className="font-semibold text-red-700">Clear All Data</h4>
          <p className="text-sm text-red-500">Permanently delete all your data from this browser. This action cannot be undone.</p>
        </div>
        <Button onClick={onClearData} variant="danger"><Trash2 className="w-4 h-4" /> Clear Data</Button>
      </div>
    </Card>
  </div>
)

export default SettingsPage

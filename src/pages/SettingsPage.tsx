import { FC } from 'react'
import { Download, Upload, Trash2 } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useLanguage } from '../LanguageProvider'

interface Props {
  onExport: () => void
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClearData: () => void
}

const SettingsPage: FC<Props> = ({ onExport, onImport, onClearData }) => {
  const { t, lang, setLang } = useLanguage()
  return (
    <div className="space-y-8">
      <Card>
        <h3 className="text-lg font-bold text-slate-800 mb-4">{t('language')}</h3>
        <div className="flex gap-2">
          <Button onClick={() => setLang('en')} variant={lang === 'en' ? 'primary' : 'secondary'}>{t('english')}</Button>
          <Button onClick={() => setLang('es')} variant={lang === 'es' ? 'primary' : 'secondary'}>{t('spanish')}</Button>
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-bold text-slate-800 mb-4">{t('dataManagement')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <h4 className="font-semibold text-slate-700">{t('exportData')}</h4>
              <p className="text-sm text-slate-500">{t('exportDataDesc')}</p>
            </div>
            <Button onClick={onExport} variant="secondary"><Download className="w-4 h-4" /> {t('export')}</Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <h4 className="font-semibold text-slate-700">{t('importData')}</h4>
              <p className="text-sm text-slate-500">{t('importDataDesc')}</p>
            </div>
            <label className="px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400 cursor-pointer">
              <Upload className="w-4 h-4" /> {t('import')}
              <input type="file" accept=".json" onChange={onImport} className="hidden" aria-label={t('import')} />
            </label>
          </div>
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-bold text-red-600 mb-4">{t('dangerZone')}</h3>
        <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
          <div>
            <h4 className="font-semibold text-red-700">{t('clearAllData')}</h4>
            <p className="text-sm text-red-500">{t('clearAllDataDesc')}</p>
          </div>
          <Button onClick={onClearData} variant="danger"><Trash2 className="w-4 h-4" /> {t('clearData')}</Button>
        </div>
      </Card>
    </div>
  )
}

export default SettingsPage

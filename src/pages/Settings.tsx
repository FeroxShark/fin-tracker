import { useState } from 'react'
import { fetchBackupData, toJSONBlob, toCsvBlob, importCsv } from '../backup'

export default function Settings() {
  const [file, setFile] = useState<File | null>(null)

  const downloadBackup = async () => {
    const data = await fetchBackupData()
    const blob = toJSONBlob(data)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fintracker_backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadCsv = async () => {
    const data = await fetchBackupData()
    const blob = toCsvBlob(data)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fintracker_backup.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importFile = async () => {
    if (!file) return
    await importCsv(file)
    setFile(null)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <button onClick={downloadBackup} className="border px-2 py-1 mr-2">
        Descargar backup
      </button>
      <button onClick={downloadCsv} className="border px-2 py-1 mr-2">
        Exportar CSV
      </button>
      <div className="mt-4">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button onClick={importFile} className="ml-2 border px-2 py-1">
          Importar CSV
        </button>
      </div>
    </div>
  )
}

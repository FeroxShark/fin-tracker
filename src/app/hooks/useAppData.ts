import { useDomainStore } from '../store'
import { AppData } from '@entities/types'

export function useAppData() {
  const { data, hydrated, hydrate, save } = useDomainStore()
  
  const exportData = () => {
    if (!data) return
    const payload = {
      accounts: data.accounts,
      transactions: data.transactions,
      goals: data.goals,
      categories: data.categories,
      fixedExpenses: data.fixedExpenses
    }
    const json = JSON.stringify(payload, null, 2)
    let hash = 0
    for (let i = 0; i < json.length; i++) hash = (hash * 31 + json.charCodeAt(i)) >>> 0
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fin-tracker-backup-${new Date().toISOString().split('T')[0]}-${hash.toString(16)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = async (ev) => {
        try {
          const text = String(ev.target?.result || '')
          const imported = JSON.parse(text)
          if (imported.accounts && imported.transactions && imported.goals) {
            if (!hydrated) await hydrate()
            const newData: AppData = {
              schemaVersion: 1,
              accounts: imported.accounts || [],
              transactions: imported.transactions || [],
              goals: imported.goals || [],
              categories: imported.categories || [],
              fixedExpenses: imported.fixedExpenses || []
            }
            await save(() => newData)
            resolve(true)
          } else {
            resolve(false)
          }
        } catch {
          resolve(false)
        }
      }
      reader.readAsText(file)
    })
  }

  const clearData = async () => {
    if (!hydrated) await hydrate()
    await save(() => ({ schemaVersion: 1, accounts: [], transactions: [], goals: [], categories: [], fixedExpenses: [] }))
  }

  return { data, hydrated, hydrate, exportData, importData, clearData }
}

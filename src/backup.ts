import { useStore } from './store'
import { Account, Transaction, Goal } from './types'
import Papa from 'papaparse'

export interface BackupData {
  accounts: Account[]
  transactions: Transaction[]
  goals: Goal[]
}

export async function fetchBackupData(): Promise<BackupData> {
  const { accounts, transactions, goals } = useStore.getState()
  return { accounts, transactions, goals }
}

export function toJSONBlob(data: BackupData): Blob {
  return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
}

export function toCsvBlob(data: BackupData): Blob {
  const rows: any[] = []
  data.accounts.forEach((a) => rows.push({ collection: 'accounts', ...a }))
  data.transactions.forEach((t) => rows.push({ collection: 'tx', ...t }))
  data.goals.forEach((g) => rows.push({ collection: 'goals', ...g }))
  const csv = Papa.unparse(rows)
  return new Blob([csv], { type: 'text/csv' })
}

export async function importCsv(file: File) {
  const text = await file.text()
  const parsed = Papa.parse(text, { header: true })
  if (!parsed.data || !Array.isArray(parsed.data)) return
  const state = useStore.getState()
  const accounts = [...state.accounts]
  const transactions = [...state.transactions]
  const goals = [...state.goals]
  for (const row of parsed.data as any[]) {
    if (!row.collection) continue
    const { collection, id, ...rest } = row as any
    if (collection === 'accounts') {
      accounts.push({ ...rest, id: id || crypto.randomUUID() })
    } else if (collection === 'tx') {
      transactions.push({ ...rest, id: id || crypto.randomUUID() })
    } else if (collection === 'goals') {
      goals.push({ ...rest, id: id || crypto.randomUUID() })
    }
  }
  useStore.setState({ accounts, transactions, goals })
}

export async function triggerBackup() {
  // no-op for local mode
}

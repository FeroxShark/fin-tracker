import { collection, getDocs, doc, getDoc, addDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { Account, Transaction, Goal } from './types'
import Papa from 'papaparse'

export interface BackupData {
  accounts: Account[]
  transactions: Transaction[]
  goals: Goal[]
}

export async function fetchBackupData(uid: string): Promise<BackupData> {
  const accountsSnap = await getDocs(collection(db, 'users', uid, 'accounts'))
  const txSnap = await getDocs(collection(db, 'users', uid, 'tx'))
  const goalsSnap = await getDocs(collection(db, 'users', uid, 'goals'))
  return {
    accounts: accountsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Account) })),
    transactions: txSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Transaction) })),
    goals: goalsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Goal) })),
  }
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

export async function importCsv(uid: string, file: File) {
  const text = await file.text()
  const parsed = Papa.parse(text, { header: true })
  if (!parsed.data || !Array.isArray(parsed.data)) return
  for (const row of parsed.data as any[]) {
    if (!row.collection) continue
    const { collection: col, id, ...rest } = row as any
    const colRef = collection(db, 'users', uid, col)
    if (id) await setDoc(doc(colRef, id), rest)
    else await addDoc(colRef, rest)
  }
}

export async function uploadBackup(uid: string, data: BackupData) {
  const tokenDoc = await getDoc(doc(db, 'users', uid, 'driveToken'))
  if (!tokenDoc.exists()) return
  const token = tokenDoc.data().access_token as string
  const metadata = { name: `fintracker_backup_${Date.now()}.json` }
  const boundary = 'BOUNDARY'
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify(metadata) +
    `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n` +
    JSON.stringify(data) +
    `\r\n--${boundary}--`
  await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  )
}

export async function triggerBackup(uid: string) {
  const data = await fetchBackupData(uid)
  await uploadBackup(uid, data)
}

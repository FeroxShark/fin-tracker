import { FC, useState } from 'react'
import { Account, AccountType } from '../types-fintracker'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'

interface Props {
  accounts: Account[]
  onAdd: (a: Omit<Account, 'id'>) => void
  onDelete: (id: string) => void
}

const AccountsPage: FC<Props> = ({ accounts, onAdd, onDelete }) => {
  const [name, setName] = useState('')
  const [type, setType] = useState<AccountType>('Checking')
  const [currency, setCurrency] = useState('USD')
  const [platform, setPlatform] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    onAdd({ name, type, currency, platform })
    setName('')
    setPlatform('')
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <PageHeader title="Accounts" />
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
            <select value={type} onChange={e => setType(e.target.value as AccountType)} className="w-full p-2 border border-slate-300 rounded-md">
              <option>Checking</option>
              <option>Savings</option>
              <option>Credit Card</option>
              <option>Investment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Currency</label>
            <input value={currency} onChange={e => setCurrency(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Platform</label>
            <input value={platform} onChange={e => setPlatform(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" />
          </div>
          <div className="text-right">
            <Button>Add Account</Button>
          </div>
        </form>
      </Card>
      <Card>
        <h3 className="font-bold text-lg mb-4 text-slate-800">Existing Accounts</h3>
        <ul className="divide-y divide-slate-200">
          {accounts.map(acc => (
            <li key={acc.id} className="flex items-center justify-between py-2">
              <span>{acc.name} - {acc.currency} ({acc.platform})</span>
              <Button variant="danger" onClick={() => onDelete(acc.id)}>Delete</Button>
            </li>
          ))}
          {accounts.length === 0 && <p className="text-slate-500 text-center">No accounts yet.</p>}
        </ul>
      </Card>
    </div>
  )
}

export default AccountsPage

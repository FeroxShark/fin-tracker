import { FC, useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Edit, Trash2 } from 'lucide-react'
import { Account, Transaction } from '../types-fintracker'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'

interface Props {
  transactions: Transaction[]
  accounts: Account[]
  onDelete: (id: string) => void
  onEdit: (tx: Transaction) => void
}

const TransactionsPage: FC<Props> = ({ transactions, accounts, onDelete, onEdit }) => {
  const [range, setRange] = useState<{ from?: string; to?: string }>({})
  const [query, setQuery] = useState('')
  const sorted = useMemo(() => {
    const base = [...transactions]
      .filter(t => (range.from ? new Date(t.date) >= new Date(range.from) : true) && (range.to ? new Date(t.date) <= new Date(range.to) : true))
      .filter(t => query ? t.category.toLowerCase().includes(query.toLowerCase()) : true)
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return base
  }, [transactions, range, query])

  return (
    <Card>
      <PageHeader title="All Transactions" actions={
        <div className="flex gap-2 items-end">
          <div>
            <label className="block text-xs text-slate-500 mb-1">From</label>
            <input type="date" value={range.from || ''} onChange={e => setRange(r => ({ ...r, from: e.target.value || undefined }))} className="p-2 border border-slate-300 rounded-md" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">To</label>
            <input type="date" value={range.to || ''} onChange={e => setRange(r => ({ ...r, to: e.target.value || undefined }))} className="p-2 border border-slate-300 rounded-md" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Search</label>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Category" className="p-2 border border-slate-300 rounded-md" />
          </div>
        </div>
      } />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sorted.map(t => {
              const acc = accounts.find(a => a.id === t.accountId)
              return (
                <tr key={t.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{format(parseISO(t.date), 'PP')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{t.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{acc?.name}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'Income' ? '+' : '-'}${t.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium space-x-2">
                    <button onClick={() => onEdit(t)} className="text-blue-600 hover:text-blue-800"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => window.confirm('Are you sure?') && onDelete(t.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {sorted.length === 0 && <p className="text-center py-8 text-slate-500">No transactions found.</p>}
      </div>
    </Card>
  )
}

export default TransactionsPage

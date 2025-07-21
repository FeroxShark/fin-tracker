import { FC, useState } from 'react'
import { Account, Transaction, TransactionType } from '../types-fintracker'
import Button from './Button'

interface Props {
  transaction?: Transaction | null
  accounts: Account[]
  onSave: (tx: Omit<Transaction, 'id'> & { id?: string }) => void
  onClose: () => void
}

const TransactionForm: FC<Props> = ({ transaction, accounts, onSave, onClose }) => {
  const [amount, setAmount] = useState(transaction?.amount.toString() || '')
  const [accountId, setAccountId] = useState(transaction?.accountId || (accounts[0]?.id || ''))
  const [type, setType] = useState<TransactionType>(transaction?.type || 'Expense')
  const [category, setCategory] = useState(transaction?.category || '')
  const [date, setDate] = useState(transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0])
  const [note, setNote] = useState(transaction?.note || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !accountId || !category) {
      alert('Please fill all required fields.')
      return
    }
    onSave({
      ...(transaction && { id: transaction.id }),
      accountId,
      type,
      amount: parseFloat(amount),
      category,
      date: new Date(date).toISOString(),
      note
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setType('Income')} className={`w-full py-2 rounded-md ${type === 'Income' ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>Income</button>
          <button type="button" onClick={() => setType('Expense')} className={`w-full py-2 rounded-md ${type === 'Expense' ? 'bg-red-500 text-white' : 'bg-slate-200'}`}>Expense</button>
        </div>
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-slate-600 mb-1">Amount</label>
        <input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" required />
      </div>
      <div>
        <label htmlFor="account" className="block text-sm font-medium text-slate-600 mb-1">Account</label>
        <select id="account" value={accountId} onChange={e => setAccountId(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" required>
          {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-600 mb-1">Category</label>
        <input id="category" type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" required />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-slate-600 mb-1">Date</label>
        <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" required />
      </div>
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-slate-600 mb-1">Note (Optional)</label>
        <textarea id="note" value={note} onChange={e => setNote(e.target.value)} rows={2} className="w-full p-2 border border-slate-300 rounded-md"></textarea>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button onClick={onClose} variant="secondary">Cancel</Button>
        <Button>Save Transaction</Button>
      </div>
    </form>
  )
}

export default TransactionForm

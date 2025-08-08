import { FC, useState } from 'react'
import { FixedExpense } from '../types-fintracker'
import Card from '../components/Card'
import Button from '../components/Button'

interface Props {
  expenses: FixedExpense[]
  onAdd: (e: Omit<FixedExpense, 'id'>) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<FixedExpense>) => void
}

const FixedExpensesPage: FC<Props> = ({ expenses, onAdd, onDelete, onUpdate }) => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!name || isNaN(amt) || !dueDate) return
    if (editingId) {
      onUpdate(editingId, { name, amount: amt, dueDate })
    } else {
      onAdd({ name, amount: amt, dueDate })
    }
    setName('')
    setAmount('')
    setDueDate('')
    setEditingId(null)
  }

  const startEdit = (exp: FixedExpense) => {
    setEditingId(exp.id)
    setName(exp.name)
    setAmount(exp.amount.toString())
    setDueDate(exp.dueDate)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Fixed Expenses</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Amount</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" required />
          </div>
          <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Due Date</label>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" />
          </div>
          <div className="flex justify-end gap-2">
            {editingId && (
              <Button variant="secondary" onClick={() => { setEditingId(null); setName(''); setAmount(''); setDueDate(''); }}>
                Cancel
              </Button>
            )}
            <Button>{editingId ? 'Save' : 'Add'}</Button>
          </div>
        </form>
      </Card>
      <Card>
        <h3 className="font-bold text-lg mb-4 text-slate-800">Existing Expenses</h3>
        <ul className="divide-y divide-slate-200">
          {expenses.map(exp => (
            <li key={exp.id} className="flex items-center justify-between py-2 gap-2">
              <span className="flex-1">
                {exp.name} - ${exp.amount.toFixed(2)} - {exp.dueDate}
              </span>
              <Button variant="secondary" onClick={() => startEdit(exp)}>Edit</Button>
              <Button variant="danger" onClick={() => onDelete(exp.id)}>Delete</Button>
            </li>
          ))}
          {expenses.length === 0 && <p className="text-slate-500 text-center">No fixed expenses.</p>}
        </ul>
      </Card>
    </div>
  )
}

export default FixedExpensesPage

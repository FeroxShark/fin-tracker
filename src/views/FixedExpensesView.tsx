import { FC, useState } from 'react'
import { FixedExpense } from '../types-fintracker'
import Card from '../components/Card'
import Button from '../components/Button'

interface Props {
  expenses: FixedExpense[]
  onAdd: (e: Omit<FixedExpense, 'id'>) => void
  onDelete: (id: string) => void
}

const FixedExpensesView: FC<Props> = ({ expenses, onAdd, onDelete }) => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!name || isNaN(amt) || !dueDate) return
    onAdd({ name, amount: amt, dueDate })
    setName('')
    setAmount('')
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
          <div className="text-right">
            <Button>Add</Button>
          </div>
        </form>
      </Card>
      <Card>
        <h3 className="font-bold text-lg mb-4 text-slate-800">Existing Expenses</h3>
        <ul className="divide-y divide-slate-200">
          {expenses.map(exp => (
            <li key={exp.id} className="flex items-center justify-between py-2">
              <span>
                {exp.name} - ${exp.amount.toFixed(2)} ({exp.dueDate})
              </span>
              <Button variant="danger" onClick={() => onDelete(exp.id)}>Delete</Button>
            </li>
          ))}
          {expenses.length === 0 && <p className="text-slate-500 text-center">No fixed expenses.</p>}
        </ul>
      </Card>
    </div>
  )
}

export default FixedExpensesView

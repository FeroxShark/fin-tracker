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
  const [dueDay, setDueDay] = useState(1)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!name || isNaN(amt)) return
    onAdd({ name, amount: amt, dueDay })
    setName('')
    setAmount('')
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Fixed Expenses</h2>
      <form onSubmit={submit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Amount</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Due Day</label>
          <input type="number" min={1} max={31} value={dueDay} onChange={e => setDueDay(parseInt(e.target.value))} className="w-full p-2 border border-slate-300 rounded-md" />
        </div>
        <div className="text-right">
          <Button>Add</Button>
        </div>
      </form>
      <ul className="divide-y divide-slate-200">
        {expenses.map(exp => (
          <li key={exp.id} className="flex items-center justify-between py-2">
            <span>{exp.name} - ${exp.amount.toFixed(2)} (day {exp.dueDay})</span>
            <Button variant="danger" onClick={() => onDelete(exp.id)}>Delete</Button>
          </li>
        ))}
        {expenses.length === 0 && <p className="text-slate-500 text-center">No fixed expenses.</p>}
      </ul>
    </Card>
  )
}

export default FixedExpensesView

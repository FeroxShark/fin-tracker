import { FC, useState } from 'react'
import { Category } from '../types-fintracker'
import Card from '../components/Card'
import Button from '../components/Button'

interface Props {
  categories: Category[]
  onAdd: (c: Omit<Category, 'id'>) => void
  onDelete: (id: string) => void
}

const CategoriesView: FC<Props> = ({ categories, onAdd, onDelete }) => {
  const [name, setName] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    onAdd({ name })
    setName('')
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Categories</h2>
        <form onSubmit={submit} className="flex gap-2">
          <input value={name} onChange={e => setName(e.target.value)} className="flex-grow p-2 border border-slate-300 rounded-md" placeholder="Category name" required />
          <Button>Add</Button>
        </form>
      </Card>
      <Card>
        <h3 className="font-bold text-lg mb-4 text-slate-800">Existing Categories</h3>
        <ul className="divide-y divide-slate-200">
          {categories.map(cat => (
            <li key={cat.id} className="flex items-center justify-between py-2">
              <span>{cat.name}</span>
              <Button variant="danger" onClick={() => onDelete(cat.id)}>Delete</Button>
            </li>
          ))}
          {categories.length === 0 && <p className="text-slate-500 text-center">No categories yet.</p>}
        </ul>
      </Card>
    </div>
  )
}

export default CategoriesView

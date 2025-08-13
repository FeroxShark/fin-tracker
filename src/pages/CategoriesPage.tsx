import { FC, useState } from 'react'
import { Category } from '../types-fintracker'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'

interface Props {
  categories: Category[]
  onAdd: (c: Omit<Category, 'id'>) => void
  onDelete: (id: string) => void
}

const CategoriesPage: FC<Props> = ({ categories, onAdd, onDelete }) => {
  const [name, setName] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    onAdd({ name })
    setName('')
  }

  return (
    <Card>
      <PageHeader title="Categories" />
      <form onSubmit={submit} className="flex gap-2 mb-4">
        <input value={name} onChange={e => setName(e.target.value)} className="flex-grow p-2 border border-slate-300 rounded-md" placeholder="Category name" required />
        <Button>Add</Button>
      </form>
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
  )
}

export default CategoriesPage

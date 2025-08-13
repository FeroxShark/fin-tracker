import { useDomainStore } from '../store'
import { Category } from '@entities/types'

export function useCategories() {
  const { data, hydrated, hydrate, save } = useDomainStore()
  
  const categories = data?.categories || []
  
  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!hydrated) await hydrate()
    await save(data => ({
      ...data,
      categories: [...data.categories, { ...category, id: crypto.randomUUID() }]
    }))
  }
  
  const updateCategory = async (id: string, updates: Partial<Category>) => {
    if (!hydrated) await hydrate()
    await save(data => ({
      ...data,
      categories: data.categories.map(cat => cat.id === id ? { ...cat, ...updates } : cat)
    }))
  }
  
  const deleteCategory = async (id: string) => {
    if (!hydrated) await hydrate()
    await save(data => ({
      ...data,
      categories: data.categories.filter(cat => cat.id !== id)
    }))
  }
  
  return {
    categories,
    hydrated,
    addCategory,
    updateCategory,
    deleteCategory
  }
}

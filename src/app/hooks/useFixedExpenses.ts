import { useDomainStore } from '../store'
import { FixedExpense } from '@entities/types'

export function useFixedExpenses() {
  const { data, hydrated, hydrate, save } = useDomainStore()
  
  const fixedExpenses = data?.fixedExpenses || []
  
  const addFixedExpense = async (expense: Omit<FixedExpense, 'id'>) => {
    if (!hydrated) await hydrate()
    await save(data => ({
      ...data,
      fixedExpenses: [...data.fixedExpenses, { ...expense, id: crypto.randomUUID() }]
    }))
  }
  
  const updateFixedExpense = async (id: string, updates: Partial<FixedExpense>) => {
    if (!hydrated) await hydrate()
    await save(data => ({
      ...data,
      fixedExpenses: data.fixedExpenses.map(exp => exp.id === id ? { ...exp, ...updates } : exp)
    }))
  }
  
  const deleteFixedExpense = async (id: string) => {
    if (!hydrated) await hydrate()
    await save(data => ({
      ...data,
      fixedExpenses: data.fixedExpenses.filter(exp => exp.id !== id)
    }))
  }
  
  return {
    fixedExpenses,
    hydrated,
    addFixedExpense,
    updateFixedExpense,
    deleteFixedExpense
  }
}

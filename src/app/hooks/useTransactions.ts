import { useDomainStore } from '../store'
import { Transaction } from '@entities/types'

export function useTransactions() {
  const { data, hydrated, hydrate, save } = useDomainStore()
  
  const transactions = data?.transactions || []
  
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!hydrated) await hydrate()
    await save(data => ({
      ...data,
      transactions: [...data.transactions, { ...transaction, id: new Date().toISOString() }]
    }))
  }
  
  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!hydrated) await hydrate()
    await save(data => ({
      ...data,
      transactions: data.transactions.map(tx => tx.id === id ? { ...tx, ...updates } : tx)
    }))
  }
  
  const deleteTransaction = async (id: string) => {
    if (!hydrated) await hydrate()
    await save(data => ({
      ...data,
      transactions: data.transactions.filter(tx => tx.id !== id)
    }))
  }
  
  return {
    transactions,
    hydrated,
    addTransaction,
    updateTransaction,
    deleteTransaction
  }
}

import { useDomainStore } from '../store'
import { Account } from '@entities/types'

export function useAccounts() {
  const { data, hydrated, hydrate, save } = useDomainStore()
  
  const accounts = data?.accounts || []
  
  const addAccount = async (account: Omit<Account, 'id'>) => {
    if (!hydrated) await hydrate()
    await save(data => ({
      ...data,
      accounts: [...data.accounts, { ...account, id: crypto.randomUUID() }]
    }))
  }
  
  const updateAccount = async (id: string, updates: Partial<Account>) => {
    if (!hydrated) await hydrate()
    await save(data => ({
      ...data,
      accounts: data.accounts.map(acc => acc.id === id ? { ...acc, ...updates } : acc)
    }))
  }
  
  const deleteAccount = async (id: string) => {
    if (!hydrated) await hydrate()
    await save(data => ({
      ...data,
      accounts: data.accounts.filter(acc => acc.id !== id)
    }))
  }
  
  return {
    accounts,
    hydrated,
    addAccount,
    updateAccount,
    deleteAccount
  }
}

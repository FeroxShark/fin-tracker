import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Account, Transaction, Goal } from './types'

interface Store {
  accounts: Account[]
  transactions: Transaction[]
  goals: Goal[]
  addAccount: (a: Omit<Account, 'id'>) => void
  updateAccount: (id: string, data: Partial<Account>) => void
  deleteAccount: (id: string) => void
  addTransaction: (t: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, data: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  addGoal: (g: Omit<Goal, 'id'>) => void
  updateGoal: (id: string, data: Partial<Goal>) => void
  deleteGoal: (id: string) => void
}

export const useStore = create<Store>()(
  persist<Store>(
    (set) => ({
      accounts: [],
      transactions: [],
      goals: [],
      addAccount: (a) =>
        set((s: Store) => ({ accounts: [...s.accounts, { ...a, id: crypto.randomUUID() }] })),
      updateAccount: (id, data) =>
        set((s: Store) => ({ accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...data } : a)) })),
      deleteAccount: (id) =>
        set((s: Store) => ({ accounts: s.accounts.filter((a) => a.id !== id) })),
      addTransaction: (t) =>
        set((s: Store) => ({ transactions: [...s.transactions, { ...t, id: crypto.randomUUID() }] })),
      updateTransaction: (id, data) =>
        set((s: Store) => ({ transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...data } : t)) })),
      deleteTransaction: (id) =>
        set((s: Store) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),
      addGoal: (g) => set((s: Store) => ({ goals: [...s.goals, { ...g, id: crypto.randomUUID() }] })),
      updateGoal: (id, data) =>
        set((s: Store) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, ...data } : g)) })),
      deleteGoal: (id) => set((s: Store) => ({ goals: s.goals.filter((g) => g.id !== id) })),
    }),
    { name: 'fin-tracker' }
  )
)

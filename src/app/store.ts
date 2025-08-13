import { create } from 'zustand'
import { LocalStorageRepository } from './repository'
import { AppData, Account, Transaction, Category, FixedExpense, Goal } from '@entities/types'

interface DomainState {
  data: AppData | null
  hydrated: boolean
  hydrate: () => Promise<void>
  save: (updater: (d: AppData) => AppData) => Promise<void>
}

const repo = new LocalStorageRepository()

export const useDomainStore = create<DomainState>((set, get) => ({
  data: null,
  hydrated: false,
  hydrate: async () => {
    const data = await repo.getAll()
    set({ data, hydrated: true })
  },
  save: async (updater) => {
    const current = get().data
    if (!current) return
    const next = updater(current)
    await repo.saveAll(next)
    set({ data: next })
  }
}))



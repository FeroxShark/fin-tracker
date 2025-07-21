import { useStore } from '../store'
import { Account } from '../types'

export const useAccounts = () => {
  const accounts = useStore((s) => s.accounts)
  const addAccount = useStore((s) => s.addAccount)
  const updateAccount = useStore((s) => s.updateAccount)
  const deleteAccount = useStore((s) => s.deleteAccount)
  return { accounts, addAccount, updateAccount, deleteAccount }
}

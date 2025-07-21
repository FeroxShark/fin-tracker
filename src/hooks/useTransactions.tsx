import { useStore } from '../store'
import { Transaction } from '../types'

export const useTransactions = () => {
  const transactions = useStore((s) => s.transactions)
  const addTransaction = useStore((s) => s.addTransaction)
  const updateTransaction = useStore((s) => s.updateTransaction)
  const deleteTransaction = useStore((s) => s.deleteTransaction)
  return { transactions, addTransaction, updateTransaction, deleteTransaction }
}

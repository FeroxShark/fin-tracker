import { useEffect, useState } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore'
import { useAuth } from '../AuthProvider'
import { db } from '../firebase'
import { Transaction } from '../types'

export const useTransactions = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (!user) return
    const col = collection(db, 'users', user.uid, 'tx')
    return onSnapshot(col, (snap) => {
      setTransactions(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Transaction) }))
      )
    })
  }, [user])

  const addTransaction = async (tx: Transaction) => {
    if (!user) return
    const col = collection(db, 'users', user.uid, 'tx')
    await addDoc(col, tx)
  }

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'tx', id), data)
  }

  const deleteTransaction = async (id: string) => {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'tx', id))
  }

  return { transactions, addTransaction, updateTransaction, deleteTransaction }
}

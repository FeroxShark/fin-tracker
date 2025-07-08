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
import { Account } from '../types'
import { triggerBackup } from '../backup'

export const useAccounts = () => {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])

  useEffect(() => {
    if (!user) return
    const col = collection(db, 'users', user.uid, 'accounts')
    return onSnapshot(col, (snap) => {
      setAccounts(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Account) }))
      )
    })
  }, [user])

  const addAccount = async (account: Account) => {
    if (!user) return
    const col = collection(db, 'users', user.uid, 'accounts')
    await addDoc(col, account)
    await triggerBackup(user.uid)
  }

  const updateAccount = async (id: string, data: Partial<Account>) => {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'accounts', id), data)
    await triggerBackup(user.uid)
  }

  const deleteAccount = async (id: string) => {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'accounts', id))
    await triggerBackup(user.uid)
  }

  return { accounts, addAccount, updateAccount, deleteAccount }
}

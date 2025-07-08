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
import { Goal } from '../types'
import { triggerBackup } from '../backup'

export const useGoals = () => {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])

  useEffect(() => {
    if (!user) return
    const col = collection(db, 'users', user.uid, 'goals')
    return onSnapshot(col, (snap) => {
      setGoals(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Goal) })))
    })
  }, [user])

  const addGoal = async (goal: Goal) => {
    if (!user) return
    const col = collection(db, 'users', user.uid, 'goals')
    await addDoc(col, goal)
    await triggerBackup(user.uid)
  }

  const updateGoal = async (id: string, data: Partial<Goal>) => {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'goals', id), data)
    await triggerBackup(user.uid)
  }

  const deleteGoal = async (id: string) => {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'goals', id))
    await triggerBackup(user.uid)
  }

  return { goals, addGoal, updateGoal, deleteGoal }
}

import { useStore } from '../store'
import { Goal } from '../types'

export const useGoals = () => {
  const goals = useStore((s) => s.goals)
  const addGoal = useStore((s) => s.addGoal)
  const updateGoal = useStore((s) => s.updateGoal)
  const deleteGoal = useStore((s) => s.deleteGoal)
  return { goals, addGoal, updateGoal, deleteGoal }
}

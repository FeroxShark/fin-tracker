import { useDomainStore } from '../store'
import { Goal } from '@entities/types'

export function useGoals() {
  const { data, hydrated, hydrate, save } = useDomainStore()
  
  const goals = data?.goals || []
  
  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    if (!hydrated) await hydrate()
    await save(data => ({
      ...data,
      goals: [...data.goals, { ...goal, id: crypto.randomUUID() }]
    }))
  }
  
  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (!hydrated) await hydrate()
    await save(data => ({
      ...data,
      goals: data.goals.map(goal => goal.id === id ? { ...goal, ...updates } : goal)
    }))
  }
  
  const deleteGoal = async (id: string) => {
    if (!hydrated) await hydrate()
    await save(data => ({
      ...data,
      goals: data.goals.filter(goal => goal.id !== id)
    }))
  }
  
  return {
    goals,
    hydrated,
    addGoal,
    updateGoal,
    deleteGoal
  }
}

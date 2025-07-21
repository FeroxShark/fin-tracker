import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      const val = value instanceof Function ? value(storedValue) : value
      setStoredValue(val)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(val))
      }
    } catch {
      /* empty */
    }
  }

  return [storedValue, setValue]
}

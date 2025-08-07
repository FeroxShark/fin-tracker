import { useState, Dispatch, SetStateAction } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    try {
      const val = typeof value === 'function' ? (value as (val: T) => T)(storedValue) : value
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

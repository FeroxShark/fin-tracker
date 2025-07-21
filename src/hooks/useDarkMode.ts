import { useEffect, useState } from 'react'

export const useDarkMode = () => {
  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  useEffect(() => {
    const root = document.documentElement
    if (enabled) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('darkMode', enabled ? 'true' : 'false')
  }, [enabled])

  return [enabled, setEnabled] as const
}

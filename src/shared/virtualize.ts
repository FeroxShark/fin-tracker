import { useMemo } from 'react'

export function useVirtualRows<T>(items: T[], start: number, end: number): T[] {
  const s = Math.max(0, start)
  const e = Math.min(items.length, end)
  return useMemo(() => items.slice(s, e), [items, s, e])
}



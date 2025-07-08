import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export const useRates = () => {
  const [usdRate, setUsdRate] = useState<number>()
  const [mpTna, setMpTna] = useState<number>()

  useEffect(() => {
    const q = query(collection(db, 'rates', 'dailyUSD'), orderBy('__name__', 'desc'), limit(1))
    return onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const d = snap.docs[0].data() as any
        setUsdRate(d.rate)
      }
    })
  }, [])

  useEffect(() => {
    const q = query(collection(db, 'rates', 'mpYield'), orderBy('__name__', 'desc'), limit(1))
    return onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const d = snap.docs[0].data() as any
        setMpTna(d.tna)
      }
    })
  }, [])

  return { usdRate, mpTna }
}

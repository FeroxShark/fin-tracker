import { Money } from '@entities/types'

export function moneyToNumber(m: Money): number {
  return m.cents / 100
}

export function numberToMoney(amount: number, currency: string = 'USD'): Money {
  return { cents: Math.round(amount * 100), currency }
}

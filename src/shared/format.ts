import { Money } from '@entities/types'

export function formatMoney(m: Money, locale: string = navigator.language): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: m.currency }).format(m.cents / 100)
}

export function toIsoUtc(date: Date): string {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  )).toISOString()
}



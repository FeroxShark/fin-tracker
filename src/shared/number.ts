export function parseLocaleNumberToCents(value: string, currency: string): { cents: number, currency: string } {
  // Normalize comma/point
  const normalized = value.replace(/\s+/g, '').replace(/,(\d{1,2})$/, '.$1').replace(/\.(?=.*\.)/g, '')
  const num = Number(normalized)
  if (!isFinite(num)) return { cents: 0, currency }
  return { cents: Math.round(num * 100), currency }
}



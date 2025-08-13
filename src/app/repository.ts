import { AppData, AppDataSchema } from '@entities/types'

export interface DataRepository {
  getAll(): Promise<AppData>
  saveAll(data: AppData): Promise<void>
  clear(): Promise<void>
  version(): number
}

const CURRENT_VERSION = 1
const KEY_V1 = 'fin-tracker/v1'

function checksum(json: string): string {
  let hash = 0
  for (let i = 0; i < json.length; i++) {
    hash = (hash * 31 + json.charCodeAt(i)) >>> 0
  }
  return hash.toString(16)
}

function safeParse<T>(raw: string | null): T | undefined {
  if (!raw) return undefined
  try { return JSON.parse(raw) as T } catch { return undefined }
}

export class LocalStorageRepository implements DataRepository {
  version(): number { return CURRENT_VERSION }

  async getAll(): Promise<AppData> {
    const packed = safeParse<{ schemaVersion: number, data: AppData, checksum: string }>(localStorage.getItem(KEY_V1))
    if (packed && packed.schemaVersion === CURRENT_VERSION) {
      const json = JSON.stringify(packed.data)
      if (checksum(json) !== packed.checksum) {
        console.warn('[repo] checksum mismatch, attempting to continue')
      }
      const parsed = AppDataSchema.safeParse(packed.data)
      if (parsed.success) return parsed.data
      console.warn('[repo] invalid data shape, attempting migration fallback')
    }
    // Fallback migrations: legacy keys
    type RawAccount = { id?: string; name?: string; type?: string; currency?: string; platform?: string }
    type RawTransaction = {
      id?: string; accountId?: string; account?: string; type?: 'Income'|'Expense'|'income'|'expense'|string;
      amount?: number | string | { cents: number; currency?: string }; category?: string; date?: string | number | Date; note?: string
    }
    type RawGoal = { id?: string; name?: string; targetAmount?: number | { cents: number; currency?: string }; target_amount?: number; currentAmount?: number | { cents: number; currency?: string }; deadline?: string }
    type RawCategory = { id?: string; name?: string }
    type RawFixedExpense = { id?: string; name?: string; amount?: number | { cents: number; currency?: string }; dueDate?: string }
    const accounts = safeParse<RawAccount[]>(localStorage.getItem('fin_accounts')) || []
    const transactions = safeParse<RawTransaction[]>(localStorage.getItem('fin_transactions')) || []
    const goals = safeParse<RawGoal[]>(localStorage.getItem('fin_goals')) || []
    const categories = safeParse<RawCategory[]>(localStorage.getItem('fin_categories')) || []
    const fixedExpenses = safeParse<RawFixedExpense[]>(localStorage.getItem('fin_fixed_expenses')) || []
    // Normalize best-effort (amount numbers -> cents Money; date -> ISO UTC)
    const toMoney = (amount: number | { cents: number, currency?: string }, currency: string) =>
      typeof amount === 'number' ? { cents: Math.round(amount * 100), currency } : { cents: amount.cents, currency: amount.currency || currency }
    const nowCurrency = 'USD'
    const data: AppData = {
      schemaVersion: CURRENT_VERSION,
      accounts: (accounts || []).map((a) => ({ id: a.id || crypto.randomUUID(), name: String(a.name||''), type: a.type || 'Checking', currency: a.currency || nowCurrency, platform: a.platform || '' })),
      transactions: (transactions || []).map((t) => ({
        id: t.id || new Date().toISOString(),
        accountId: t.accountId || t.account || '',
        type: (t.type === 'Income' || t.type === 'Expense') ? t.type : (t.type === 'income' ? 'Income' : 'Expense'),
        amount: toMoney(typeof t.amount === 'number' ? t.amount : Number(t.amount), nowCurrency),
        category: String(t.category || ''),
        date: new Date(t.date ? t.date : Date.now()).toISOString(),
        note: t.note || undefined
      })),
      categories: (categories || []).map((c) => ({ id: c.id || crypto.randomUUID(), name: String(c.name||'') })),
      fixedExpenses: (fixedExpenses || []).map((fx) => ({ id: fx.id || crypto.randomUUID(), name: String(fx.name||''), amount: toMoney(fx.amount, nowCurrency), dueDate: String(fx.dueDate||'') })),
      goals: (goals || []).map((g) => ({ id: g.id || crypto.randomUUID(), name: String(g.name||'Goal'), targetAmount: toMoney(g.targetAmount ?? g.target_amount ?? 0, nowCurrency), currentAmount: toMoney(g.currentAmount ?? 0, nowCurrency), deadline: g.deadline }))
    }
    // Deduplicate by id
    const dedupe = <T extends { id: string }>(arr: T[]) => Object.values(arr.reduce((acc, it) => { acc[it.id] = it; return acc }, {} as Record<string,T>))
    const deduped: AppData = { ...data,
      accounts: dedupe(data.accounts),
      transactions: dedupe(data.transactions),
      categories: dedupe(data.categories),
      fixedExpenses: dedupe(data.fixedExpenses),
      goals: dedupe(data.goals)
    }
    return deduped
  }

  async saveAll(data: AppData): Promise<void> {
    // Validate and pack with checksum
    const parsed = AppDataSchema.parse(data)
    const json = JSON.stringify(parsed)
    const pack = { schemaVersion: CURRENT_VERSION, data: parsed, checksum: checksum(json) }
    try {
      localStorage.setItem(KEY_V1, JSON.stringify(pack))
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      console.warn('[repo] quota exceeded or write error', message)
      throw e
    }
  }

  async clear(): Promise<void> {
    localStorage.removeItem(KEY_V1)
  }
}



export type View =
  | 'dashboard'
  | 'transactions'
  | 'accounts'
  | 'categories'
  | 'fixed'
  | 'goals'
  | 'settings'
  | 'roadmap'
export type AccountType = 'Checking' | 'Savings' | 'Credit Card' | 'Investment'
export type TransactionType = 'Income' | 'Expense'
export interface Account {
  id: string
  name: string
  type: AccountType
  currency: string
  platform: string
}
export interface Transaction {
  id: string
  accountId: string
  type: TransactionType
  amount: number
  category: string
  date: string
  note?: string
}
export interface Category {
  id: string
  name: string
}

export interface FixedExpense {
  id: string
  name: string
  amount: number
  dueDay: number
}
export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline?: string
}

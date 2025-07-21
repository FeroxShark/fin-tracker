export type View = "dashboard" | "transactions" | "goals" | "settings" | "roadmap"
export type AccountType = 'Checking' | 'Savings' | 'Credit Card' | 'Investment'
export type TransactionType = 'Income' | 'Expense'
export interface Account {
  id: string
  name: string
  type: AccountType
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
export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline?: string
}

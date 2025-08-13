import { z } from 'zod'

export const MoneySchema = z.object({
  cents: z.number().int(),
  currency: z.string().min(1)
})
export type Money = z.infer<typeof MoneySchema>

export const DateIsoSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)

export const AccountIdSchema = z.string().uuid().or(z.string().min(1))
export type AccountId = z.infer<typeof AccountIdSchema>

export const CategoryIdSchema = z.string().min(1)
export type CategoryId = z.infer<typeof CategoryIdSchema>

export const AccountSchema = z.object({
  id: AccountIdSchema,
  name: z.string().min(1),
  type: z.enum(['Checking','Savings','Credit Card','Investment']).or(z.string()),
  currency: z.string().min(1),
  platform: z.string().optional().default('')
})
export type Account = z.infer<typeof AccountSchema>

export const TransactionTypeSchema = z.enum(['Income','Expense'])
export type TransactionType = z.infer<typeof TransactionTypeSchema>

export const TransactionSchema = z.object({
  id: z.string().min(1),
  accountId: AccountIdSchema,
  type: TransactionTypeSchema,
  amount: MoneySchema,
  category: z.string().min(1),
  date: DateIsoSchema,
  note: z.string().optional()
})
export type Transaction = z.infer<typeof TransactionSchema>

export const CategorySchema = z.object({
  id: CategoryIdSchema,
  name: z.string().min(1)
})
export type Category = z.infer<typeof CategorySchema>

export const FixedExpenseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  amount: MoneySchema,
  dueDate: z.string().min(1)
})
export type FixedExpense = z.infer<typeof FixedExpenseSchema>

export const GoalSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  targetAmount: MoneySchema,
  currentAmount: MoneySchema,
  deadline: z.string().optional()
})
export type Goal = z.infer<typeof GoalSchema>

export const AppDataSchema = z.object({
  schemaVersion: z.number().int(),
  accounts: z.array(AccountSchema),
  transactions: z.array(TransactionSchema),
  categories: z.array(CategorySchema),
  fixedExpenses: z.array(FixedExpenseSchema),
  goals: z.array(GoalSchema)
})
export type AppData = z.infer<typeof AppDataSchema>



export type AccountType =
  | 'cash'
  | 'mercadopago_ars'
  | 'mp_usd'
  | 'mp_reserva'
  | 'binance'
  | 'balance_acc'

export interface Account {
  id?: string
  name: string
  type: AccountType
  currency: string
}

export interface Category {
  id?: string
  name: string
  color: string
}

export type TransactionType =
  | 'income'
  | 'expense'
  | 'transfer'
  | 'asset_buy'
  | 'asset_sell'
  | 'yield'
  | 'fee'
  | 'tax'

export interface Transaction {
  id?: string
  type: TransactionType
  amount: number
  date: string
  fromAccount?: string
  toAccount?: string
  categoryId?: string
}

export interface Goal {
  id?: string
  targetType: 'save_pct' | 'invest_pct'
  pct: number
  period: 'mensual'
}

import { useState, useEffect } from 'react'
import { useAccounts } from '../hooks/useAccounts'
import { useTransactions } from '../hooks/useTransactions'
import { useGoals } from '../hooks/useGoals'
import { AccountType, TransactionType } from '../types'
import { Bar, Pie } from 'react-chartjs-2'
import 'chart.js/auto'

export default function Dashboard() {
  const { accounts, addAccount } = useAccounts()
  const { transactions, addTransaction } = useTransactions()
  const { goals } = useGoals()

  const [accName, setAccName] = useState('')
  const [accType, setAccType] = useState<AccountType>('cash')
  const [accCurrency, setAccCurrency] = useState('ARS')

  const [showTx, setShowTx] = useState(false)
  const [txAmount, setTxAmount] = useState('')
  const [txType, setTxType] = useState<TransactionType>('income')
  const [txAccount, setTxAccount] = useState('')

  const [range, setRange] = useState<'month' | 'quarter' | 'year'>('month')
  const [showUsd, setShowUsd] = useState(false)

  const USD_RATE = 1000 // ARS per USD - placeholder value

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'n') {
        setShowTx(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const submitAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accName) return
    await addAccount({ name: accName, type: accType, currency: accCurrency })
    setAccName('')
  }

  const submitTx = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(txAmount)
    if (!txAccount || amount <= 0) return
    await addTransaction({
      type: txType,
      amount,
      date: new Date().toISOString(),
      fromAccount: txAccount,
    })
    setTxAmount('')
    setShowTx(false)
  }

  const now = new Date()
  const rangeStart = (() => {
    if (range === 'month') return new Date(now.getFullYear(), now.getMonth(), 1)
    if (range === 'quarter')
      return new Date(now.getFullYear(), now.getMonth() - 2, 1)
    return new Date(now.getFullYear(), 0, 1)
  })()

  const filteredTx = transactions.filter(
    (t) => new Date(t.date) >= rangeStart
  )

  const balances: Record<string, number> = {}
  filteredTx.forEach((t) => {
    const acc = accounts.find((a) => a.id === t.fromAccount)
    if (!acc) return
    const sign =
      t.type === 'expense' ||
      t.type === 'asset_buy' ||
      t.type === 'fee' ||
      t.type === 'tax'
        ? -1
        : 1
    balances[acc.currency] = (balances[acc.currency] || 0) + sign * t.amount
  })

  const balanceEntries = Object.entries(balances)
  const showBalances = balanceEntries.map(([cur, val]) => {
    if (showUsd && cur === 'ARS') return ['USD', val / USD_RATE]
    return [cur, val]
  })

  const months = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
    return `${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`
  })
  const incomeSeries = Array(12).fill(0)
  const expenseSeries = Array(12).fill(0)
  transactions.forEach((t) => {
    const d = new Date(t.date)
    const idx =
      11 - (now.getFullYear() * 12 + now.getMonth() - (d.getFullYear() * 12 + d.getMonth()))
    if (idx < 0 || idx > 11) return
    if (t.type === 'income') incomeSeries[idx] += t.amount
    if (t.type === 'expense') expenseSeries[idx] += t.amount
  })

  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const catTotals: Record<string, number> = {}
  transactions
    .filter((t) => t.type === 'expense' && new Date(t.date) >= thisMonth)
    .forEach((t) => {
      const cat = t.categoryId || 'Uncategorized'
      catTotals[cat] = (catTotals[cat] || 0) + t.amount
    })

  const goalProgress = goals.map((g) => {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const periodTx = transactions.filter((t) => new Date(t.date) >= start)
    const income = periodTx
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    let pct = 0
    if (g.targetType === 'save_pct') {
      const expense = periodTx
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      if (income > 0) pct = ((income - expense) / income) * 100
    }
    if (g.targetType === 'invest_pct') {
      const invest = periodTx
        .filter((t) => t.type === 'asset_buy')
        .reduce((sum, t) => sum + t.amount, 0)
      if (income > 0) pct = (invest / income) * 100
    }
    const progress = Math.max(0, Math.min(100, (pct / g.pct) * 100))
    return { id: g.id, pct: progress, goal: g.pct }
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <form onSubmit={submitAccount} className="space-x-2 mb-6">
        <input
          value={accName}
          onChange={(e) => setAccName(e.target.value)}
          placeholder="Account name"
          className="border px-2 py-1"
        />
        <select
          value={accType}
          onChange={(e) => setAccType(e.target.value as AccountType)}
          className="border px-2 py-1"
        >
          <option value="cash">Cash</option>
          <option value="mercadopago_ars">Mercadopago ARS</option>
          <option value="mp_usd">MP USD</option>
          <option value="mp_reserva">MP Reserva</option>
          <option value="binance">Binance</option>
          <option value="balance_acc">Balance Account</option>
        </select>
        <select
          value={accCurrency}
          onChange={(e) => setAccCurrency(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="ARS">ARS</option>
          <option value="USD">USD</option>
          <option value="BTC">BTC</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">
          Add Account
        </button>
      </form>

      <ul className="mb-8 space-y-1">
        {accounts.map((a) => (
          <li key={a.id} className="border p-2">
            {a.name} - {a.currency}
          </li>
        ))}
      </ul>

      {showTx && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form onSubmit={submitTx} className="bg-white p-4 space-y-2 rounded">
            <select
              value={txAccount}
              onChange={(e) => setTxAccount(e.target.value)}
              className="border px-2 py-1 w-full"
            >
              <option value="" disabled>
                Select account
              </option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={txAmount}
              onChange={(e) => setTxAmount(e.target.value)}
              className="border px-2 py-1 w-full"
              placeholder="Amount"
              step="0.01"
            />
            <select
              value={txType}
              onChange={(e) => setTxType(e.target.value as TransactionType)}
              className="border px-2 py-1 w-full"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowTx(false)} className="px-2 py-1 border">
                Cancel
              </button>
              <button type="submit" className="px-2 py-1 bg-blue-500 text-white">
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      <h2 className="font-semibold mb-2">Transactions</h2>
      <ul className="space-y-1">
        {transactions.map((tx) => (
          <li key={tx.id} className="border p-2">
            {tx.type} - {tx.amount}
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as typeof range)}
              className="border px-2 py-1"
            >
              <option value="month">Mes</option>
              <option value="quarter">Trimestre</option>
              <option value="year">Año</option>
            </select>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={showUsd}
                onChange={(e) => setShowUsd(e.target.checked)}
              />
              <span>Mostrar en USD</span>
            </label>
          </div>
          <ul className="space-y-1">
            {showBalances.map(([cur, val]) => (
              <li key={cur} className="font-semibold">
                {cur}: {val.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Ingresos vs Gastos (12m)</h3>
          <Bar
            data={{
              labels: months,
              datasets: [
                { label: 'Ingresos', data: incomeSeries, backgroundColor: '#4ade80' },
                { label: 'Gastos', data: expenseSeries, backgroundColor: '#f87171' },
              ],
            }}
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Gasto por categoría (mes)</h3>
          <Pie
            data={{
              labels: Object.keys(catTotals),
              datasets: [
                {
                  data: Object.values(catTotals),
                  backgroundColor: [
                    '#93c5fd',
                    '#fca5a5',
                    '#fdba74',
                    '#fde047',
                    '#86efac',
                    '#a5b4fc',
                  ],
                },
              ],
            }}
          />
        </div>

        {goalProgress.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Progreso de metas</h3>
            <ul className="space-y-2">
              {goalProgress.map((g) => (
                <li key={g.id} className="space-y-1">
                  <div className="h-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-blue-500 rounded"
                      style={{ width: `${g.pct}%` }}
                    />
                  </div>
                  <span>{g.pct.toFixed(1)}% de objetivo {g.goal}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}


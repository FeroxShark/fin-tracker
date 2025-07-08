import { useState, useEffect } from 'react'
import { useAccounts } from '../hooks/useAccounts'
import { useTransactions } from '../hooks/useTransactions'
import { AccountType, TransactionType } from '../types'

export default function Dashboard() {
  const { accounts, addAccount } = useAccounts()
  const { transactions, addTransaction } = useTransactions()

  const [accName, setAccName] = useState('')
  const [accType, setAccType] = useState<AccountType>('cash')
  const [accCurrency, setAccCurrency] = useState('ARS')

  const [showTx, setShowTx] = useState(false)
  const [txAmount, setTxAmount] = useState('')
  const [txType, setTxType] = useState<TransactionType>('income')
  const [txAccount, setTxAccount] = useState('')

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
    </div>
  )
}


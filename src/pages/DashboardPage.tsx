import { FC, useMemo, useState } from 'react'
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Landmark, TrendingUp, PlusCircle } from 'lucide-react'
import { Account, Transaction, Goal } from '../types-fintracker'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { useLanguage } from '../LanguageProvider'

interface Props {
  accounts: Account[]
  transactions: Transaction[]
  goals: Goal[]
  onAddTransaction: () => void
}

const DashboardPage: FC<Props> = ({ accounts, transactions, goals, onAddTransaction }) => {
  const [chartExpanded, setChartExpanded] = useState(false)
  const { t } = useLanguage()
  const { totalBalance, monthlyIncome, monthlyExpense } = useMemo(() => {
    let totalBalance = 0
    accounts.forEach(acc => {
      const bal = transactions
        .filter(t => t.accountId === acc.id)
        .reduce((accum, t) => accum + (t.type === 'Income' ? t.amount : -t.amount), 0)
      totalBalance += bal
    })

    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    const monthlyTx = transactions.filter(t => {
      const d = parseISO(t.date)
      return d >= monthStart && d <= monthEnd
    })

    const monthlyIncome = monthlyTx.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0)
    const monthlyExpense = monthlyTx.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0)

    return { totalBalance, monthlyIncome, monthlyExpense }
  }, [accounts, transactions])

  const chartData = useMemo(() => {
    const last6 = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), 5 - i))
    return last6.map(m => {
      const mStart = startOfMonth(m)
      const mEnd = endOfMonth(m)
      const tx = transactions.filter(t => {
        const d = parseISO(t.date)
        return d >= mStart && d <= mEnd
      })
      const income = tx.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0)
      const expense = tx.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0)
      return { name: format(m, 'MMM'), Income: income, Expense: expense }
    })
  }, [transactions])

  const recentTx = [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0,5)

  return (
    <div className="w-full h-full">
      <main className="space-y-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title={t('totalBalance')} value={`$${totalBalance.toFixed(2)}`} icon={<Landmark className="w-6 h-6 text-blue-600" />} />
        <StatCard title={t('monthlyIncome')} value={`$${monthlyIncome.toFixed(2)}`} icon={<TrendingUp className="w-6 h-6 text-green-500" />} />
        <StatCard title={t('monthlyExpense')} value={`$${monthlyExpense.toFixed(2)}`} icon={<TrendingUp className="w-6 h-6 text-red-500 transform -scale-y-100" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-800">{t('incomeVsExpense')}</h3>
            <button onClick={() => setChartExpanded(true)} className="text-slate-600 hover:text-slate-800 transition-colors">
              {t('expand')}
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="Income" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-bold text-lg mb-4 text-slate-800">{t('financialGoals')}</h3>
          <div className="space-y-4">
            {goals.length > 0 ? goals.map(goal => {
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
              return (
                <div key={goal.id}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium text-slate-700">{goal.name}</span>
                    <span className="text-slate-500">{`$${goal.currentAmount.toFixed(2)} / $${goal.targetAmount.toFixed(2)}`}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                </div>
              )
            }) : <p className="text-slate-500 text-center py-4">{t('noGoals')}</p>}
          </div>
        </Card>
        </div>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-800">{t('recentTransactions')}</h3>
            <Button onClick={onAddTransaction}><PlusCircle className="w-4 h-4" /> {t('newTransaction')}</Button>
          </div>
          <div className="flow-root">
          <ul role="list" className="-my-4 divide-y divide-slate-200">
            {recentTx.length > 0 ? recentTx.map(t => {
              const acc = accounts.find(a => a.id === t.accountId)
              return (
                <li key={t.id} className="flex items-center py-4 space-x-4">
                  <div className={`p-3 rounded-full ${t.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  <TrendingUp className={`w-5 h-5 ${t.type === 'Expense' && 'transform -scale-y-100'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{t.category}</p>
                    <p className="text-sm text-slate-500 truncate">{acc?.name || t('unknownAccount')}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>{`${t.type === 'Income' ? '+' : '-'}$${t.amount.toFixed(2)}`}</p>
                    <p className="text-sm text-slate-500">{format(parseISO(t.date), 'MMM d, yyyy')}</p>
                  </div>
                </li>
              )
            }) : <p className="text-slate-500 text-center py-4">{t('noTransactions')}</p>}
          </ul>
          </div>
        </Card>
      </main>
      <Modal isOpen={chartExpanded} onClose={() => setChartExpanded(false)} title={t('incomeVsExpenseTitle')}>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
              <YAxis tick={{ fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
              <Legend iconType="circle" />
              <Line type="monotone" dataKey="Income" stroke="#22c55e" strokeWidth={2} />
              <Line type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Modal>
    </div>
  )
}

export default DashboardPage

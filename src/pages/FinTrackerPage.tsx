import { FC, useState, useEffect, useCallback } from 'react'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  Settings,
  Info,
  PiggyBank,
  CreditCard,
  MoreVertical,
  Repeat
} from 'lucide-react'
import { Moon, Sun } from 'lucide-react'
import DashboardPage from './DashboardPage'
import TransactionsPage from './TransactionsPage'
import AccountsPage from './AccountsPage'
import CategoriesPage from './CategoriesPage'
import FixedExpensesPage from './FixedExpensesPage'
import SettingsPage from './SettingsPage'
import RoadmapPage from './RoadmapPage'
import Modal from '../components/Modal'
import TopNav from '../components/TopNav'
import Sidebar from '../components/Sidebar'
import TransactionForm from '../components/TransactionForm'
import { Transaction as UiTransaction, Account as UiAccount, Category as UiCategory, FixedExpense as UiFixedExpense, View } from '../types-fintracker'
import type { Transaction as DomainTransaction, FixedExpense as DomainFixedExpense } from '@entities/types'
import { useAccounts } from '@app/hooks/useAccounts'
import { useTransactions } from '@app/hooks/useTransactions'
import { useCategories } from '@app/hooks/useCategories'
import { useFixedExpenses } from '@app/hooks/useFixedExpenses'
import { useGoals } from '@app/hooks/useGoals'
import { useAppData } from '@app/hooks/useAppData'
import { moneyToNumber, numberToMoney } from '@shared/money'
import { useDarkMode } from '../hooks/useDarkMode'
import Card from '../components/Card'
import { useLanguage } from '../LanguageProvider'

const FinTrackerPage: FC = () => {
  const [view, setView] = useState<View>('dashboard')
  const { accounts, addAccount, deleteAccount } = useAccounts()
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions()
  const { categories, addCategory, deleteCategory } = useCategories()
  const { fixedExpenses, addFixedExpense, updateFixedExpense, deleteFixedExpense } = useFixedExpenses()
  const { goals } = useGoals()
  const { exportData, importData, clearData, hydrate, hydrated } = useAppData()
  const [darkMode, setDarkMode] = useDarkMode()
  const { t } = useLanguage()

  const [isTxModalOpen, setTxModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<UiTransaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try { await hydrate() } finally { setIsLoading(false) }
    }
    init()
  }, [hydrate])

  const handleAddTransaction = () => {
    setEditingTransaction(null)
    setTxModalOpen(true)
  }

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx)
    setTxModalOpen(true)
  }

  const handleSaveTransaction = async (txData: Omit<UiTransaction, 'id'> & { id?: string }) => {
    const currency = accounts.find(a => a.id === txData.accountId)?.currency || 'USD'
    const payload: Omit<DomainTransaction, 'id'> & { id?: string } = {
      accountId: txData.accountId,
      type: txData.type as DomainTransaction['type'],
      amount: numberToMoney(txData.amount, currency),
      category: txData.category,
      date: txData.date,
      note: txData.note
    }
    if (txData.id) await updateTransaction(txData.id, payload)
    else await addTransaction(payload)
    setTxModalOpen(false)
    setEditingTransaction(null)
  }

  const handleDeleteTransaction = async (id: string) => { await deleteTransaction(id) }

  const handleAddAccount = async (acc: Omit<UiAccount, 'id'>) => { await addAccount(acc) }

  const handleDeleteAccount = async (id: string) => { await deleteAccount(id) }

  const handleAddCategory = async (cat: Omit<UiCategory, 'id'>) => { await addCategory(cat) }

  const handleDeleteCategory = async (id: string) => { await deleteCategory(id) }

  const handleAddFixed = async (f: Omit<UiFixedExpense, 'id'>) => {
    const payload: Omit<DomainFixedExpense, 'id'> = {
      name: f.name,
      amount: numberToMoney(f.amount, 'USD'),
      dueDate: f.dueDate
    }
    await addFixedExpense(payload)
  }

  const handleDeleteFixed = async (id: string) => { await deleteFixedExpense(id) }

  const handleUpdateFixed = async (id: string, data: Partial<UiFixedExpense>) => {
    const update: Partial<DomainFixedExpense> = {
      name: data.name,
      amount: typeof data.amount === 'number' ? numberToMoney(data.amount, 'USD') : undefined,
      dueDate: data.dueDate
    }
    await updateFixedExpense(id, update)
  }

  const handleExport = () => { exportData() }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (window.confirm(t('overwriteConfirm'))) {
      const ok = await importData(file)
      if (ok) { alert(t('importSuccess')); setView('dashboard') } else { alert(t('invalidFile')) }
    }
    e.target.value = ''
  }

  const handleClearData = async () => {
    if (window.confirm(t('clearConfirm'))) { await clearData(); alert(t('cleared')) }
  }

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'n' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
      e.preventDefault()
      handleAddTransaction()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const transactionsUi: UiTransaction[] = transactions.map(tx => ({
    id: tx.id,
    accountId: tx.accountId,
    type: tx.type as UiTransaction['type'],
    amount: moneyToNumber(tx.amount),
    category: tx.category,
    date: tx.date,
    note: tx.note
  }))

  const fixedExpensesUi: UiFixedExpense[] = fixedExpenses.map(fx => ({
    id: fx.id,
    name: fx.name,
    amount: moneyToNumber(fx.amount),
    dueDate: fx.dueDate
  }))

  const accountsUi: UiAccount[] = accounts as unknown as UiAccount[]

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardPage accounts={accountsUi} transactions={transactionsUi} goals={goals as unknown as any} onAddTransaction={handleAddTransaction} />
      case 'transactions':
        return <TransactionsPage transactions={transactionsUi} accounts={accountsUi} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />
      case 'accounts':
        return <AccountsPage accounts={accountsUi} onAdd={handleAddAccount} onDelete={handleDeleteAccount} />
      case 'categories':
        return <CategoriesPage categories={categories as unknown as any} onAdd={handleAddCategory} onDelete={handleDeleteCategory} />
      case 'fixed':
        return <FixedExpensesPage expenses={fixedExpensesUi} onAdd={handleAddFixed} onDelete={handleDeleteFixed} onUpdate={handleUpdateFixed} />
      case 'goals':
        return <Card><h2 className="text-2xl font-bold text-slate-800">{t('goals')}</h2><p className="text-slate-500 mt-4">{t('goalsComingSoon')}</p></Card>
      case 'settings':
        return <SettingsPage onExport={handleExport} onImport={handleImport} onClearData={handleClearData} />
      case 'roadmap':
        return <RoadmapPage />
      default:
        return <DashboardPage accounts={accountsUi} transactions={transactionsUi} goals={goals as unknown as any} onAddTransaction={handleAddTransaction} />
    }
  }

  const NavItem: FC<{ currentView: View; targetView: View; setView: (v: View) => void; icon: JSX.Element }> = ({ currentView, targetView, setView, icon, children }) => (
    <li>
      <a href={`/${targetView}`} onClick={e => { e.preventDefault(); setView(targetView); history.pushState({}, '', `${import.meta.env.BASE_URL}${targetView}`) }} className={`flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200 ${currentView === targetView ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
        {icon}
        <span className="ml-3 flex-1 whitespace-nowrap">{children}</span>
      </a>
    </li>
  )

  if (!hydrated || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <TopNav onAddTransaction={handleAddTransaction} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[240px,1fr] gap-6 pt-6">
          <Sidebar view={view} setView={setView} labels={{
            dashboard: t('dashboard'), transactions: t('transactions'), accounts: t('accounts'), categories: t('categories'), fixed: t('fixed'), goals: t('goals'), settings: t('settings'), roadmap: t('roadmap')
          }} />
          <main>
            {renderView()}
          </main>
        </div>
      </div>
      <Modal isOpen={isTxModalOpen} onClose={() => setTxModalOpen(false)} title={editingTransaction ? t('editTransaction') : t('newTransaction')}>
        <TransactionForm transaction={editingTransaction as unknown as UiTransaction} accounts={accountsUi} categories={categories as unknown as UiCategory[]} onSave={handleSaveTransaction} onClose={() => setTxModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default FinTrackerPage

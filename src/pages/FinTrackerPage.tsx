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
import TransactionForm from '../components/TransactionForm'
import { View } from '../types-fintracker'
import { Transaction, Account, Category, FixedExpense } from '@entities/types'
import { useAccounts } from '@app/hooks/useAccounts'
import { useTransactions } from '@app/hooks/useTransactions'
import { useCategories } from '@app/hooks/useCategories'
import { useFixedExpenses } from '@app/hooks/useFixedExpenses'
import { useGoals } from '@app/hooks/useGoals'
import { useAppData } from '@app/hooks/useAppData'
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
  const { exportData, importData, clearData } = useAppData()
  const [darkMode, setDarkMode] = useDarkMode()
  const { t } = useLanguage()

  const [isTxModalOpen, setTxModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Hydrate data on mount
  useEffect(() => {
    const initData = async () => {
      try {
        const { hydrate } = useAppData()
        await hydrate()
      } catch (error) {
        console.error('Failed to hydrate data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    initData()
  }, [])

  const handleAddTransaction = () => {
    setEditingTransaction(null)
    setTxModalOpen(true)
  }

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx)
    setTxModalOpen(true)
  }

  const handleSaveTransaction = async (txData: Omit<Transaction, 'id'> & { id?: string }) => {
    if (txData.id) {
      await updateTransaction(txData.id, txData)
    } else {
      await addTransaction(txData)
    }
    setTxModalOpen(false)
    setEditingTransaction(null)
  }

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id)
  }

  const handleAddAccount = async (acc: Omit<Account, 'id'>) => {
    await addAccount(acc)
  }

  const handleDeleteAccount = async (id: string) => {
    await deleteAccount(id)
  }

  const handleAddCategory = async (cat: Omit<Category, 'id'>) => {
    await addCategory(cat)
  }

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id)
  }

  const handleAddFixed = async (f: Omit<FixedExpense, 'id'>) => {
    await addFixedExpense(f)
  }

  const handleDeleteFixed = async (id: string) => {
    await deleteFixedExpense(id)
  }

  const handleUpdateFixed = async (id: string, data: Partial<FixedExpense>) => {
    await updateFixedExpense(id, data)
  }

  const handleExport = () => {
    exportData()
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (window.confirm(t('overwriteConfirm'))) {
      const success = await importData(file)
      if (success) {
        alert(t('importSuccess'))
        setView('dashboard')
      } else {
        alert(t('invalidFile'))
      }
    }
    e.target.value = ''
  }

  const handleClearData = async () => {
    if (window.confirm(t('clearConfirm'))) {
      await clearData()
      alert(t('cleared'))
    }
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

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardPage accounts={accounts} transactions={transactions} goals={goals} onAddTransaction={handleAddTransaction} />
      case 'transactions':
        return <TransactionsPage transactions={transactions} accounts={accounts} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />
      case 'accounts':
        return <AccountsPage accounts={accounts} onAdd={handleAddAccount} onDelete={handleDeleteAccount} />
      case 'categories':
        return <CategoriesPage categories={categories} onAdd={handleAddCategory} onDelete={handleDeleteCategory} />
      case 'fixed':
        return <FixedExpensesPage expenses={fixedExpenses} onAdd={handleAddFixed} onDelete={handleDeleteFixed} onUpdate={handleUpdateFixed} />
      case 'goals':
        return <Card><h2 className="text-2xl font-bold text-slate-800">{t('goals')}</h2><p className="text-slate-500 mt-4">{t('goalsComingSoon')}</p></Card>
      case 'settings':
        return <SettingsPage onExport={handleExport} onImport={handleImport} onClearData={handleClearData} />
      case 'roadmap':
        return <RoadmapPage />
      default:
        return <DashboardPage accounts={accounts} transactions={transactions} goals={goals} onAddTransaction={handleAddTransaction} />
    }
  }

  const NavItem: FC<{ currentView: View; targetView: View; setView: (v: View) => void; icon: JSX.Element }> = ({ currentView, targetView, setView, icon, children }) => (
    <li>
      <a href="#" onClick={e => { e.preventDefault(); setView(targetView) }} className={`flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200 ${currentView === targetView ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
        {icon}
        <span className="ml-3 flex-1 whitespace-nowrap">{children}</span>
      </a>
    </li>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r border-slate-200">
          <a href="#" onClick={e => { e.preventDefault(); setView('dashboard') }} className="flex items-center pl-2.5 mb-5">
            <PiggyBank className="h-8 w-8 mr-2 text-blue-600" />
            <span className="self-center text-xl font-semibold whitespace-nowrap">Fin Tracker</span>
          </a>
          <ul className="space-y-2">
            <NavItem currentView={view} targetView="dashboard" setView={setView} icon={<LayoutDashboard className="w-6 h-6" />}>{t('dashboard')}</NavItem>
            <NavItem currentView={view} targetView="transactions" setView={setView} icon={<ArrowLeftRight className="w-6 h-6" />}>{t('transactions')}</NavItem>
            <NavItem currentView={view} targetView="accounts" setView={setView} icon={<CreditCard className="w-6 h-6" />}>{t('accounts')}</NavItem>
            <NavItem currentView={view} targetView="categories" setView={setView} icon={<MoreVertical className="w-6 h-6" />}>{t('categories')}</NavItem>
            <NavItem currentView={view} targetView="fixed" setView={setView} icon={<Repeat className="w-6 h-6" />}>{t('fixed')}</NavItem>
            <NavItem currentView={view} targetView="goals" setView={setView} icon={<Target className="w-6 h-6" />}>{t('goals')}</NavItem>
            <NavItem currentView={view} targetView="settings" setView={setView} icon={<Settings className="w-6 h-6" />}>{t('settings')}</NavItem>
            <NavItem currentView={view} targetView="roadmap" setView={setView} icon={<Info className="w-6 h-6" />}>{t('roadmap')}</NavItem>
            <li>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200 text-slate-600 hover:bg-slate-100 w-full"
              >
                {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                <span className="ml-3 flex-1 whitespace-nowrap">{darkMode ? t('lightMode') : t('darkMode')}</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <main className="p-4 sm:ml-64">
        <div className="mt-14">
          {renderView()}
        </div>
      </main>

      <Modal isOpen={isTxModalOpen} onClose={() => setTxModalOpen(false)} title={editingTransaction ? t('editTransaction') : t('newTransaction')}>
        <TransactionForm transaction={editingTransaction} accounts={accounts} categories={categories} onSave={handleSaveTransaction} onClose={() => setTxModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default FinTrackerPage

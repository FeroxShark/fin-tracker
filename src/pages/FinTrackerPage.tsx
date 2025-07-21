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
import DashboardView from '../views/DashboardView'
import TransactionsView from '../views/TransactionsView'
import AccountsView from '../views/AccountsView'
import CategoriesView from '../views/CategoriesView'
import FixedExpensesView from '../views/FixedExpensesView'
import SettingsView from '../views/SettingsView'
import RoadmapView from '../views/RoadmapView'
import Modal from '../components/Modal'
import TransactionForm from '../components/TransactionForm'
import {
  Account,
  Transaction,
  Goal,
  Category,
  FixedExpense,
  View
} from '../types-fintracker'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useDarkMode } from '../hooks/useDarkMode'
import Card from '../components/Card'

const FinTrackerPage: FC = () => {
  const [view, setView] = useState<View>('dashboard')
  const [accounts, setAccounts] = useLocalStorage<Account[]>('fin_accounts', [])
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('fin_transactions', [])
  const [goals, setGoals] = useLocalStorage<Goal[]>('fin_goals', [])
  const [categories, setCategories] = useLocalStorage<Category[]>('fin_categories', [])
  const [fixedExpenses, setFixedExpenses] = useLocalStorage<FixedExpense[]>('fin_fixed_expenses', [])
  const [darkMode, setDarkMode] = useDarkMode()

  const [isTxModalOpen, setTxModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const handleAddTransaction = () => {
    setEditingTransaction(null)
    setTxModalOpen(true)
  }

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx)
    setTxModalOpen(true)
  }

  const handleSaveTransaction = (txData: Omit<Transaction, 'id'> & { id?: string }) => {
    if (txData.id) {
      setTransactions(prev => prev.map(t => t.id === txData.id ? { ...t, ...txData } : t))
    } else {
      setTransactions(prev => [...prev, { ...txData, id: new Date().toISOString() }])
    }
    setTxModalOpen(false)
    setEditingTransaction(null)
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const handleAddAccount = (acc: Omit<Account, 'id'>) => {
    setAccounts(prev => [...prev, { ...acc, id: crypto.randomUUID() }])
  }

  const handleDeleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id))
  }

  const handleAddCategory = (cat: Omit<Category, 'id'>) => {
    setCategories(prev => [...prev, { ...cat, id: crypto.randomUUID() }])
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  const handleAddFixed = (f: Omit<FixedExpense, 'id'>) => {
    setFixedExpenses(prev => [...prev, { ...f, id: crypto.randomUUID() }])
  }

  const handleDeleteFixed = (id: string) => {
    setFixedExpenses(prev => prev.filter(fx => fx.id !== id))
  }

  const handleUpdateFixed = (id: string, data: Partial<FixedExpense>) => {
    setFixedExpenses(prev => prev.map(fx => fx.id === id ? { ...fx, ...data } : fx))
  }

  const handleExport = () => {
    const data = JSON.stringify({ accounts, transactions, goals, categories, fixedExpenses }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fin-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (data.accounts && data.transactions && data.goals) {
          if (window.confirm('This will overwrite all current data. Are you sure?')) {
            setAccounts(data.accounts)
            setTransactions(data.transactions)
            setGoals(data.goals)
            if (data.categories) setCategories(data.categories)
            if (data.fixedExpenses) setFixedExpenses(data.fixedExpenses)
            alert('Data imported successfully!')
            setView('dashboard')
          }
        }
      } catch {
        alert('Invalid file format.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleClearData = () => {
    if (window.confirm('DANGER: This will permanently delete all your data. This cannot be undone. Are you sure?')) {
      setAccounts([])
      setTransactions([])
      setGoals([])
      setCategories([])
      setFixedExpenses([])
      alert('All data has been cleared.')
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
        return <DashboardView accounts={accounts} transactions={transactions} goals={goals} onAddTransaction={handleAddTransaction} />
      case 'transactions':
        return <TransactionsView transactions={transactions} accounts={accounts} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />
      case 'accounts':
        return <AccountsView accounts={accounts} onAdd={handleAddAccount} onDelete={handleDeleteAccount} />
      case 'categories':
        return <CategoriesView categories={categories} onAdd={handleAddCategory} onDelete={handleDeleteCategory} />
      case 'fixed':
        return <FixedExpensesView expenses={fixedExpenses} onAdd={handleAddFixed} onDelete={handleDeleteFixed} onUpdate={handleUpdateFixed} />
      case 'goals':
        return <Card><h2 className="text-2xl font-bold text-slate-800">Goals</h2><p className="text-slate-500 mt-4">Goal management coming soon!</p></Card>
      case 'settings':
        return <SettingsView onExport={handleExport} onImport={handleImport} onClearData={handleClearData} />
      case 'roadmap':
        return <RoadmapView />
      default:
        return <DashboardView accounts={accounts} transactions={transactions} goals={goals} onAddTransaction={handleAddTransaction} />
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r border-slate-200">
          <a href="#" onClick={e => { e.preventDefault(); setView('dashboard') }} className="flex items-center pl-2.5 mb-5">
            <PiggyBank className="h-8 w-8 mr-2 text-blue-600" />
            <span className="self-center text-xl font-semibold whitespace-nowrap">Fin Tracker</span>
          </a>
          <ul className="space-y-2">
            <NavItem currentView={view} targetView="dashboard" setView={setView} icon={<LayoutDashboard className="w-6 h-6" />}>Dashboard</NavItem>
            <NavItem currentView={view} targetView="transactions" setView={setView} icon={<ArrowLeftRight className="w-6 h-6" />}>Transactions</NavItem>
            <NavItem currentView={view} targetView="accounts" setView={setView} icon={<CreditCard className="w-6 h-6" />}>Accounts</NavItem>
            <NavItem currentView={view} targetView="categories" setView={setView} icon={<MoreVertical className="w-6 h-6" />}>Categories</NavItem>
            <NavItem currentView={view} targetView="fixed" setView={setView} icon={<Repeat className="w-6 h-6" />}>Fixed Expenses</NavItem>
            <NavItem currentView={view} targetView="goals" setView={setView} icon={<Target className="w-6 h-6" />}>Goals</NavItem>
            <NavItem currentView={view} targetView="settings" setView={setView} icon={<Settings className="w-6 h-6" />}>Settings</NavItem>
            <NavItem currentView={view} targetView="roadmap" setView={setView} icon={<Info className="w-6 h-6" />}>Roadmap</NavItem>
            <li>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200 text-slate-600 hover:bg-slate-100 w-full"
              >
                {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                <span className="ml-3 flex-1 whitespace-nowrap">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
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

      <Modal isOpen={isTxModalOpen} onClose={() => setTxModalOpen(false)} title={editingTransaction ? 'Edit Transaction' : 'New Transaction'}>
        <TransactionForm transaction={editingTransaction} accounts={accounts} categories={categories} onSave={handleSaveTransaction} onClose={() => setTxModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default FinTrackerPage

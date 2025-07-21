import { FC, useState, useEffect, useCallback } from 'react'
import { LayoutDashboard, ArrowLeftRight, Target, Settings, Info, PiggyBank } from 'lucide-react'
import DashboardView from '../views/DashboardView'
import TransactionsView from '../views/TransactionsView'
import SettingsView from '../views/SettingsView'
import RoadmapView from '../views/RoadmapView'
import Modal from '../components/Modal'
import TransactionForm from '../components/TransactionForm'
import { Account, Transaction, Goal, View } from '../types-fintracker'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Card from '../components/Card'

const FinTrackerPage: FC = () => {
  const [view, setView] = useState<View>('dashboard')
  const [accounts, setAccounts] = useLocalStorage<Account[]>('fin_accounts', [])
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('fin_transactions', [])
  const [goals, setGoals] = useLocalStorage<Goal[]>('fin_goals', [])

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

  const handleExport = () => {
    const data = JSON.stringify({ accounts, transactions, goals }, null, 2)
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
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r border-slate-200">
          <a href="#" onClick={e => { e.preventDefault(); setView('dashboard') }} className="flex items-center pl-2.5 mb-5">
            <PiggyBank className="h-8 w-8 mr-2 text-blue-600" />
            <span className="self-center text-xl font-semibold whitespace-nowrap">Fin Tracker</span>
          </a>
          <ul className="space-y-2">
            <NavItem currentView={view} targetView="dashboard" setView={setView} icon={<LayoutDashboard className="w-6 h-6" />}>Dashboard</NavItem>
            <NavItem currentView={view} targetView="transactions" setView={setView} icon={<ArrowLeftRight className="w-6 h-6" />}>Transactions</NavItem>
            <NavItem currentView={view} targetView="goals" setView={setView} icon={<Target className="w-6 h-6" />}>Goals</NavItem>
            <NavItem currentView={view} targetView="settings" setView={setView} icon={<Settings className="w-6 h-6" />}>Settings</NavItem>
            <NavItem currentView={view} targetView="roadmap" setView={setView} icon={<Info className="w-6 h-6" />}>Roadmap</NavItem>
          </ul>
        </div>
      </aside>

      <main className="p-4 sm:ml-64">
        <div className="mt-14">
          {renderView()}
        </div>
      </main>

      <Modal isOpen={isTxModalOpen} onClose={() => setTxModalOpen(false)} title={editingTransaction ? 'Edit Transaction' : 'New Transaction'}>
        <TransactionForm transaction={editingTransaction} accounts={accounts} onSave={handleSaveTransaction} onClose={() => setTxModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default FinTrackerPage

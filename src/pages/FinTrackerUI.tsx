import { useState, useEffect, useMemo, FC, ReactNode, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { PlusCircle, Download, Upload, Settings, Target, LayoutDashboard, Trash2, Edit, X, Info, Landmark, ArrowLeftRight, PiggyBank, CreditCard, TrendingUp } from 'lucide-react';

// TYPE DEFINITIONS
// ==============================================
type AccountType = 'Checking' | 'Savings' | 'Credit Card' | 'Investment';
type TransactionType = 'Income' | 'Expense';
type View = 'dashboard' | 'transactions' | 'goals' | 'settings' | 'roadmap';

interface Account {
  id: string;
  name: string;
  type: AccountType;
}

interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // ISO string format
  note?: string;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

// MOCK DATA & HELPERS
// ==============================================
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const ACCOUNT_ICONS: { [key in AccountType]: ReactNode } = {
  Checking: <Landmark className="w-4 h-4" />,
  Savings: <PiggyBank className="w-4 h-4" />,
  'Credit Card': <CreditCard className="w-4 h-4" />,
  Investment: <TrendingUp className="w-4 h-4" />,
};

// UI COMPONENTS
// ==============================================
const Card: FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white border border-slate-200 rounded-xl shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

const StatCard: FC<{ title: string; value: string; icon: ReactNode }> = ({ title, value, icon }) => (
  <Card>
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-100 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  </Card>
);

const Button: FC<{ onClick?: () => void; children: ReactNode; variant?: 'primary' | 'secondary' | 'danger'; className?: string }> = ({ onClick, children, variant = 'primary', className = '' }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };
  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Modal: FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// FORMS
// ==============================================
const TransactionForm: FC<{
    transaction?: Transaction | null;
    accounts: Account[];
    onSave: (transaction: Omit<Transaction, 'id'> & { id?: string }) => void;
    onClose: () => void;
}> = ({ transaction, accounts, onSave, onClose }) => {
    const [amount, setAmount] = useState(transaction?.amount.toString() || '');
    const [accountId, setAccountId] = useState(transaction?.accountId || (accounts[0]?.id || ''));
    const [type, setType] = useState<TransactionType>(transaction?.type || 'Expense');
    const [category, setCategory] = useState(transaction?.category || '');
    const [date, setDate] = useState(transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState(transaction?.note || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !accountId || !category) {
            alert('Please fill all required fields.');
            return;
        }
        onSave({
            ...(transaction && { id: transaction.id }),
            accountId,
            type,
            amount: parseFloat(amount),
            category,
            date: new Date(date).toISOString(),
            note,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
                <div className="flex gap-2">
                    <button type="button" onClick={() => setType('Income')} className={`w-full py-2 rounded-md ${type === 'Income' ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>Income</button>
                    <button type="button" onClick={() => setType('Expense')} className={`w-full py-2 rounded-md ${type === 'Expense' ? 'bg-red-500 text-white' : 'bg-slate-200'}`}>Expense</button>
                </div>
            </div>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-600 mb-1">Amount</label>
                <input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full p-2 border border-slate-300 rounded-md" required />
            </div>
            <div>
                <label htmlFor="account" className="block text-sm font-medium text-slate-600 mb-1">Account</label>
                <select id="account" value={accountId} onChange={e => setAccountId(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" required>
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                <input id="category" type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g., Groceries, Salary" className="w-full p-2 border border-slate-300 rounded-md" required />
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-600 mb-1">Date</label>
                <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" required />
            </div>
            <div>
                <label htmlFor="note" className="block text-sm font-medium text-slate-600 mb-1">Note (Optional)</label>
                <textarea id="note" value={note} onChange={e => setNote(e.target.value)} rows={2} className="w-full p-2 border border-slate-300 rounded-md"></textarea>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button onClick={onClose} variant="secondary">Cancel</Button>
                <Button>Save Transaction</Button>
            </div>
        </form>
    );
};

// VIEWS / PAGES
// ==============================================
const DashboardView: FC<{ 
    accounts: Account[];
    transactions: Transaction[];
    goals: Goal[];
    onAddTransaction: () => void;
}> = ({ accounts, transactions, goals, onAddTransaction }) => {
    const { totalBalance, monthlyIncome, monthlyExpense } = useMemo(() => {
        let totalBalance = 0;
        accounts.forEach(account => {
            const balance = transactions
                .filter(t => t.accountId === account.id)
                .reduce((acc, t) => acc + (t.type === 'Income' ? t.amount : -t.amount), 0);
            totalBalance += balance;
        });

        const now = new Date();
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);

        const monthlyTransactions = transactions.filter(t => {
            const tDate = parseISO(t.date);
            return tDate >= monthStart && tDate <= monthEnd;
        });

        const monthlyIncome = monthlyTransactions
            .filter(t => t.type === 'Income')
            .reduce((sum, t) => sum + t.amount, 0);

        const monthlyExpense = monthlyTransactions
            .filter(t => t.type === 'Expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return { totalBalance, monthlyIncome, monthlyExpense };
    }, [accounts, transactions]);

    const chartData = useMemo(() => {
        const last6Months = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), 5 - i));
        return last6Months.map(month => {
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(month);
            const monthTransactions = transactions.filter(t => {
                const tDate = parseISO(t.date);
                return tDate >= monthStart && tDate <= monthEnd;
            });
            const income = monthTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
            const expense = monthTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
            return { name: format(month, 'MMM'), Income: income, Expense: expense };
        });
    }, [transactions]);

    const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Balance" value={`$${totalBalance.toFixed(2)}`} icon={<Landmark className="w-6 h-6 text-blue-600" />} />
                <StatCard title="Monthly Income" value={`$${monthlyIncome.toFixed(2)}`} icon={<TrendingUp className="w-6 h-6 text-green-500" />} />
                <StatCard title="Monthly Expense" value={`$${monthlyExpense.toFixed(2)}`} icon={<TrendingUp className="w-6 h-6 text-red-500 transform -scale-y-100" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Income vs Expense (Last 6 Months)</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
                                <Legend iconType="circle" />
                                <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card>
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Financial Goals</h3>
                    <div className="space-y-4">
                        {goals.length > 0 ? goals.map(goal => {
                            const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                            return (
                                <div key={goal.id}>
                                    <div className="flex justify-between mb-1 text-sm">
                                        <span className="font-medium text-slate-700">{goal.name}</span>
                                        <span className="text-slate-500">{`$${goal.currentAmount.toFixed(2)} / $${goal.targetAmount.toFixed(2)}`}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                    </div>
                                </div>
                            );
                        }) : <p className="text-slate-500 text-center py-4">No goals set yet. Go to the Goals tab to create one!</p>}
                    </div>
                </Card>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800">Recent Transactions</h3>
                    <Button onClick={onAddTransaction}><PlusCircle className="w-4 h-4" /> New Transaction</Button>
                </div>
                <div className="flow-root">
                    <ul role="list" className="-my-4 divide-y divide-slate-200">
                        {recentTransactions.length > 0 ? recentTransactions.map(t => {
                            const account = accounts.find(a => a.id === t.accountId);
                            return (
                                <li key={t.id} className="flex items-center py-4 space-x-4">
                                    <div className={`p-3 rounded-full ${t.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        <TrendingUp className={`w-5 h-5 ${t.type === 'Expense' && 'transform -scale-y-100'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">{t.category}</p>
                                        <p className="text-sm text-slate-500 truncate">{account?.name || 'Unknown Account'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-semibold ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>{`${t.type === 'Income' ? '+' : '-'}$${t.amount.toFixed(2)}`}</p>
                                        <p className="text-sm text-slate-500">{format(parseISO(t.date), 'MMM d, yyyy')}</p>
                                    </div>
                                </li>
                            );
                        }) : <p className="text-slate-500 text-center py-4">No transactions yet. Add one to get started!</p>}
                    </ul>
                </div>
            </Card>
        </div>
    );
};

const TransactionsView: FC<{ 
    transactions: Transaction[];
    accounts: Account[];
    onDelete: (id: string) => void;
    onEdit: (transaction: Transaction) => void;
}> = ({ transactions, accounts, onDelete, onEdit }) => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <Card>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">All Transactions</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Account</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {sortedTransactions.map(t => {
                            const account = accounts.find(a => a.id === t.accountId);
                            return (
                                <tr key={t.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{format(parseISO(t.date), 'PP')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{t.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{account?.name}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'Income' ? '+' : '-'}${t.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium space-x-2">
                                        <button onClick={() => onEdit(t)} className="text-blue-600 hover:text-blue-800"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => window.confirm('Are you sure?') && onDelete(t.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {sortedTransactions.length === 0 && <p className="text-center py-8 text-slate-500">No transactions found.</p>}
            </div>
        </Card>
    );
};

const SettingsView: FC<{ onExport: () => void; onImport: (e: React.ChangeEvent<HTMLInputElement>) => void; onClearData: () => void; }> = ({ onExport, onImport, onClearData }) => (
    <div className="space-y-8">
        <Card>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Data Management</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                        <h4 className="font-semibold text-slate-700">Export Data</h4>
                        <p className="text-sm text-slate-500">Download all your accounts, transactions, and goals as a JSON file.</p>
                    </div>
                    <Button onClick={onExport} variant="secondary"><Download className="w-4 h-4" /> Export</Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                        <h4 className="font-semibold text-slate-700">Import Data</h4>
                        <p className="text-sm text-slate-500">Import data from a previously exported JSON file. This will overwrite current data.</p>
                    </div>
                    <label className="px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400 cursor-pointer">
                        <Upload className="w-4 h-4" /> Import
                        <input type="file" accept=".json" onChange={onImport} className="hidden" />
                    </label>
                </div>
            </div>
        </Card>
        <Card>
            <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div>
                    <h4 className="font-semibold text-red-700">Clear All Data</h4>
                    <p className="text-sm text-red-500">Permanently delete all your data from this browser. This action cannot be undone.</p>
                </div>
                <Button onClick={onClearData} variant="danger"><Trash2 className="w-4 h-4" /> Clear Data</Button>
            </div>
        </Card>
    </div>
);

const RoadmapView: FC = () => (
    <Card>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Roadmap & Features</h2>
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-3">Current Features (v1.0)</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                    <li>Fully offline functionality, all data stored in your browser.</li>
                    <li>Dashboard with total balance, monthly summaries, and charts.</li>
                    <li>Create, manage, and delete multiple accounts (Checking, Savings, etc.).</li>
                    <li>Track income and expenses with detailed transactions.</li>
                    <li>Keyboard shortcut 'N' to quickly add a new transaction.</li>
                    <li>Set and track financial goals with progress visualization.</li>
                    <li>Export and import all your data as a JSON file.</li>
                    <li>Clean, responsive, and minimalist design.</li>
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-slate-500 mb-3">Planned for Future</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-500">
                    <li>Budgeting tools with category limits.</li>
                    <li>Recurring transactions.</li>
                    <li>Advanced filtering and reporting.</li>
                    <li>CSV data import/export support.</li>
                    <li>Multiple currency support.</li>
                    <li>Theming options (e.g., dark/light mode toggle).</li>
                </ul>
            </div>
        </div>
    </Card>
);

// MAIN APP COMPONENT
// ==============================================
const FinTrackerUI: FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [accounts, setAccounts] = useLocalStorage<Account[]>('fin_accounts', []);
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('fin_transactions', []);
    const [goals, setGoals] = useLocalStorage<Goal[]>('fin_goals', []);

    const [isTxModalOpen, setTxModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const handleAddTransaction = () => {
        setEditingTransaction(null);
        setTxModalOpen(true);
    };

    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setTxModalOpen(true);
    };

    const handleSaveTransaction = (txData: Omit<Transaction, 'id'> & { id?: string }) => {
        if (txData.id) {
            setTransactions(prev => prev.map(t => t.id === txData.id ? { ...t, ...txData } : t));
        } else {
            setTransactions(prev => [...prev, { ...txData, id: new Date().toISOString() }]);
        }
        setTxModalOpen(false);
        setEditingTransaction(null);
    };

    const handleDeleteTransaction = (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const handleExport = () => {
        const data = JSON.stringify({ accounts, transactions, goals }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fin-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (data.accounts && data.transactions && data.goals) {
                    if (window.confirm('This will overwrite all current data. Are you sure?')) {
                        setAccounts(data.accounts);
                        setTransactions(data.transactions);
                        setGoals(data.goals);
                        alert('Data imported successfully!');
                        setView('dashboard');
                    }
                }
            } catch (err) {
                alert('Invalid file format.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleClearData = () => {
        if (window.confirm('DANGER: This will permanently delete all your data. This cannot be undone. Are you sure?')) {
            setAccounts([]);
            setTransactions([]);
            setGoals([]);
            alert('All data has been cleared.');
        }
    };

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (event.key.toLowerCase() === 'n' && !(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) {
            event.preventDefault();
            handleAddTransaction();
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <DashboardView accounts={accounts} transactions={transactions} goals={goals} onAddTransaction={handleAddTransaction} />;
            case 'transactions':
                return <TransactionsView transactions={transactions} accounts={accounts} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />;
            case 'goals':
                return <Card><h2 className="text-2xl font-bold text-slate-800">Goals</h2><p className="text-slate-500 mt-4">Goal management coming soon!</p></Card>;
            case 'settings':
                return <SettingsView onExport={handleExport} onImport={handleImport} onClearData={handleClearData} />;
            case 'roadmap':
                return <RoadmapView />;
            default:
                return <DashboardView accounts={accounts} transactions={transactions} goals={goals} onAddTransaction={handleAddTransaction} />;
        }
    };

    const NavItem: FC<{ currentView: View; targetView: View; setView: (v: View) => void; icon: ReactNode; children: ReactNode }> = ({ currentView, targetView, setView, icon, children }) => (
        <li>
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); setView(targetView); }}
                className={`flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200 ${currentView === targetView ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                {icon}
                <span className="ml-3 flex-1 whitespace-nowrap">{children}</span>
            </a>
        </li>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
                <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r border-slate-200">
                    <a href="#" onClick={(e) => { e.preventDefault(); setView('dashboard'); }} className="flex items-center pl-2.5 mb-5">
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
                <TransactionForm 
                    transaction={editingTransaction}
                    accounts={accounts}
                    onSave={handleSaveTransaction}
                    onClose={() => setTxModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default FinTrackerUI;


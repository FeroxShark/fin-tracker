import { FC } from 'react'
import { LayoutDashboard, ArrowLeftRight, CreditCard, MoreVertical, Repeat, Target, Settings, Info } from 'lucide-react'

interface Props {
  view: string
  setView: (v: any) => void
  labels: Record<string, string>
}

const Item: FC<{ active: boolean; onClick: () => void; icon: JSX.Element }> = ({ active, onClick, icon, children }) => (
  <li>
    <a href="#" onClick={(e) => { e.preventDefault(); onClick() }} className={`flex items-center p-2 text-sm font-medium rounded-md transition-all ${active ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
      {icon}
      <span className="ml-3 whitespace-nowrap">{children}</span>
    </a>
  </li>
)

const Sidebar: FC<Props> = ({ view, setView, labels }) => {
  return (
    <aside className="hidden md:block md:sticky md:top-14 h-[calc(100vh-56px)] w-60 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="h-full overflow-y-auto p-3">
        <ul className="space-y-1">
          <Item active={view==='dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard className="w-5 h-5" />}>{labels.dashboard}</Item>
          <Item active={view==='transactions'} onClick={() => setView('transactions')} icon={<ArrowLeftRight className="w-5 h-5" />}>{labels.transactions}</Item>
          <Item active={view==='accounts'} onClick={() => setView('accounts')} icon={<CreditCard className="w-5 h-5" />}>{labels.accounts}</Item>
          <Item active={view==='categories'} onClick={() => setView('categories')} icon={<MoreVertical className="w-5 h-5" />}>{labels.categories}</Item>
          <Item active={view==='fixed'} onClick={() => setView('fixed')} icon={<Repeat className="w-5 h-5" />}>{labels.fixed}</Item>
          <Item active={view==='goals'} onClick={() => setView('goals')} icon={<Target className="w-5 h-5" />}>{labels.goals}</Item>
          <Item active={view==='settings'} onClick={() => setView('settings')} icon={<Settings className="w-5 h-5" />}>{labels.settings}</Item>
          <Item active={view==='roadmap'} onClick={() => setView('roadmap')} icon={<Info className="w-5 h-5" />}>{labels.roadmap}</Item>
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar



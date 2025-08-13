import { FC, ReactNode } from 'react'

interface Props {
  title: string
  actions?: ReactNode
  className?: string
}

const PageHeader: FC<Props> = ({ title, actions, className = '' }) => (
  <div className={`flex items-center justify-between mb-6 ${className}`}>
    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
)

export default PageHeader



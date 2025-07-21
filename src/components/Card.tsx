import { FC, ReactNode } from 'react'

const Card: FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div
    className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6 ${className}`}
  >
    {children}
  </div>
)

export default Card

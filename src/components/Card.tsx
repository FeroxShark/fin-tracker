import { FC, ReactNode } from 'react'

const Card: FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white border border-slate-200 rounded-xl shadow-sm p-6 ${className}`}>{children}</div>
)

export default Card

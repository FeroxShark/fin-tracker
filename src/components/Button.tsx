import { FC, ReactNode } from 'react'

interface Props {
  onClick?: () => void
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  className?: string
}

const Button: FC<Props> = ({ onClick, children, variant = 'primary', className = '' }) => {
  const base = 'px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants: Record<NonNullable<Props['variant']>, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
  }
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>{children}</button>
  )
}

export default Button

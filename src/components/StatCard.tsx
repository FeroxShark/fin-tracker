import { FC, ReactNode } from 'react'
import Card from './Card'

interface Props {
  title: string
  value: string
  icon: ReactNode
}

const StatCard: FC<Props> = ({ title, value, icon }) => (
  <Card>
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-100 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  </Card>
)

export default StatCard

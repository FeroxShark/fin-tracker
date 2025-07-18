import { Navigate } from 'react-router-dom'
import { useAuth } from '../AuthProvider'

export const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}


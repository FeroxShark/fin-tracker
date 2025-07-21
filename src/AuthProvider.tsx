import { createContext, useContext } from 'react'

interface User {
  uid: string
}

interface AuthContextValue {
  user: User
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const localUser: User = { uid: 'local' }

export const AuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider value={{ user: localUser }}>
    {children}
  </AuthContext.Provider>
)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

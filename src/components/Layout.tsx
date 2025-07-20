import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../AuthProvider'

export const Layout = () => {
  const { logout } = useAuth()
  return (
    <div className="flex h-screen">
      <aside className="w-48 bg-gray-100 dark:bg-gray-800 p-4">
        <nav className="space-y-2">
          <Link to="/dashboard" className="block">Dashboard</Link>
          <Link to="/settings" className="block">Settings</Link>
          <Link to="/research" className="block">I+D</Link>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between">
          <span className="font-bold">Fin Tracker</span>
          <button onClick={logout} className="text-sm text-red-600">Logout</button>
        </header>
        <main className="p-4 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


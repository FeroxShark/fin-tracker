import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './AuthProvider'
import { Layout } from './components/Layout'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Research from './pages/Research'
import FinTrackerPage from './pages/FinTrackerPage'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="research" element={<Research />} />
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/new" element={<FinTrackerPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import FinTrackerPage from './pages/FinTrackerPage'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<FinTrackerPage />} />
        <Route path="/dashboard" element={<FinTrackerPage />} />
        <Route path="/transactions" element={<FinTrackerPage />} />
        <Route path="/accounts" element={<FinTrackerPage />} />
        <Route path="/categories" element={<FinTrackerPage />} />
        <Route path="/fixed" element={<FinTrackerPage />} />
        <Route path="/settings" element={<FinTrackerPage />} />
        <Route path="/roadmap" element={<FinTrackerPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

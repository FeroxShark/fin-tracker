import { BrowserRouter, Route, Routes } from 'react-router-dom'
import FinTrackerPage from './pages/FinTrackerPage'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<FinTrackerPage />} />
      </Routes>
    </BrowserRouter>
  )
}

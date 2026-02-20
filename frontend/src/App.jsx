import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/shared/ProtectedRoute'
import AppShell from './components/shared/AppShell'
import FounderLayout from './pages/founder/FounderLayout'
import TalentLayout from './pages/talent/TalentLayout'
import InvestorLayout from './pages/investor/InvestorLayout'

function App() {
  const { token, role } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="founder/*" element={<FounderLayout />} />
        <Route path="talent/*" element={<TalentLayout />} />
        <Route path="investor/*" element={<InvestorLayout />} />
        <Route index element={
          role === 'FOUNDER' ? <Navigate to="/dashboard/founder" replace /> :
            role === 'INVESTOR' ? <Navigate to="/dashboard/investor" replace /> :
              <Navigate to="/dashboard/talent" replace />
        } />
      </Route>
    </Routes>
  )
}

export default App

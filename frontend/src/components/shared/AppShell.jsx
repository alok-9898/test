import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import RoleSidebar from './RoleSidebar'

export default function AppShell() {
  const { logout, role } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      <RoleSidebar role={role} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LogOut, Home, User, Users, Briefcase, TrendingUp, Target, FileText } from 'lucide-react'

export default function RoleSidebar({ role, onLogout }) {
  const { currentUser } = useAuth()

  const founderLinks = [
    { to: '/dashboard/founder', label: 'Dashboard', icon: Home, end: true },
    { to: '/dashboard/founder/profile', label: 'Startup Profile', icon: User },
    { to: '/dashboard/founder/jobs', label: 'Job Postings', icon: Briefcase },
    { to: '/dashboard/founder/investor-matches', label: 'Investor Matches', icon: TrendingUp },
    { to: '/dashboard/founder/team-gaps', label: 'Team Gaps', icon: Target },
  ]

  const talentLinks = [
    { to: '/dashboard/talent', label: 'Dashboard', icon: Home, end: true },
    { to: '/dashboard/talent/profile', label: 'Profile', icon: User },
    { to: '/dashboard/talent/opportunities', label: 'Opportunities', icon: Briefcase },
    { to: '/dashboard/talent/matches', label: 'My Matches', icon: Target },
  ]

  const investorLinks = [
    { to: '/dashboard/investor', label: 'Dashboard', icon: Home, end: true },
    { to: '/dashboard/investor/thesis', label: 'Thesis', icon: FileText },
    { to: '/dashboard/investor/deal-flow', label: 'Deal Flow', icon: TrendingUp },
    { to: '/dashboard/investor/network', label: 'Network', icon: Users },
    { to: '/dashboard/investor/portfolio', label: 'Portfolio', icon: Briefcase },
  ]

  const links = role === 'FOUNDER' ? founderLinks : role === 'TALENT' ? talentLinks : investorLinks

  return (
    <aside className="w-72 bg-white border-r-[1.5px] border-[var(--border)] flex flex-col h-screen overflow-hidden">
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-[#0C2D6B] rounded-lg flex items-center justify-center text-white">
            <TrendingUp size={18} strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0C2D6B]">NepLaunch</h1>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] uppercase tracking-[0.1em] font-extrabold">{role} PORTAL</p>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                  ? 'bg-[#EEF5FF] text-[#1B4FD8] border-l-[3px] border-[#1B4FD8] rounded-none'
                  : 'text-[var(--text-secondary)] hover:bg-[#F8F7F4] hover:text-[var(--text-primary)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-[#1B4FD8]' : ''}`} />
                  <span className="font-bold">{link.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-[var(--border)]">
        <div className="glass-card mb-4 p-4 flex items-center gap-3 bg-[#F8F7F4] border-[var(--border)] shadow-none hover:translate-y-0">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[var(--text-secondary)] border border-[var(--border)] uppercase font-bold text-xs">
            {currentUser?.email?.[0] || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-extrabold text-[var(--text-primary)] truncate">{currentUser?.email}</p>
            <p className="text-[11px] text-[var(--text-secondary)] capitalize font-bold">{role?.toLowerCase() || 'User'}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-red-50 hover:text-red-600 w-full transition-colors group font-bold"
        >
          <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

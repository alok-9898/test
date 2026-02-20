import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LogOut, Home, User, Users, Briefcase, TrendingUp, Target, FileText } from 'lucide-react'

export default function RoleSidebar({ role, onLogout }) {
  const { currentUser } = useAuth()

  const founderLinks = [
    { to: '/dashboard/founder', label: 'Dashboard', icon: Home },
    { to: '/dashboard/founder/profile', label: 'Startup Profile', icon: User },
    { to: '/dashboard/founder/talent-matches', label: 'Talent Matches', icon: Users },
    { to: '/dashboard/founder/investor-matches', label: 'Investor Matches', icon: TrendingUp },
    { to: '/dashboard/founder/pitch-copilot', label: 'Pitch Co-Pilot', icon: FileText },
    { to: '/dashboard/founder/team-gaps', label: 'Team Gaps', icon: Target },
  ]

  const talentLinks = [
    { to: '/dashboard/talent', label: 'Dashboard', icon: Home },
    { to: '/dashboard/talent/profile', label: 'Profile', icon: User },
    { to: '/dashboard/talent/opportunities', label: 'Opportunities', icon: Briefcase },
    { to: '/dashboard/talent/matches', label: 'My Matches', icon: Target },
    { to: '/dashboard/talent/co-founders', label: 'Co-Founders', icon: Users },
    { to: '/dashboard/talent/grants', label: 'Grants', icon: FileText },
  ]

  const investorLinks = [
    { to: '/dashboard/investor', label: 'Dashboard', icon: Home },
    { to: '/dashboard/investor/thesis', label: 'Thesis', icon: FileText },
    { to: '/dashboard/investor/deal-flow', label: 'Deal Flow', icon: TrendingUp },
    { to: '/dashboard/investor/network', label: 'Network', icon: Users },
    { to: '/dashboard/investor/portfolio', label: 'Portfolio', icon: Briefcase },
  ]

  const links = role === 'FOUNDER' ? founderLinks : role === 'TALENT' ? talentLinks : investorLinks

  return (
    <aside className="w-72 bg-slate-950 border-r border-white/5 flex flex-col h-screen overflow-hidden">
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center text-slate-950">
            <TrendingUp size={18} strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight gradient-text">NepLaunch</h1>
        </div>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{role} PORTAL</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? 'bg-amber-500/10 text-amber-500 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`
              }
            >
              <Icon size={20} className="transition-transform duration-200 group-hover:scale-110" />
              <span className="font-medium">{link.label}</span>
              {({ isActive }) => isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"></div>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="glass-card mb-4 p-4 flex items-center gap-3 bg-white/5 border-white/5">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10 uppercase">
            {currentUser?.email?.[0] || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-slate-200 truncate">{currentUser?.email}</p>
            <p className="text-xs text-slate-500 capitalize">{role?.toLowerCase() || 'User'}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-colors group"
        >
          <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}

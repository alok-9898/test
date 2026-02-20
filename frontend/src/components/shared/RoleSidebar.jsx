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
    <aside className="w-64 bg-primary text-white flex flex-col">
      <div className="p-6 border-b border-primary-light">
        <h1 className="text-2xl font-bold">NepLaunch</h1>
        <p className="text-sm text-gray-400 mt-1">{currentUser?.email}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-accent text-primary font-semibold'
                    : 'hover:bg-primary-light'
                }`
              }
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </NavLink>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-primary-light">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-light w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

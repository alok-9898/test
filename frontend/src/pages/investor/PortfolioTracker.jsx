import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import { Briefcase } from 'lucide-react'

export default function PortfolioTracker() {
  return (
    <div>
      <PageHeader title="Portfolio Tracker" subtitle="Manage your investments" />
      <div className="p-6">
        <EmptyState
          icon={Briefcase}
          title="No portfolio yet"
          message="Your portfolio companies will appear here"
        />
      </div>
    </div>
  )
}

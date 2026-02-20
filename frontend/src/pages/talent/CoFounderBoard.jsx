import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import { Users } from 'lucide-react'

export default function CoFounderBoard() {
  return (
    <div>
      <PageHeader title="Co-Founder Board" subtitle="Find potential co-founders" />
      <div className="p-6">
        <EmptyState
          icon={Users}
          title="Coming Soon"
          message="Co-founder matching feature will be available soon"
        />
      </div>
    </div>
  )
}

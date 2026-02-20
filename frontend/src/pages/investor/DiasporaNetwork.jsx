import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import { Users } from 'lucide-react'

export default function DiasporaNetwork() {
  return (
    <div>
      <PageHeader title="Diaspora Network" subtitle="Connect with other investors" />
      <div className="p-6">
        <EmptyState
          icon={Users}
          title="Coming Soon"
          message="Diaspora network feature will be available soon"
        />
      </div>
    </div>
  )
}

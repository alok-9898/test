import { useQuery } from '@tanstack/react-query'
import { getInvestorMatches } from '../../api/matches'
import MatchScoreRing from '../../components/shared/MatchScoreRing'
import ConnectionButton from '../../components/shared/ConnectionButton'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import { TrendingUp } from 'lucide-react'

export default function DealFlowFeed() {
  const { data: startups = [], isLoading } = useQuery({
    queryKey: ['investorMatches'],
    queryFn: getInvestorMatches,
  })

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div>
      <PageHeader title="Deal Flow" subtitle="Thesis-aligned startups" />
      
      <div className="p-6">
        {startups.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="No deal flow yet"
            message="Complete your investment thesis to see matched startups"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {startups.map((startup) => (
              <div key={startup.investor_id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{startup.name}</h3>
                    <p className="text-sm text-gray-600">{startup.fund || startup.type}</p>
                  </div>
                  <MatchScoreRing score={startup.match_percentage} />
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500">
                    Industry/Stage: {startup.score_breakdown?.industry_stage?.toFixed(2) || 0} | Semantic: {startup.score_breakdown?.semantic?.toFixed(2) || 0}
                  </p>
                </div>

                <ConnectionButton targetId={startup.investor_id} targetRole="FOUNDER" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

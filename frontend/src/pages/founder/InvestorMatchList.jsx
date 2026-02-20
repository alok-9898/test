import { useQuery } from '@tanstack/react-query'
import { getInvestorMatches } from '../../api/matches'
import MatchScoreRing from '../../components/shared/MatchScoreRing'
import ConnectionButton from '../../components/shared/ConnectionButton'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import { TrendingUp } from 'lucide-react'

export default function InvestorMatchList() {
  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['investorMatches'],
    queryFn: getInvestorMatches,
  })

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div>
      <PageHeader title="Investor Matches" subtitle="Find investors aligned with your startup" />
      
      <div className="p-6">
        {matches.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="No matches yet"
            message="Complete your startup profile to find matched investors"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div key={match.investor_id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{match.name}</h3>
                    <p className="text-sm text-gray-600">{match.fund || match.type}</p>
                  </div>
                  <MatchScoreRing score={match.match_percentage} />
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500">
                    Industry/Stage: {match.score_breakdown?.industry_stage?.toFixed(2) || 0} | Semantic: {match.score_breakdown?.semantic?.toFixed(2) || 0}
                  </p>
                </div>

                <ConnectionButton targetId={match.investor_id} targetRole="INVESTOR" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

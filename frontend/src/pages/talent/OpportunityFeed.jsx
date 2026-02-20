import { useQuery } from '@tanstack/react-query'
import { getStartupMatches } from '../../api/matches'
import MatchScoreRing from '../../components/shared/MatchScoreRing'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import { Briefcase } from 'lucide-react'

export default function OpportunityFeed() {
  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ['startupMatches'],
    queryFn: getStartupMatches,
  })

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div>
      <PageHeader title="Opportunities" subtitle="Browse startup roles" />
      
      <div className="p-6">
        {opportunities.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No opportunities yet"
            message="Complete your profile to see matched opportunities"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div key={opp.startup_id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{opp.name}</h3>
                    <p className="text-sm text-gray-600">{opp.tagline}</p>
                    <p className="text-xs text-gray-500 mt-1">{opp.industry}</p>
                  </div>
                  <MatchScoreRing score={opp.match_percentage} />
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-accent text-primary font-semibold rounded-lg hover:bg-accent-light transition-colors">
                  Express Interest
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

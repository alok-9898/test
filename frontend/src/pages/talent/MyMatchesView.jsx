import { useQuery } from '@tanstack/react-query'
import { getStartupMatches } from '../../api/matches'
import MatchScoreRing from '../../components/shared/MatchScoreRing'
import MatchBadge from '../../components/shared/MatchBadge'
import ConnectionButton from '../../components/shared/ConnectionButton'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import { Target } from 'lucide-react'

export default function MyMatchesView() {
  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['startupMatches'],
    queryFn: getStartupMatches,
  })

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div>
      <PageHeader title="My Matches" subtitle="Startups matched to your profile" />
      
      <div className="p-6">
        {matches.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No matches yet"
            message="Complete your profile to find matched startups"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div key={match.startup_id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{match.name}</h3>
                    <p className="text-sm text-gray-600">{match.tagline}</p>
                  </div>
                  <MatchScoreRing score={match.match_percentage} />
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Skills Match</p>
                  <div className="flex flex-wrap gap-2">
                    {match.matched_skills?.map((skill) => (
                      <MatchBadge key={skill} skill={skill} matched={true} />
                    ))}
                    {match.missing_skills?.map((skill) => (
                      <MatchBadge key={skill} skill={skill} matched={false} />
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500">
                    Skills: {match.score_breakdown?.skills?.toFixed(2) || 0} | Semantic: {match.score_breakdown?.semantic?.toFixed(2) || 0}
                  </p>
                </div>

                <ConnectionButton targetId={match.startup_id} targetRole="FOUNDER" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

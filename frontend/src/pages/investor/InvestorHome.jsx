import { useQuery } from '@tanstack/react-query'
import { getInvestorThesis } from '../../api/investors'
import { getInvestorMatches } from '../../api/matches'
import ProfileCompleteness from '../../components/shared/ProfileCompleteness'
import MatchScoreRing from '../../components/shared/MatchScoreRing'
import PageHeader from '../../components/shared/PageHeader'
import { TrendingUp, Briefcase, Users } from 'lucide-react'

export default function InvestorHome() {
  const { data: profile } = useQuery({
    queryKey: ['investor', 'thesis'],
    queryFn: getInvestorThesis,
  })

  const { data: matches = [] } = useQuery({
    queryKey: ['investorMatches'],
    queryFn: getInvestorMatches,
  })

  const topMatches = matches.slice(0, 3)

  return (
    <div>
      <PageHeader title="Investor Dashboard" subtitle="Manage your deal flow and portfolio" />
      
      <div className="p-6 space-y-6">
        {profile?.completeness_score < 80 && (
          <ProfileCompleteness
            score={profile.completeness_score || 0}
            missingFields={[]}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <TrendingUp className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">New Matches</p>
                <p className="text-xl font-semibold">{matches.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Briefcase className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Portfolio</p>
                <p className="text-xl font-semibold">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Users className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-semibold">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Users className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Syndicates</p>
                <p className="text-xl font-semibold">0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">This Week's Top Matches</h2>
          {topMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topMatches.map((match) => (
                <div key={match.investor_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{match.name}</h3>
                      <p className="text-sm text-gray-600">{match.fund || match.type}</p>
                    </div>
                    <MatchScoreRing score={match.match_percentage} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No matches yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { getStartupProfile } from '../../api/founders'
import { getTalentMatches } from '../../api/matches'
import ProfileCompleteness from '../../components/shared/ProfileCompleteness'
import MatchScoreRing from '../../components/shared/MatchScoreRing'
import PageHeader from '../../components/shared/PageHeader'
import { Link } from 'react-router-dom'
import { User, Users, TrendingUp } from 'lucide-react'

export default function FounderHome() {
  const { data: profile } = useQuery({
    queryKey: ['founder', 'profile'],
    queryFn: getStartupProfile,
  })

  const { data: talentMatches = [] } = useQuery({
    queryKey: ['talentMatches'],
    queryFn: getTalentMatches,
  })

  const topMatches = talentMatches.slice(0, 3)

  return (
    <div>
      <PageHeader title="Founder Dashboard" subtitle="Manage your startup and find talent" />
      
      <div className="p-6 space-y-6">
        {profile?.completeness_score < 80 && (
          <ProfileCompleteness
            score={profile.completeness_score || 0}
            missingFields={[]}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <TrendingUp className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Funding Stage</p>
                <p className="text-xl font-semibold">{profile?.stage || 'Not set'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Users className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Open Roles</p>
                <p className="text-xl font-semibold">{profile?.open_roles_count || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <User className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Connections</p>
                <p className="text-xl font-semibold">0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Top Matched Talent</h2>
            <Link
              to="/dashboard/founder/talent-matches"
              className="text-accent hover:underline"
            >
              View All
            </Link>
          </div>
          {topMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topMatches.map((match) => (
                <div key={match.talent_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{match.name}</h3>
                      <p className="text-sm text-gray-600">{match.headline}</p>
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

import { useQuery } from '@tanstack/react-query'
import { getTalentProfile } from '../../api/talent'
import { getStartupMatches } from '../../api/matches'
import ProfileCompleteness from '../../components/shared/ProfileCompleteness'
import MatchScoreRing from '../../components/shared/MatchScoreRing'
import PageHeader from '../../components/shared/PageHeader'
import { Link } from 'react-router-dom'
import { User, Briefcase, Users } from 'lucide-react'

export default function TalentHome() {
  const { data: profile } = useQuery({
    queryKey: ['talent', 'profile'],
    queryFn: getTalentProfile,
  })

  const { data: startupMatches = [] } = useQuery({
    queryKey: ['startupMatches'],
    queryFn: getStartupMatches,
  })

  const topMatches = startupMatches.slice(0, 3)

  return (
    <div>
      <PageHeader title="Talent Dashboard" subtitle="Find opportunities and build your career" />
      
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
                <User className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Profile Completeness</p>
                <p className="text-xl font-semibold">{Math.round(profile?.completeness_score || 0)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Briefcase className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Applications</p>
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
                <p className="text-sm text-gray-600">New Matches</p>
                <p className="text-xl font-semibold">{startupMatches.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Top Matches For You</h2>
            <Link
              to="/dashboard/talent/matches"
              className="text-accent hover:underline"
            >
              View All
            </Link>
          </div>
          {topMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topMatches.map((match) => (
                <div key={match.startup_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{match.name}</h3>
                      <p className="text-sm text-gray-600">{match.tagline}</p>
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

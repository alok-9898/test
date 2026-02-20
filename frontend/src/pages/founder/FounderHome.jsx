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
      <PageHeader title="Founder Dashboard" subtitle={`Welcome back, ${profile?.name || 'Venture Founder'}`} />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {profile?.completeness_score < 80 && (
          <div className="glass-card bg-amber-500/5 border-amber-500/20 p-6">
            <ProfileCompleteness
              score={profile.completeness_score || 0}
              missingFields={[]}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 group hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-500/10 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
                <TrendingUp className="text-amber-500" size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Funding Stage</p>
                <p className="text-2xl font-bold text-slate-100 capitalize">{profile?.stage || 'Seed'}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 group hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
                <Users className="text-emerald-500" size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Open Roles</p>
                <p className="text-2xl font-bold text-slate-100">{profile?.open_roles_count || 0}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 group hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                <User className="text-purple-500" size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Venture Matches</p>
                <p className="text-2xl font-bold text-slate-100">{talentMatches.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Top Matched Talent</h2>
              <p className="text-sm text-slate-400 mt-1">Founders and experts ready to join your mission</p>
            </div>
            <Link
              to="/dashboard/founder/talent-matches"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              View Talent
            </Link>
          </div>

          {topMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topMatches.map((match) => (
                <div key={match.talent_id} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-amber-500 text-xl overflow-hidden shadow-inner uppercase">
                      {match.name?.[0]}
                    </div>
                    <MatchScoreRing score={match.match_percentage} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-100 mb-1 group-hover:text-amber-500 transition-colors">{match.name}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{match.headline}</p>
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-1 bg-amber-500/10 text-amber-500 rounded-md">Verified Talent</span>
                    <button className="text-xs text-amber-500 hover:text-amber-400 font-medium">Connect</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                <Users className="text-slate-600" size={32} />
              </div>
              <p className="text-slate-400 font-medium italic">Searching for talent matches...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

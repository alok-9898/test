import { useQuery } from '@tanstack/react-query'
import { getStartupProfile } from '../../api/founders'
import { getTalentMatches } from '../../api/matches'
import ProfileCompleteness from '../../components/shared/ProfileCompleteness'
import MatchScoreRing from '../../components/shared/MatchScoreRing'
import PageHeader from '../../components/shared/PageHeader'
import { Link } from 'react-router-dom'
import { User, Users, TrendingUp, Plus } from 'lucide-react'

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 group hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-500/10 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
                <TrendingUp className="text-amber-500" size={28} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stage</p>
                <div className="flex items-end gap-2 mt-1">
                  <p className="text-xl font-bold text-slate-100 capitalize">{profile?.stage || 'Seed'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 group hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
                <Users className="text-emerald-500" size={28} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Team Gaps</p>
                <div className="flex items-end gap-2 mt-1">
                  <p className="text-xl font-bold text-slate-100">{profile?.open_roles_count || 0}</p>
                  <p className="text-[10px] text-emerald-500 font-bold mb-1">Roles</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 group hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                <Users className="text-purple-500" size={28} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Investor Pipeline</p>
                <div className="flex items-end gap-2 mt-1">
                  <p className="text-xl font-bold text-slate-100">12</p>
                  <p className="text-[10px] text-purple-500 font-bold mb-1">Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 group hover:border-amber-500/30 transition-all duration-300 border-dashed">
            <Link to="/dashboard/founder/jobs" className="flex items-center gap-4 w-full text-left">
              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
                <Plus className="text-slate-400 group-hover:text-amber-500" size={28} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Post Job</p>
                <p className="text-xs text-slate-400 mt-1">Scale your team</p>
              </div>
            </Link>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Top Matched Talent</h2>
              <p className="text-sm text-slate-400 mt-1">Builders and experts ranked by mission alignment</p>
            </div>
            <Link
              to="/dashboard/founder/talent-matches"
              className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors text-slate-300"
            >
              View Full Index
            </Link>
          </div>

          {topMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topMatches.map((match) => (
                <div key={match.talent_id} className="glass-card group hover:border-amber-500/30 transition-all p-8 flex flex-col h-full bg-slate-900/40">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-amber-500 text-2xl border border-white/5 shadow-inner uppercase">
                      {match.name?.[0]}
                    </div>
                    <MatchScoreRing score={match.match_percentage} size={50} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-500 transition-colors uppercase tracking-tight mb-2">
                    {match.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1 line-clamp-2">
                    {match.headline}
                  </p>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Skill Match</span>
                      <span className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Verified</span>
                    </div>
                    <button className="premium-button btn-secondary px-6 py-2 text-xs">
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card py-20 text-center">
              <div className="w-20 h-20 bg-slate-800/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Users className="text-slate-700" size={40} />
              </div>
              <h4 className="text-lg font-bold text-slate-300">Scanning for Talent</h4>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm">We are indexing founders and builders matching your venture's DNA.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

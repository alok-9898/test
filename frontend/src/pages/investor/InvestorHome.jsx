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

  // Only show high-fidelity matches (> 50%)
  const filteredMatches = matches.filter(m => m.match_percentage > 50)
  const topMatches = filteredMatches.slice(0, 3)

  return (
    <div>
      <PageHeader title="Investor Dashboard" subtitle="Manage your deal flow and portfolio" />

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
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pipeline</p>
                <div className="flex items-end gap-2 mt-1">
                  <p className="text-2xl font-bold text-slate-100">{matches.length}</p>
                  <p className="text-[10px] text-emerald-500 font-bold mb-1">+24%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 group hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
                <Briefcase className="text-emerald-500" size={28} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Portfolio</p>
                <div className="flex items-end gap-2 mt-1">
                  <p className="text-2xl font-bold text-slate-100">$650k</p>
                  <p className="text-[10px] text-emerald-500 font-bold mb-1">2 Active</p>
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
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network</p>
                <div className="flex items-end gap-2 mt-1">
                  <p className="text-2xl font-bold text-slate-100">0</p>
                  <p className="text-[10px] text-slate-500 font-bold mb-1">Founders</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">High Resolution Deal Flow</h2>
              <p className="text-sm text-slate-400 mt-1">AI-indexed founders matching your specific thesis signals</p>
            </div>
          </div>

          {topMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topMatches.map((match) => (
                <div key={match.startup_id} className="glass-card group hover:border-amber-500/30 transition-all p-8 flex flex-col h-full bg-slate-900/40">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-amber-500 text-2xl border border-white/5 shadow-inner uppercase">
                      {match.name?.[0]}
                    </div>
                    <MatchScoreRing score={match.match_percentage} size={50} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-500 transition-colors uppercase tracking-tight mb-2">
                    {match.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
                    {match.tagline}
                  </p>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Sector Match</span>
                      <span className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Optimized</span>
                    </div>
                    <button className="premium-button btn-secondary px-6 py-2 text-xs">
                      Deep Audit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card py-20 text-center">
              <div className="w-20 h-20 bg-slate-800/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Briefcase className="text-slate-700" size={40} />
              </div>
              <h4 className="text-lg font-bold text-slate-300">Pipeline Empty</h4>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm">Our engines are scanning for new founders. Refine your thesis to increase match fidelity.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

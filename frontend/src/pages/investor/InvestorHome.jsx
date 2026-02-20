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
              <div>
                <p className="text-sm font-medium text-slate-400">New Matches</p>
                <p className="text-2xl font-bold text-slate-100">{matches.length}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 group hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
                <Briefcase className="text-emerald-500" size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Portfolio</p>
                <p className="text-2xl font-bold text-slate-100">0</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 group hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                <Users className="text-purple-500" size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Pending Deals</p>
                <p className="text-2xl font-bold text-slate-100">0</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 group hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-500/10 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
                <TrendingUp className="text-amber-500" size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Syndicates</p>
                <p className="text-2xl font-bold text-slate-100">0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Investment Deal Flow</h2>
              <p className="text-sm text-slate-400 mt-1">Founders aligned with your thesis</p>
            </div>
          </div>

          {topMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topMatches.map((match) => (
                <div key={match.investor_id} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-amber-500 text-xl overflow-hidden shadow-inner uppercase">
                      {match.name?.[0]}
                    </div>
                    <MatchScoreRing score={match.match_percentage} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-100 mb-1 group-hover:text-amber-500 transition-colors">{match.name}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{match.fund || match.type}</p>
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-1 bg-amber-500/10 text-amber-500 rounded-md">High Alpha</span>
                    <button className="text-xs text-amber-500 hover:text-amber-400 font-medium">Review Deck</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                <Briefcase className="text-slate-600" size={32} />
              </div>
              <p className="text-slate-400 font-medium italic">Scanning pipeline for new opportunities...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

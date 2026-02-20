import { useQuery } from '@tanstack/react-query'
import { getJobMatches } from '../../api/matches'
import MatchScoreRing from '../../components/shared/MatchScoreRing'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import { Briefcase, MapPin, Clock, DollarSign, Tag } from 'lucide-react'

export default function OpportunityFeed() {
  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ['jobMatches'],
    queryFn: getJobMatches,
  })

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="h-10 w-64 bg-white/5 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="glass-card h-64 animate-pulse bg-white/5" />)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Opportunities" subtitle="High-alpha roles matched to your unique skillset" />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {opportunities.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="Finding your perfect match..."
            message="We're currently scouring the ecosystem for roles that match your unique skillset. Check back soon!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map((opp) => (
              <div key={opp.job_id} className="glass-card group hover:border-amber-500/30 transition-all p-8 flex flex-col h-full bg-slate-900/40">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-4">
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-500 transition-colors uppercase tracking-tight leading-tight">
                      {opp.title}
                    </h3>
                    <p className="text-amber-500/80 mt-1 uppercase tracking-widest text-[10px] font-bold">
                      {opp.startup_name} • {opp.industry}
                    </p>
                  </div>
                  <MatchScoreRing score={opp.match_percentage} size={50} />
                </div>

                <div className="space-y-2.5 mb-5 flex-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin size={13} className="text-amber-500 shrink-0" />
                    <span className="text-xs">{opp.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={13} className="text-amber-500 shrink-0" />
                    <span className="text-xs capitalize">{opp.job_type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <DollarSign size={13} className="text-amber-500 shrink-0" />
                    <span className="text-xs text-slate-200 font-bold">{opp.compensation || 'Competitive'}</span>
                  </div>

                  {/* Required Skills */}
                  {opp.required_skills?.length > 0 && (
                    <div className="pt-1">
                      <div className="flex items-center gap-1 text-slate-500 text-[10px] uppercase font-bold mb-2">
                        <Tag size={10} /> Skills Needed
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {opp.required_skills.map(skill => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {opp.description && (
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 pt-1">
                      {opp.description}
                    </p>
                  )}
                </div>

                <div className="pt-5 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Skill Match</span>
                    <span className={`text-[10px] font-bold uppercase mt-0.5 ${opp.match_percentage >= 70 ? 'text-emerald-500' : opp.match_percentage >= 40 ? 'text-amber-500' : 'text-slate-500'}`}>
                      {opp.match_percentage >= 70 ? 'Strong' : opp.match_percentage >= 40 ? 'Partial' : opp.match_percentage === 50 ? 'Open' : 'Low'}
                    </span>
                  </div>
                  <button className="premium-button btn-primary px-5 py-2 text-sm">
                    Express Interest
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

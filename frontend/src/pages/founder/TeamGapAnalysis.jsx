import { useQuery } from '@tanstack/react-query'
import { getStartupProfile } from '../../api/founders'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import { Users, AlertTriangle, ShieldCheck, Zap, ArrowRight, Brain } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TeamGapAnalysis() {
  const { data: profile } = useQuery({
    queryKey: ['founder', 'profile'],
    queryFn: getStartupProfile,
  })

  // Mock analysis logic based on profile data
  const domains = [
    { name: 'Engineering', score: 85, status: 'Strong', description: 'Core technical foundation is robust. Scalability expertise is present.' },
    { name: 'Product', score: 40, status: 'Gap Detected', description: 'Need for dedicated PM to translate vision into roadmap.' },
    { name: 'Growth/Sales', score: 20, status: 'Critical Gap', description: 'Lack of repeatable sales motion or growth loops.' },
    { name: 'Operations', score: 65, status: 'Average', description: 'Back-office and legal are handled but not optimized.' }
  ]

  return (
    <div>
      <PageHeader title="Venture DNA Analysis" subtitle="AI-powered gap detection for your core leadership team." />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-100 uppercase tracking-tight">Domain Proficiency</h3>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase">AI Analyzed</span>
              </div>

              <div className="space-y-8">
                {domains.map(domain => (
                  <div key={domain.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {domain.score > 70 ? (
                          <ShieldCheck className="text-emerald-500" size={18} />
                        ) : domain.score > 30 ? (
                          <Zap className="text-amber-500" size={18} />
                        ) : (
                          <AlertTriangle className="text-red-500" size={18} />
                        )}
                        <span className="font-bold text-slate-200">{domain.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase ${domain.score > 70 ? 'text-emerald-500' : domain.score > 30 ? 'text-amber-500' : 'text-red-500'
                        }`}>
                        {domain.status}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full transition-all duration-1000 ${domain.score > 70 ? 'bg-emerald-500' : domain.score > 30 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                        style={{ width: `${domain.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      {domain.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-card p-8 bg-purple-500/5 border-purple-500/10">
              <div className="flex gap-6 items-start">
                <div className="p-4 bg-purple-500/10 rounded-2xl">
                  <Brain className="text-purple-500" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 mb-2">Internal Benchmark</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Your current team structure is most similar to **Fintech Unicorns** at the Seed stage.
                    Top recommendation: **Add a Head of Product** before Series A.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="glass-card p-8">
              <h3 className="text-lg font-bold text-slate-100 mb-6 uppercase tracking-tight">Priority Hires</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                  <p className="text-xs font-bold text-red-500 uppercase mb-1">Critical</p>
                  <p className="text-sm font-bold text-slate-200">Head of Growth</p>
                  <p className="text-[10px] text-slate-500 mt-2">Required for traction proof</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <p className="text-xs font-bold text-amber-500 uppercase mb-1">Medium</p>
                  <p className="text-sm font-bold text-slate-200">Senior Product Manager</p>
                  <p className="text-[10px] text-slate-500 mt-2">Required for feature scaling</p>
                </div>
              </div>

              <Link
                to="/dashboard/founder/jobs"
                className="mt-8 flex items-center justify-center gap-2 w-full premium-button btn-primary py-3"
              >
                Create Job Posting <ArrowRight size={16} />
              </Link>
            </section>

            <div className="glass-card p-6 bg-slate-900/50">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Team Completeness</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-100">62%</span>
                <span className="text-xs text-slate-500">of ideal Seed DNA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

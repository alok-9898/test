export default function ProfileCompleteness({ score, missingFields = [] }) {
  const pct = Math.round(score || 0)

  const color =
    pct >= 80
      ? { bar: 'bg-emerald-500', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' }
      : pct >= 50
        ? { bar: 'bg-amber-500', text: 'text-amber-400', glow: 'shadow-amber-500/20' }
        : { bar: 'bg-red-500', text: 'text-red-400', glow: 'shadow-red-500/20' }

  const label = pct >= 80 ? 'Strong' : pct >= 50 ? 'Building' : 'Incomplete'

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Profile Completeness</h3>
          <p className="text-xs text-slate-500 mt-0.5">{label}</p>
        </div>
        <span className={`text-3xl font-black ${color.text}`}>{pct}<span className="text-lg">%</span></span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
        <div
          className={`${color.bar} h-2.5 rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {missingFields.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Missing fields</p>
          <ul className="space-y-1">
            {missingFields.map((field, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/60 shrink-0" />
                {field}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

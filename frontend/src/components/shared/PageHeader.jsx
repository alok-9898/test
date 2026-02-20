export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-md border-b border-white/5 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-bold gradient-text">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

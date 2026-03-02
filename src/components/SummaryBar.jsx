export default function SummaryBar({ leads }) {
  const highPriority = leads.filter((l) => l.ai_score >= 70)
  const mediumPriority = leads.filter((l) => l.ai_score >= 40 && l.ai_score < 70)
  const avgScore =
    leads.length > 0
      ? Math.round(leads.reduce((s, l) => s + l.ai_score, 0) / leads.length)
      : 0
  const totalPipeline = leads.reduce((s, l) => s + (l.budget_eur || 0), 0)
  const highPipelineValue = highPriority.reduce((s, l) => s + (l.budget_eur || 0), 0)

  function formatCurrency(n) {
    if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`
    return `€${(n / 1000).toFixed(0)}K`
  }

  const stats = [
    {
      label: 'Total Leads',
      value: leads.length,
      sub: `${mediumPriority.length} medium priority`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-500',
      valueColor: 'text-slate-800',
    },
    {
      label: 'High Priority',
      value: highPriority.length,
      sub: 'Score 70 or above',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      valueColor: 'text-green-700',
    },
    {
      label: 'Average Score',
      value: avgScore,
      sub: 'Out of 100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-700',
    },
    {
      label: 'Pipeline Value',
      value: formatCurrency(totalPipeline),
      sub: `${formatCurrency(highPipelineValue)} from hot leads`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: 'bg-amber-100',
      iconColor: 'text-[#C9A84C]',
      valueColor: 'text-[#b8963e]',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-start gap-4"
        >
          <div className={`${stat.iconBg} ${stat.iconColor} p-2.5 rounded-lg flex-shrink-0`}>
            {stat.icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold mt-0.5 ${stat.valueColor}`}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{stat.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

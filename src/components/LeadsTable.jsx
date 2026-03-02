import ScoreBadge from './ScoreBadge'

const SOURCE_STYLES = {
  referral:   { label: 'Referral',    cls: 'bg-purple-100 text-purple-700' },
  webinar:    { label: 'Webinar',     cls: 'bg-blue-100 text-blue-700' },
  direct:     { label: 'Direct',      cls: 'bg-slate-100 text-slate-600' },
  instagram:  { label: 'Instagram',   cls: 'bg-pink-100 text-pink-700' },
  google_ads: { label: 'Google Ads',  cls: 'bg-yellow-100 text-yellow-700' },
}

const LOCATION_STYLES = {
  'Maldives':       'bg-cyan-100 text-cyan-700',
  'French Riviera': 'bg-indigo-100 text-indigo-700',
  'Mallorca':       'bg-orange-100 text-orange-700',
  'Tuscany':        'bg-green-100 text-green-700',
  'Algarve':        'bg-teal-100 text-teal-700',
}

const FLAG = {
  Germany:     '🇩🇪',
  Netherlands: '🇳🇱',
  UK:          '🇬🇧',
  Austria:     '🇦🇹',
  Switzerland: '🇨🇭',
}

export default function LeadsTable({ leads, totalLeads }) {
  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-16 text-center">
        <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-slate-400 font-medium">No leads match your current filters</p>
        <p className="text-slate-300 text-sm mt-1">Try adjusting or clearing your filters</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table header row */}
      <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          AI-Ranked Lead List
        </h2>
        <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
          {leads.length} of {totalLeads} leads
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-14">
                Rank
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Lead
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Country
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Budget
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Location
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Source
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-32">
                Engagement
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-20">
                Pipeline
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-24">
                AI Score
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                AI Reasoning
              </th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead, idx) => {
              const src = SOURCE_STYLES[lead.lead_source] || {
                label: lead.lead_source,
                cls: 'bg-slate-100 text-slate-600',
              }
              const locCls = LOCATION_STYLES[lead.location_interest] || 'bg-slate-100 text-slate-600'
              const flag = FLAG[lead.country] || '🌍'
              const daysColor =
                lead.days_in_pipeline <= 14
                  ? 'text-green-600 font-semibold'
                  : lead.days_in_pipeline <= 40
                  ? 'text-amber-600'
                  : 'text-red-500'
              const engColor =
                lead.engagement_score >= 8
                  ? 'bg-green-500'
                  : lead.engagement_score >= 5
                  ? 'bg-amber-400'
                  : 'bg-red-400'
              const isTopRank = lead.rank <= 5

              return (
                <tr
                  key={lead.name}
                  className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors ${
                    isTopRank ? 'bg-amber-50/30' : ''
                  }`}
                >
                  {/* Rank */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {isTopRank && (
                        <span className="text-[#C9A84C] text-xs">★</span>
                      )}
                      <span className="text-slate-400 font-mono text-xs font-semibold">
                        #{lead.rank}
                      </span>
                    </div>
                  </td>

                  {/* Lead name */}
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-slate-800 whitespace-nowrap">{lead.name}</p>
                  </td>

                  {/* Country */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-slate-600 text-sm">
                      {flag} {lead.country}
                    </span>
                  </td>

                  {/* Budget */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-semibold text-slate-700">
                      €{lead.budget_eur.toLocaleString()}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${locCls}`}>
                      {lead.location_interest}
                    </span>
                  </td>

                  {/* Source */}
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${src.cls}`}>
                      {src.label}
                    </span>
                  </td>

                  {/* Engagement */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 flex-shrink-0">
                        <div
                          className={`h-1.5 rounded-full ${engColor}`}
                          style={{ width: `${(lead.engagement_score / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {lead.engagement_score}/10
                      </span>
                    </div>
                  </td>

                  {/* Days in pipeline */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`text-sm ${daysColor}`}>{lead.days_in_pipeline}d</span>
                  </td>

                  {/* AI Score badge */}
                  <td className="px-4 py-3.5">
                    <ScoreBadge score={lead.ai_score} />
                  </td>

                  {/* AI Reasoning */}
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                      {lead.ai_reason}
                    </p>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Scored by Claude (claude-sonnet-4-20250514) · Single API call · {leads.length} leads
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> High (70+)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Med (40–69)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Low (&lt;40)
          </span>
        </div>
      </div>
    </div>
  )
}

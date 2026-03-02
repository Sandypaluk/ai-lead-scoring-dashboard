export default function FilterBar({ filters, setFilters, countries, locations, hasFilters }) {
  function update(key, value) {
    setFilters((f) => ({ ...f, [key]: value }))
  }

  function clearAll() {
    setFilters({ search: '', country: '', location: '', tier: '' })
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-5">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="flex-1 min-w-[220px] relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search name, country, location, or reasoning..."
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Country filter */}
        <select
          value={filters.country}
          onChange={(e) => update('country', e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-slate-600 bg-white"
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Location filter */}
        <select
          value={filters.location}
          onChange={(e) => update('location', e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-slate-600 bg-white"
        >
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {/* Score tier filter */}
        <select
          value={filters.tier}
          onChange={(e) => update('tier', e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-slate-600 bg-white"
        >
          <option value="">All Tiers</option>
          <option value="high">🟢 High (70+)</option>
          <option value="medium">🟡 Medium (40–69)</option>
          <option value="low">🔴 Low (&lt;40)</option>
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

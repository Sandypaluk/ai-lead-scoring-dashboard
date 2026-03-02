import { useState, useEffect, useMemo } from 'react'
import SummaryBar from './components/SummaryBar'
import FilterBar from './components/FilterBar'
import LeadsTable from './components/LeadsTable'

export default function App() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    location: '',
    tier: '',
  })

  useEffect(() => {
    scoreLeads()
  }, [])

  async function scoreLeads() {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/score', { method: 'POST' })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to score leads')
      }
      const data = await response.json()
      setLeads(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const countries = useMemo(() => [...new Set(leads.map((l) => l.country))].sort(), [leads])
  const locations = useMemo(
    () => [...new Set(leads.map((l) => l.location_interest))].sort(),
    [leads]
  )

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const search = filters.search.toLowerCase()
      const matchesSearch =
        !search ||
        lead.name.toLowerCase().includes(search) ||
        lead.country.toLowerCase().includes(search) ||
        lead.location_interest.toLowerCase().includes(search) ||
        (lead.ai_reason && lead.ai_reason.toLowerCase().includes(search))

      const matchesCountry = !filters.country || lead.country === filters.country
      const matchesLocation =
        !filters.location || lead.location_interest === filters.location

      let matchesTier = true
      if (filters.tier === 'high') matchesTier = lead.ai_score >= 70
      else if (filters.tier === 'medium')
        matchesTier = lead.ai_score >= 40 && lead.ai_score < 70
      else if (filters.tier === 'low') matchesTier = lead.ai_score < 40

      return matchesSearch && matchesCountry && matchesLocation && matchesTier
    })
  }, [leads, filters])

  const hasFilters = filters.search || filters.country || filters.location || filters.tier

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0C1F3C] shadow-xl">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-[#C9A84C] rounded flex items-center justify-center font-bold text-[#0C1F3C] text-base tracking-tight select-none">
              M
            </div>
            <div>
              <h1 className="text-white text-lg font-semibold tracking-wide leading-none">
                MYNE Homes
              </h1>
              <p className="text-[#C9A84C] text-[11px] tracking-[0.2em] uppercase mt-0.5">
                AI Lead Scoring Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!loading && !error && leads.length > 0 && (
              <span className="text-slate-400 text-sm hidden sm:block">
                Last scored: just now
              </span>
            )}
            <button
              onClick={scoreLeads}
              disabled={loading}
              className="flex items-center gap-2 text-sm bg-[#C9A84C] hover:bg-[#b8963e] disabled:opacity-50 disabled:cursor-not-allowed text-[#0C1F3C] font-semibold px-4 py-2 rounded transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#0C1F3C] border-t-transparent rounded-full animate-spin" />
                  Scoring…
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Rescore All
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-6 py-6">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onRetry={scoreLeads} />
        ) : (
          <>
            <SummaryBar leads={leads} />
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              countries={countries}
              locations={locations}
              hasFilters={hasFilters}
            />
            <LeadsTable leads={filteredLeads} totalLeads={leads.length} />
          </>
        )}
      </main>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-5">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-200 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-slate-700 font-semibold text-lg">Scoring leads with Claude AI</p>
        <p className="text-slate-400 text-sm mt-1">
          Sending all 50 leads in a single API call — this takes a few seconds
        </p>
      </div>
      <div className="flex gap-1.5 mt-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="text-center max-w-md">
        <p className="text-slate-800 font-semibold text-lg">Scoring Failed</p>
        <p className="text-slate-500 text-sm mt-1">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="mt-2 bg-[#0C1F3C] hover:bg-[#1a3460] text-white font-semibold px-6 py-2.5 rounded transition-colors"
      >
        Try Again
      </button>
    </div>
  )
}

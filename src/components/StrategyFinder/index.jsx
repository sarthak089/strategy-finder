import { useState } from 'react'
import './screener.css'
import FilterBar from './FilterBar'
import ContextBar from './ContextBar'
import StrategyTable from './StrategyTable'
import PayoffPanel from './PayoffPanel'
import WakingServer from './WakingServer'
import useStrategies from '../../hooks/useStrategies'

export default function StrategyFinder({ theme, onToggleTheme, onBack }) {
  const {
    filters,
    results,
    loading,
    error,
    expiries,
    meta,
    expiriesLoading,
    wakeAttempts,
    handleChange,
    handleReset,
    handleFind,
  } = useStrategies()

  const [selected, setSelected] = useState(null)

  return (
    <div className="sf-page">
      {expiriesLoading && <WakingServer attempts={wakeAttempts} />}
      <header className="sf-page-head">
        <div className="sf-page-head-left">
          <button className="sf-back" onClick={onBack} aria-label="Back to home">←</button>
          <span className="sf-page-title"><span className="sf-page-mark">⟋</span> Strategy Finder</span>
        </div>
        <button className="theme-toggle" onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          title={theme === 'light' ? 'Dark mode' : 'Light mode'}>
          {theme === 'light' ? '☾' : '☀'}
        </button>
      </header>

      <main className="sf-page-body">
        <div className="sf-page-inner" style={{ position: 'relative' }}>
          <FilterBar
            filters={filters}
            onChange={handleChange}
            onReset={handleReset}
            onFind={handleFind}
            loading={loading}
            expiries={expiries}
          />
          <ContextBar filters={filters} meta={meta} />
          <StrategyTable
            results={results}
            loading={loading}
            error={error}
            onOpen={setSelected}
          />

          {selected && (
            <PayoffPanel
              row={selected}
              filters={filters}
              onClose={() => setSelected(null)}
            />
          )}
        </div>
      </main>
    </div>
  )
}

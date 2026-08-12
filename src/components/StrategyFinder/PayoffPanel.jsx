import { useEffect, useState } from 'react'
import { fetchPayoff } from '../../services/api'
import PayoffChart from './PayoffChart'
import PayoffLoader from './PayoffLoader'

function Stat({ label, value, tone }) {
  const color = tone === 'up' ? 'var(--green)' : tone === 'down' ? 'var(--red)' : 'var(--ink)'
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color }}>{value}</div>
    </div>
  )
}

const inr = (v) => v == null ? '—' : `${v < 0 ? '-' : ''}₹${Math.abs(v).toLocaleString('en-IN')}`

export default function PayoffPanel({ row, filters, onClose }) {
  // result carries the legs it belongs to; loading/error are derived, never
  // set synchronously inside the effect (avoids React 19's cascading-render warning)
  const [result, setResult] = useState({ legs: null, data: null, error: null })

  useEffect(() => {
    let alive = true

    fetchPayoff(row.legs, filters)
      .then(d => { if (alive) setResult({ legs: row.legs, data: d, error: null }) })
      .catch(() => { if (alive) setResult({ legs: row.legs, data: null, error: 'Could not load the payoff for this strategy.' }) })

    return () => { alive = false }
  }, [row, filters])

  // derived state — the result is "current" only if it matches the row on screen
  const isCurrent = result.legs === row.legs
  const data = isCurrent ? result.data : null
  const error = isCurrent ? result.error : null
  const loading = !data && !error

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'var(--panel)',
      display: 'flex', flexDirection: 'column', zIndex: 5,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '14px 18px', borderBottom: '1px solid var(--line-2)',
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{row.strategy}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3, fontFamily: 'monospace' }}>{row.legs}</div>
        </div>
        <button onClick={onClose} style={{
          background: 'transparent', border: '1px solid var(--line-2)', color: 'var(--muted)',
          borderRadius: 4, padding: '4px 10px', fontSize: 12, cursor: 'pointer',
        }}>← Back to results</button>
      </div>

      <div style={{ padding: '16px 18px', overflowY: 'auto' }}>
        {loading && <PayoffLoader />}
        {error && (
          <div style={{ textAlign: 'center', color: 'var(--red)', padding: '60px 0', fontSize: 13 }}>{error}</div>
        )}
        {data && (
          <>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12,
              marginBottom: 14, padding: '12px 14px', background: 'var(--bg-2)',
              border: '1px solid var(--line)', borderRadius: 8,
            }}>
              <Stat label="Max Profit" value={inr(row.max_profit)} tone="up" />
              <Stat label="Max Loss" value={inr(row.max_loss)} tone="down" />
              <Stat label="Prob. of Profit" value={`${row.pop}%`} />
              <Stat label="Risk : Reward" value={row.rr} />
              <Stat label="Net Delta" value={row.delta} />
            </div>

            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 8, padding: '8px 6px 4px' }}>
              <PayoffChart data={data} row={row} />
            </div>

            {/* legend — plain-language, doubles as the beginner explainer */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '10px 18px',
              marginTop: 12, fontSize: 11, color: 'var(--muted)',
            }}>
              <LegendItem color="#38bdf8" label="Payoff at expiry" />
              <LegendItem color="#16351f" label="Profit zone" solid />
              <LegendItem color="#3a1717" label="Loss zone" solid />
              <LegendItem color="#eab308" label="Breakeven" />
              <LegendItem color="#c084fc" label="Probability of landing here" dashed />
              <LegendItem color="var(--ink)" label="Current spot" />
            </div>

            <p style={{ fontSize: 11, color: 'var(--dim)', marginTop: 12, lineHeight: 1.6 }}>
              The blue line is your profit or loss at expiry for every possible closing price of NIFTY.
              It crosses zero at the breakeven{data.breakevens?.length === 1 ? '' : 's'} ({data.breakevens?.map(Math.round).join(', ') || '—'}).
              The purple curve shows how likely each price is, based on a one–standard–deviation move of
              about {inr(data.one_sd_move).replace('₹', '')} points implied by current volatility — so profit is most valuable where the purple curve is tallest.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function LegendItem({ color, label, solid, dashed }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        width: 16, height: solid ? 10 : 0,
        borderTop: solid ? 'none' : `2px ${dashed ? 'dashed' : 'solid'} ${color}`,
        background: solid ? color : 'transparent',
        borderRadius: solid ? 2 : 0, display: 'inline-block',
      }} />
      {label}
    </span>
  )
}

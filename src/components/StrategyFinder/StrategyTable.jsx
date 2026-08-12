import { useState } from 'react'
import { TABLE_COLUMNS } from '../../constants/filters'

function formatValue(value) {
  if (value === undefined || value === null) return <span>—</span>
  const num = parseFloat(value)
  if (isNaN(num)) return <span>—</span>
  const formatted = Math.abs(num).toLocaleString('en-IN')
  if (num > 0) return <span style={{ color: 'var(--green)' }}>₹{formatted}</span>
  if (num < 0) return <span style={{ color: 'var(--red)' }}>-₹{formatted}</span>
  return <span>₹{formatted}</span>
}

function BiasBadge({ bias }) {
  const styles = {
    Bullish: { background: 'var(--green-bg)', color: 'var(--green)' },
    Bearish: { background: 'var(--red-bg)', color: 'var(--red)' },
    Neutral: { background: 'color-mix(in srgb, var(--accent) 16%, transparent)', color: 'var(--accent)' },
  }
  const style = styles[bias] || styles.Neutral
  return (
    <span style={{ ...style, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500 }}>
      {bias}
    </span>
  )
}

const SORTABLE_COLUMNS = ['R:R', 'POP', 'Net Credit', 'Max Profit', 'Max Loss', 'Delta']

function getSortValue(row, col) {
  switch (col) {
    case 'R:R': return parseFloat(row.rr.split(': ')[1])
    case 'POP': return row.pop
    case 'Net Credit': return row.net_credit
    case 'Max Profit': return row.max_profit
    case 'Max Loss': return row.max_loss
    case 'Delta': return row.delta
    default: return 0
  }
}

export default function StrategyTable({ results, loading, error, onOpen }) {
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('desc')
  const [biasFilter, setBiasFilter] = useState('All')

  const handleSort = (col) => {
    if (!SORTABLE_COLUMNS.includes(col)) return
    if (sortCol === col) {
      setSortDir(prev => prev === 'desc' ? 'asc' : 'desc')
    } else {
      setSortCol(col)
      setSortDir('desc')
    }
  }

  const getSortIcon = (col) => {
    if (!SORTABLE_COLUMNS.includes(col)) return null
    if (sortCol !== col) return <span style={{ opacity: 0.3, marginLeft: 4 }}>⬍</span>
    return <span style={{ marginLeft: 4, color: 'var(--accent)' }}>{sortDir === 'desc' ? '↓' : '↑'}</span>
  }

  const biasFiltered = biasFilter === 'All'
    ? results
    : results.filter(r => r.bias === biasFilter)

  const sortedResults = [...biasFiltered].sort((a, b) => {
    if (!sortCol) return 0
    const aVal = getSortValue(a, sortCol)
    const bVal = getSortValue(b, sortCol)
    return sortDir === 'desc' ? bVal - aVal : aVal - bVal
  })

  const bullishCount = results.filter(r => r.bias === 'Bullish').length
  const bearishCount = results.filter(r => r.bias === 'Bearish').length
  const neutralCount = results.filter(r => r.bias === 'Neutral').length

  return (
    <div className="mt-3 sf-table-wrap">

      {results.length > 0 && (
        <div className="sf-bias-bar" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, padding: '8px 12px' }}>
          <span className="sf-ctx" style={{ fontSize: 12, marginRight: 4 }}>Bias:</span>
          {['All', 'Bullish', 'Bearish', 'Neutral'].map(tab => {
            const count = tab === 'All' ? results.length : tab === 'Bullish' ? bullishCount : tab === 'Bearish' ? bearishCount : neutralCount
            return (
              <button
                key={tab}
                className={`sf-bias-tab${biasFilter === tab ? ' active' : ''}`}
                style={{ padding: '3px 10px', borderRadius: 4, fontSize: 12, cursor: 'pointer', fontWeight: 500, transition: 'all .15s' }}
                onClick={() => setBiasFilter(tab)}
              >
                {tab} ({count})
              </button>
            )
          })}
        </div>
      )}

      <div className="sf-table-scroll" style={{ maxHeight: '420px', overflowY: 'auto' }}>
        <table className="w-full text-xs border-collapse" style={{ minWidth: 720 }}>
          <thead>
            <tr className="sf-thead" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              {TABLE_COLUMNS.map(col => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="sf-th text-left font-medium px-3 py-2.5 whitespace-nowrap"
                  style={{ cursor: SORTABLE_COLUMNS.includes(col) ? 'pointer' : 'default' }}
                >
                  {col}{getSortIcon(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="sf-tbody">
            {loading && (
              <tr>
                <td colSpan={TABLE_COLUMNS.length} className="sf-empty text-center px-3 py-16">
                  Finding strategies...
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={TABLE_COLUMNS.length} className="text-center px-3 py-16" style={{ color: 'var(--red)' }}>
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && results.length === 0 && (
              <tr>
                <td colSpan={TABLE_COLUMNS.length} className="sf-empty text-center px-3 py-16">
                  No results. Adjust filters and click Find Strategies.
                </td>
              </tr>
            )}
            {!loading && sortedResults.map((row, i) => (
              <tr key={i} className="sf-row">
                <td className="sf-cell px-3 py-2.5">{i + 1}</td>
                <td className="px-3 py-2.5">
                  <div className="sf-cell font-medium">{row.legs}</div>
                  <div className="sf-cell-sub mt-0.5">{row.strategy}</div>
                </td>
                <td className="sf-cell px-3 py-2.5">{row.rr}</td>
                <td className="sf-cell px-3 py-2.5">{row.pop}%</td>
                <td className="px-3 py-2.5">{formatValue(row.net_credit)}</td>
                <td className="px-3 py-2.5">{formatValue(row.max_profit)}</td>
                <td className="px-3 py-2.5">{formatValue(row.max_loss)}</td>
                <td className="sf-cell px-3 py-2.5">{row.delta}</td>
                <td className="px-3 py-2.5"><BiasBadge bias={row.bias} /></td>
                <td className="px-3 py-2.5">
                  <button onClick={() => onOpen(row)} className="sf-open-btn">Open</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!loading && results.length > 0 && (
        <div className="sf-foot px-3 py-2 text-[11px]">
          {sortedResults.length} of {results.length} strategies shown.
        </div>
      )}
    </div>
  )
}

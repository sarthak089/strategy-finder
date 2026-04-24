import { useState } from 'react'
import { TABLE_COLUMNS } from '../../constants/filters'

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

function formatValue(value) {
  if (value === undefined || value === null) return <span>—</span>
  const num = parseFloat(value)
  if (isNaN(num)) return <span>—</span>
  const formatted = Math.abs(num).toLocaleString('en-IN')
  if (num > 0) return <span style={{ color: '#4ade80' }}>₹{formatted}</span>
  if (num < 0) return <span style={{ color: '#f87171' }}>-₹{formatted}</span>
  return <span>₹{formatted}</span>
}

function BiasBadge({ bias }) {
  const styles = {
    Bullish: { background: '#14532d', color: '#4ade80' },
    Bearish: { background: '#7f1d1d', color: '#f87171' },
    Neutral: { background: '#1e3a5f', color: '#93c5fd' },
  }
  const style = styles[bias] || styles.Neutral
  return (
    <span style={{ ...style, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500 }}>
      {bias}
    </span>
  )
}

export default function StrategyTable({ results, loading, error }) {
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('desc')

  const handleSort = (col) => {
    if (!SORTABLE_COLUMNS.includes(col)) return
    if (sortCol === col) {
      setSortDir(prev => prev === 'desc' ? 'asc' : 'desc')
    } else {
      setSortCol(col)
      setSortDir('desc')
    }
  }

  const sortedResults = [...results].sort((a, b) => {
    if (!sortCol) return 0
    const aVal = getSortValue(a, sortCol)
    const bVal = getSortValue(b, sortCol)
    return sortDir === 'desc' ? bVal - aVal : aVal - bVal
  })

  const getSortIcon = (col) => {
    if (!SORTABLE_COLUMNS.includes(col)) return null
    if (sortCol !== col) return <span style={{ opacity: 0.3, marginLeft: 4 }}>⬍</span>
    return <span style={{ marginLeft: 4, color: '#2a7b9b' }}>{sortDir === 'desc' ? '↓' : '↑'}</span>
  }

  return (
    <div className="mt-3 border border-[#2a4a5a] rounded-lg overflow-hidden">
      <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-[#0f1e28]" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              {TABLE_COLUMNS.map(col => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="text-left text-[#8aa8b8] font-medium px-3 py-2.5 whitespace-nowrap border-b border-[#2a4a5a]"
                  style={{ cursor: SORTABLE_COLUMNS.includes(col) ? 'pointer' : 'default' }}
                >
                  {col}{getSortIcon(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-[#141f28]">
            {loading && (
              <tr>
                <td colSpan={TABLE_COLUMNS.length} className="text-center text-[#3a5a6a] px-3 py-16">
                  Finding strategies...
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={TABLE_COLUMNS.length} className="text-center text-red-400 px-3 py-16">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && results.length === 0 && (
              <tr>
                <td colSpan={TABLE_COLUMNS.length} className="text-center text-[#3a5a6a] px-3 py-16">
                  No results. Adjust filters and click Find Strategies.
                </td>
              </tr>
            )}
            {!loading && sortedResults.map((row, i) => (
              <tr key={i} className="hover:bg-[#1a2e3a] border-b border-[#1a2e3a]">
                <td className="px-3 py-2.5 text-[#d0e8f0]">{i + 1}</td>
                <td className="px-3 py-2.5">
                  <div className="text-[#d0e8f0] font-medium">{row.legs}</div>
                  <div className="text-[#8aa8b8] mt-0.5">{row.strategy}</div>
                </td>
                <td className="px-3 py-2.5 text-[#d0e8f0]">{row.rr}</td>
                <td className="px-3 py-2.5 text-[#d0e8f0]">{row.pop}%</td>
                <td className="px-3 py-2.5">{formatValue(row.net_credit)}</td>
                <td className="px-3 py-2.5">{formatValue(row.max_profit)}</td>
                <td className="px-3 py-2.5">{formatValue(row.max_loss)}</td>
                <td className="px-3 py-2.5 text-[#d0e8f0]">{row.delta}</td>
                <td className="px-3 py-2.5"><BiasBadge bias={row.bias} /></td>
                <td className="px-3 py-2.5">
                  <button className="px-2 py-1 border border-[#2a7b9b] text-[#2a7b9b] rounded text-xs hover:bg-[#2a7b9b] hover:text-white transition-colors">
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!loading && results.length > 0 && (
        <div className="px-3 py-2 text-[11px] text-[#8aa8b8] border-t border-[#2a4a5a]">
          {results.length} strategies found.
        </div>
      )}
    </div>
  )
}

// import { TABLE_COLUMNS } from '../../constants/filters'

// function formatValue(value) {
//   if (value === undefined || value === null) return <span>—</span>
//   const num = parseFloat(value)
//   if (isNaN(num)) return <span>—</span>
//   const formatted = Math.abs(num).toLocaleString('en-IN')
//   if (num > 0) return <span style={{ color: '#4ade80' }}>₹{formatted}</span>
//   if (num < 0) return <span style={{ color: '#f87171' }}>-₹{formatted}</span>
//   return <span>₹{formatted}</span>
// }

// function BiasBadge({ bias }) {
//   const styles = {
//     Bullish: { background: '#14532d', color: '#4ade80' },
//     Bearish: { background: '#7f1d1d', color: '#f87171' },
//     Neutral: { background: '#1e3a5f', color: '#93c5fd' },
//   }
//   const style = styles[bias] || styles.Neutral
//   return (
//     <span style={{ ...style, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500 }}>
//       {bias}
//     </span>
//   )
// }

// export default function StrategyTable({ results, loading, error }) {
//   return (
//     <div className="mt-3 border border-[#2a4a5a] rounded-lg overflow-hidden">
//       <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
//         <table className="w-full text-xs border-collapse">
//           <thead>
//             <tr className="bg-[#0f1e28]" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//               {TABLE_COLUMNS.map(col => (
//                 <th key={col} className="text-left text-[#8aa8b8] font-medium px-3 py-2.5 whitespace-nowrap border-b border-[#2a4a5a]">
//                   {col}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-[#141f28]">
//             {loading && (
//               <tr>
//                 <td colSpan={TABLE_COLUMNS.length} className="text-center text-[#3a5a6a] px-3 py-16">
//                   Finding strategies...
//                 </td>
//               </tr>
//             )}
//             {error && !loading && (
//               <tr>
//                 <td colSpan={TABLE_COLUMNS.length} className="text-center text-red-400 px-3 py-16">
//                   {error}
//                 </td>
//               </tr>
//             )}
//             {!loading && !error && results.length === 0 && (
//               <tr>
//                 <td colSpan={TABLE_COLUMNS.length} className="text-center text-[#3a5a6a] px-3 py-16">
//                   No results. Adjust filters and click Find Strategies.
//                 </td>
//               </tr>
//             )}
//             {!loading && results.map((row, i) => (
//               <tr key={i} className="hover:bg-[#1a2e3a] border-b border-[#1a2e3a]">
//                 <td className="px-3 py-2.5 text-[#d0e8f0]">{i + 1}</td>
//                 <td className="px-3 py-2.5">
//                    <div className="text-[#d0e8f0] font-medium">{row.legs}</div>
//                    <div className="text-[#8aa8b8] mt-0.5">{row.strategy}</div>
//                 </td>
//                 <td className="px-3 py-2.5 text-[#d0e8f0]">{row.rr}</td>
//                 <td className="px-3 py-2.5 text-[#d0e8f0]">{row.pop}%</td>
//                 <td className="px-3 py-2.5">{formatValue(row.net_credit)}</td>
//                 <td className="px-3 py-2.5">{formatValue(row.max_profit)}</td>
//                 <td className="px-3 py-2.5">{formatValue(row.max_loss)}</td>
//                 <td className="px-3 py-2.5 text-[#d0e8f0]">{row.delta}</td>
//                 <td className="px-3 py-2.5"><BiasBadge bias={row.bias} /></td>
//                 <td className="px-3 py-2.5">
//                   <button className="px-2 py-1 border border-[#2a7b9b] text-[#2a7b9b] rounded text-xs hover:bg-[#2a7b9b] hover:text-white transition-colors">
//                     Open
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {!loading && results.length > 0 && (
//         <div className="px-3 py-2 text-[11px] text-[#8aa8b8] border-t border-[#2a4a5a]">
//           {results.length} strategies found.
//         </div>
//       )}
//     </div>
//   )
// }
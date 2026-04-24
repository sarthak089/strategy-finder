import Button from '../common/Button'
import { LEG_COUNT_OPTIONS, BIAS_OPTIONS } from '../../constants/filters'

const inputClass = "bg-[#0f1e28] border border-[#2a4a5a] text-[#d0e8f0] text-sm rounded px-2 py-1.5 w-full focus:outline-none focus:border-cyan-500"
const labelClass = "text-[11px] text-[#8aa8b8] mb-1 block"

export default function FilterBar({ filters, onChange, onReset, onFind, loading, expiries }) {
  return (
    <div className="flex flex-wrap gap-3 items-end">

      <div>
        <label className={labelClass}>Min Reward Ratio</label>
        <input type="number" className={inputClass} style={{ width: 110 }}
          value={filters.minRewardRatio} onChange={onChange('minRewardRatio')} />
      </div>

      <div>
        <label className={labelClass}>Min POP</label>
        <input type="number" className={inputClass} style={{ width: 80 }}
          value={filters.minPOP} onChange={onChange('minPOP')} />
      </div>

      <div>
        <label className={labelClass}>Max Loss</label>
        <input type="text" className={inputClass} style={{ width: 90 }}
          placeholder="Ex: 5000" value={filters.maxLoss} onChange={onChange('maxLoss')} />
      </div>

      <div>
        <label className={labelClass}>Expiry</label>
        <select className={inputClass} style={{ width: 130 }}
          value={filters.expiry} onChange={onChange('expiry')}>
          {expiries.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>OTM Range</label>
        <input type="number" className={inputClass} style={{ width: 90 }}
          value={filters.otmRange} onChange={onChange('otmRange')} />
      </div>

      <div>
        <label className={labelClass}>ITM Range</label>
        <input type="number" className={inputClass} style={{ width: 80 }}
          value={filters.itmRange} onChange={onChange('itmRange')} />
      </div>

      <div>
        <label className={labelClass}>Leg Count</label>
        <select className={inputClass} style={{ width: 100 }}
          value={filters.legCount} onChange={onChange('legCount')}>
          {LEG_COUNT_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Bias Filter</label>
        <select className={inputClass} style={{ width: 90 }}
          value={filters.biasFilter} onChange={onChange('biasFilter')}>
          {BIAS_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="flex gap-2">
        <Button onClick={onReset}>Reset</Button>
        <Button onClick={onFind} variant="primary">
          {loading ? 'Finding...' : 'Find Strategies'}
        </Button>
      </div>

    </div>
  )
}

// import Button from '../common/Button'
// import { LEG_COUNT_OPTIONS, BIAS_OPTIONS } from '../../constants/filters'

// const inputClass = "bg-[#0f1e28] border border-[#2a4a5a] text-[#d0e8f0] text-sm rounded px-2 py-1.5 w-full focus:outline-none focus:border-cyan-500"
// const labelClass = "text-[11px] text-[#8aa8b8] mb-1 block"

// export default function FilterBar({ filters, onChange, onReset, onFind, loading }) {
//   return (
//     <div className="flex flex-wrap gap-3 items-end">

//       <div>
//         <label className={labelClass}>Min Reward Ratio</label>
//         <input type="number" className={inputClass} style={{ width: 110 }}
//           value={filters.minRewardRatio} onChange={onChange('minRewardRatio')} />
//       </div>

//       <div>
//         <label className={labelClass}>Min POP</label>
//         <input type="number" className={inputClass} style={{ width: 80 }}
//           value={filters.minPOP} onChange={onChange('minPOP')} />
//       </div>

//       <div>
//         <label className={labelClass}>Max Loss</label>
//         <input type="text" className={inputClass} style={{ width: 90 }}
//           placeholder="Ex: 5000" value={filters.maxLoss} onChange={onChange('maxLoss')} />
//       </div>

//       <div>
//         <label className={labelClass}>Expiry</label>
//         <input type="text" className={inputClass} style={{ width: 120 }}
//           placeholder="28-Apr-2026"
//           value={filters.expiry} onChange={onChange('expiry')} />
//       </div>

//       <div>
//         <label className={labelClass}>OTM Range</label>
//         <input type="number" className={inputClass} style={{ width: 90 }}
//           value={filters.otmRange} onChange={onChange('otmRange')} />
//       </div>

//       <div>
//         <label className={labelClass}>ITM Range</label>
//         <input type="number" className={inputClass} style={{ width: 80 }}
//           value={filters.itmRange} onChange={onChange('itmRange')} />
//       </div>

//       <div>
//         <label className={labelClass}>Leg Count</label>
//         <select className={inputClass} style={{ width: 100 }}
//           value={filters.legCount} onChange={onChange('legCount')}>
//           {LEG_COUNT_OPTIONS.map(o => <option key={o}>{o}</option>)}
//         </select>
//       </div>

//       <div>
//         <label className={labelClass}>Bias Filter</label>
//         <select className={inputClass} style={{ width: 90 }}
//           value={filters.biasFilter} onChange={onChange('biasFilter')}>
//           {BIAS_OPTIONS.map(o => <option key={o}>{o}</option>)}
//         </select>
//       </div>

//       <div className="flex gap-2">
//         <Button onClick={onReset}>Reset</Button>
//         <Button onClick={onFind} variant="primary">
//           {loading ? 'Finding...' : 'Find Strategies'}
//         </Button>
//       </div>

//     </div>
//   )
// }
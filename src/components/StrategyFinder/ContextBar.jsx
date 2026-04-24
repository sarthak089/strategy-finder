export default function ContextBar({ filters, meta }) {
  return (
    <div className="mt-4 text-xs text-[#8aa8b8]">
      <span className="text-[#d0e8f0] font-medium">Current Context</span>
      <br />
      <span className="text-[#aac8d8]">Index: NIFTY</span> |{' '}
      <span className="text-[#aac8d8]">ATM: {meta?.atm ?? '—'}</span> |{' '}
      <span className="text-[#aac8d8]">Spot: {meta?.spot ?? '—'}</span> |{' '}
      <span className="text-[#aac8d8]">VIX: {meta?.vix ? (meta.vix * 100).toFixed(2) : '—'}</span> |{' '}
      <span className="text-[#aac8d8]">OTM: {filters.otmRange}</span> |{' '}
      <span className="text-[#aac8d8]">ITM: {filters.itmRange}</span> |{' '}
      <span className="text-[#aac8d8]">Expiry: {meta?.expiry ?? filters.expiry}</span>
    </div>
  )
}

// export default function ContextBar({ filters }) {
//   return (
//     <div className="mt-4 text-xs text-[#8aa8b8]">
//       <span className="text-[#d0e8f0] font-medium">Current Context</span>
//       <br />
//       <span className="text-[#aac8d8]">Index: NIFTY</span> |{' '}
//       <span className="text-[#aac8d8]">ATM: 24400</span> |{' '}
//       <span className="text-[#aac8d8]">Strike Range: 23400 – 25400</span> |{' '}
//       <span className="text-[#aac8d8]">Total Strikes: 41</span> |{' '}
//       <span className="text-[#aac8d8]">OTM: {filters.otmRange}</span> |{' '}
//       <span className="text-[#aac8d8]">ITM: {filters.itmRange}</span>
//     </div>
//   )
// }
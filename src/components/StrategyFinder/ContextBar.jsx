export default function ContextBar({ filters, meta }) {
  return (
    <div className="mt-4 text-xs sf-ctx">
      <span className="sf-ctx-title">Current Context</span>
      <br />
      <span className="sf-ctx-val">Index: NIFTY</span> |{' '}
      <span className="sf-ctx-val">ATM: {meta?.atm ?? '—'}</span> |{' '}
      <span className="sf-ctx-val">Spot: {meta?.spot ?? '—'}</span> |{' '}
      <span className="sf-ctx-val">VIX: {meta?.vix ? (meta.vix * 100).toFixed(2) : '—'}</span> |{' '}
      <span className="sf-ctx-val">OTM: {filters.otmRange}</span> |{' '}
      <span className="sf-ctx-val">ITM: {filters.itmRange}</span> |{' '}
      <span className="sf-ctx-val">Expiry: {meta?.expiry ?? filters.expiry}</span>
    </div>
  )
}

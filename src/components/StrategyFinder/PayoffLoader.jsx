import { useEffect, useState } from 'react'

const MESSAGES = [
  'Fetching the live option chain…',
  'Pricing each leg with Black–Scholes…',
  'Modelling the payoff across every strike…',
  'Computing breakevens and probability…',
]

/**
 * Loading state for the payoff panel. An outline of a payoff curve is traced
 * on repeat while the request runs, with a shimmer sweep and rotating status
 * lines — turns the cold-start wait into something that reads as "working".
 */
export default function PayoffLoader() {
  const [msg, setMsg] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setMsg(m => (m + 1) % MESSAGES.length), 1800)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ padding: '28px 10px 36px', textAlign: 'center' }}>
      <style>{`
        @keyframes sf-trace { to { stroke-dashoffset: 0; } }
        @keyframes sf-shimmer { 0% { transform: translateX(-120%); } 100% { transform: translateX(220%); } }
        @keyframes sf-pulse { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
        @keyframes sf-fade { 0% { opacity: 0; transform: translateY(4px);} 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .sf-trace-path, .sf-shimmer, .sf-dot { animation: none !important; }
          .sf-trace-path { stroke-dashoffset: 0 !important; }
        }
      `}</style>

      {/* skeleton chart */}
      <div style={{
        position: 'relative', maxWidth: 460, margin: '0 auto',
        background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 10,
        padding: 14, overflow: 'hidden',
      }}>
        {/* shimmer sweep */}
        <div className="sf-shimmer" style={{
          position: 'absolute', top: 0, bottom: 0, width: '40%',
          background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 8%, transparent), transparent)',
          animation: 'sf-shimmer 1.6s ease-in-out infinite',
        }} />

        <svg viewBox="0 0 460 210" width="100%" style={{ display: 'block' }}>
          {/* faint grid */}
          {[40, 90, 140].map((y, i) => (
            <line key={i} x1="0" y1={y} x2="460" y2={y} stroke="var(--line)" strokeWidth="1" />
          ))}
          <line x1="0" y1="140" x2="460" y2="140" stroke="var(--line-2)" strokeWidth="1" strokeDasharray="3 3" />

          {/* traced payoff outline (a butterfly-ish shape) */}
          <path
            className="sf-trace-path"
            d="M 0 168 L 150 168 L 210 60 L 250 60 L 310 168 L 460 168"
            fill="none" stroke="var(--accent)" strokeWidth="1.75"
            strokeDasharray="900" strokeDashoffset="900"
            style={{ animation: 'sf-trace 2.2s ease-in-out infinite' }}
          />

          {/* moving dot on the curve */}
          <circle className="sf-dot" r="4" fill="var(--accent)"
            style={{ animation: 'sf-pulse 1.4s ease-in-out infinite' }}>
            <animateMotion dur="2.2s" repeatCount="indefinite"
              path="M 0 168 L 150 168 L 210 60 L 250 60 L 310 168 L 460 168" />
          </circle>
        </svg>
      </div>

      {/* rotating status line */}
      <div key={msg} style={{
        marginTop: 18, fontSize: 13, color: 'var(--muted)',
        animation: 'sf-fade .4s ease', minHeight: 18,
      }}>
        {MESSAGES[msg]}
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--dim)' }}>
        First run can take a few seconds while the server wakes up.
      </div>
    </div>
  )
}

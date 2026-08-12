import { useEffect, useState } from 'react'

/**
 * Full-screen overlay shown while the first backend call (expiries) is in
 * flight. On a cold Render start this can take ~30-60s, so after a few seconds
 * the copy escalates to explain the wait instead of looking frozen.
 */
export default function WakingServer({ attempts }) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  // escalate the message the longer it takes
  const coldStart = seconds >= 4 || attempts >= 1
  const title = coldStart ? 'Waking up the server…' : 'Loading…'
  const detail = coldStart
    ? 'The backend sleeps after inactivity to keep hosting free. First load can take up to a minute — thanks for your patience.'
    : 'Fetching live NIFTY expiries.'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans)', padding: 24, textAlign: 'center',
    }}>
      <style>{`
        @keyframes ws-spin { to { transform: rotate(360deg); } }
        @keyframes ws-pulse { 0%,100% { opacity: .4; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .ws-ring { animation: none !important; } }
      `}</style>

      {/* spinner */}
      <div className="ws-ring" style={{
        width: 44, height: 44, borderRadius: '50%',
        border: '3px solid var(--line-2)', borderTopColor: 'var(--accent)',
        animation: 'ws-spin 0.9s linear infinite', marginBottom: 22,
      }} />

      <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{title}</div>
      <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 380, lineHeight: 1.6, margin: 0 }}>
        {detail}
      </p>

      {coldStart && (
        <div style={{
          marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 12,
          color: 'var(--dim)', animation: 'ws-pulse 1.6s ease-in-out infinite',
        }}>
          waiting… {seconds}s
        </div>
      )}
    </div>
  )
}

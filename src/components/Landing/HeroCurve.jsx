/**
 * Animated iron-condor payoff motif for the hero. Decorative but honest — it's
 * the actual shape the tool computes, drawn with the same profit/loss/zero
 * vocabulary as the real diagram, so the hero states the product's thesis.
 */
export default function HeroCurve() {
  const W = 560, H = 300
  // stylised condor payoff points (x normalised to the viewBox)
  const pts = [
    [0, 232], [150, 232], [210, 96], [350, 96], [410, 232], [560, 232],
  ]
  const zeroY = 200
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
  // profit fill (above zero, between the shoulders)
  const profit = `M 187 ${zeroY} L 210 96 L 350 96 L 373 ${zeroY} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* grid */}
      {[60, 130, 200, 270].map((y, i) => (
        <line key={i} x1="0" y1={y} x2={W} y2={y} stroke="#16293450" strokeWidth="1" />
      ))}

      {/* probability bell, quiet in the background */}
      <path
        d="M 0 285 Q 140 285 210 250 Q 280 205 350 250 Q 420 285 560 285"
        fill="none" stroke="#c084fc" strokeWidth="1.25" strokeDasharray="4 3" opacity="0.4"
      />

      {/* zero line */}
      <line x1="0" y1={zeroY} x2={W} y2={zeroY} stroke="#5a7a8a" strokeWidth="1.25" />

      {/* profit region */}
      <path d={profit} fill="#22c55e" opacity="0.16" />

      {/* payoff line, drawn on load */}
      <path d={line} fill="none" stroke="#38bdf8" strokeWidth="2.5"
        strokeDasharray="1400" strokeDashoffset="1400">
        <animate attributeName="stroke-dashoffset" from="1400" to="0" dur="1.4s" fill="freeze" />
      </path>

      {/* breakeven ticks */}
      {[187, 373].map((x, i) => (
        <line key={i} x1={x} y1="70" x2={x} y2="250" stroke="#eab308" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
      ))}

      {/* spot marker */}
      <line x1="280" y1="60" x2="280" y2="250" stroke="#e2f0f6" strokeWidth="1.25" opacity="0.85" />
      <circle cx="280" cy="96" r="4" fill="#38bdf8" stroke="#0d1922" strokeWidth="2">
        <animate attributeName="r" values="4;6;4" dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

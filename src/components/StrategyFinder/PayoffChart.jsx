import { useMemo, useState, useId } from 'react'

/**
 * Pure-SVG payoff diagram — refined for a slicker, lighter look.
 * Thin curve, soft gradient fills, quiet grid. All structural colours come
 * from CSS theme variables so it reads correctly in light and dark mode.
 */
export default function PayoffChart({ data }) {
  const [hover, setHover] = useState(null)
  const uid = useId().replace(/:/g, '')

  const W = 640
  const H = 316
  const padL = 56
  const padR = 20
  const padT = 26
  const padB = 44
  const probBandH = 40

  const geom = useMemo(() => {
    if (!data?.curve?.length) return null
    const xs = data.curve.map(p => p.spot)
    const ys = data.curve.map(p => p.pnl)
    const xMin = Math.min(...xs)
    const xMax = Math.max(...xs)
    let yMin = Math.min(...ys, 0)
    let yMax = Math.max(...ys, 0)
    const yPad = (yMax - yMin) * 0.16 || 1
    yMin -= yPad
    yMax += yPad
    const plotBottom = H - padB - probBandH
    const sx = (v) => padL + ((v - xMin) / (xMax - xMin)) * (W - padL - padR)
    const sy = (v) => padT + (1 - (v - yMin) / (yMax - yMin)) * (plotBottom - padT)
    const sProb = (d) => (H - padB) - d * probBandH
    return { xMin, xMax, yMin, yMax, sx, sy, sProb, plotBottom }
  }, [data])

  if (!geom) return null
  const { xMin, xMax, yMin, yMax, sx, sy, sProb, plotBottom } = geom
  const zeroY = sy(0)

  const areaPath = (predicate) => {
    let d = ''
    let open = false
    data.curve.forEach((p) => {
      const inRegion = predicate(p.pnl)
      if (inRegion && !open) {
        d += `M ${sx(p.spot)} ${zeroY} L ${sx(p.spot)} ${sy(p.pnl)} `
        open = true
      } else if (inRegion && open) {
        d += `L ${sx(p.spot)} ${sy(p.pnl)} `
      } else if (!inRegion && open) {
        d += `L ${sx(p.spot)} ${zeroY} Z `
        open = false
      }
    })
    if (open) {
      const last = data.curve[data.curve.length - 1]
      d += `L ${sx(last.spot)} ${zeroY} Z`
    }
    return d
  }

  const linePath = data.curve
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.spot)} ${sy(p.pnl)}`)
    .join(' ')

  const probLine = data.curve
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.spot)} ${sProb(p.density)}`)
    .join(' ')
  let probArea = `M ${sx(data.curve[0].spot)} ${H - padB} `
  data.curve.forEach(p => { probArea += `L ${sx(p.spot)} ${sProb(p.density)} ` })
  probArea += `L ${sx(data.curve[data.curve.length - 1].spot)} ${H - padB} Z`

  const yTicks = []
  for (let i = 0; i <= 4; i++) yTicks.push(yMin + (yMax - yMin) * (i / 4))

  const fmtInr = (v) => {
    const a = Math.abs(v)
    const s = a >= 1000 ? `${(a / 1000).toFixed(1)}k` : a.toFixed(0)
    return `${v < 0 ? '-' : ''}₹${s}`
  }

  const minGap = (xMax - xMin) * 0.06
  const beLabels = (data.breakevens || []).filter(
    be => be >= xMin && be <= xMax && Math.abs(be - data.spot) > minGap
  )

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const spot = xMin + ((px - padL) / (W - padL - padR)) * (xMax - xMin)
    let nearest = data.curve[0], best = Infinity
    for (const p of data.curve) {
      const dd = Math.abs(p.spot - spot)
      if (dd < best) { best = dd; nearest = p }
    }
    setHover(nearest)
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}
      onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>

      <defs>
        <linearGradient id={`profit-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--green)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--green)" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id={`loss-${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--red)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--red)" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id={`prob-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--purple)" stopOpacity="0.20" />
          <stop offset="100%" stopColor="var(--purple)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* y grid + labels */}
      {yTicks.map((v, i) => (
        <g key={i}>
          <line x1={padL} y1={sy(v)} x2={W - padR} y2={sy(v)}
            stroke="var(--line)" strokeWidth="1" opacity="0.6" />
          <text x={padL - 8} y={sy(v) + 3} textAnchor="end" fontSize="9"
            fill="var(--dim)" fontFamily="var(--font-mono)">{fmtInr(v)}</text>
        </g>
      ))}

      {/* profit / loss fills (soft gradients) */}
      <path d={areaPath(v => v >= 0)} fill={`url(#profit-${uid})`} />
      <path d={areaPath(v => v < 0)} fill={`url(#loss-${uid})`} />

      {/* zero line */}
      <line x1={padL} y1={zeroY} x2={W - padR} y2={zeroY}
        stroke="var(--muted)" strokeWidth="1" opacity="0.55" />
      <text x={W - padR} y={zeroY - 5} textAnchor="end" fontSize="8"
        fill="var(--dim)" fontFamily="var(--font-mono)">break-even</text>

      {/* strike guides */}
      {data.strikes?.map((k, i) => (
        k >= xMin && k <= xMax ? (
          <line key={i} x1={sx(k)} y1={padT} x2={sx(k)} y2={plotBottom}
            stroke="var(--line-2)" strokeWidth="1" opacity="0.4" />
        ) : null
      ))}

      {/* breakevens */}
      {data.breakevens?.map((be, i) => (
        be >= xMin && be <= xMax ? (
          <line key={i} x1={sx(be)} y1={padT} x2={sx(be)} y2={plotBottom}
            stroke="var(--amber)" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        ) : null
      ))}

      {/* payoff line — thin & crisp */}
      <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="1.75"
        strokeLinejoin="round" strokeLinecap="round" />

      {/* spot marker */}
      {data.spot >= xMin && data.spot <= xMax && (
        <>
          <line x1={sx(data.spot)} y1={padT - 4} x2={sx(data.spot)} y2={plotBottom}
            stroke="var(--ink)" strokeWidth="1" opacity="0.5" />
          <text x={sx(data.spot)} y={padT - 9} textAnchor="middle" fontSize="9.5"
            fill="var(--ink)" fontWeight="600">Spot {Math.round(data.spot)}</text>
        </>
      )}

      {/* probability band */}
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB}
        stroke="var(--line-2)" strokeWidth="1" opacity="0.5" />
      <path d={probArea} fill={`url(#prob-${uid})`} />
      <path d={probLine} fill="none" stroke="var(--purple)" strokeWidth="1" opacity="0.6" />
      <text x={padL - 8} y={H - padB - probBandH / 2 + 3} textAnchor="end" fontSize="7.5"
        fill="var(--purple)" opacity="0.8" fontFamily="var(--font-mono)">prob</text>

      {/* x labels */}
      <text x={sx(data.spot)} y={H - padB + 15} textAnchor="middle" fontSize="9"
        fill="var(--ink)" fontWeight="600" fontFamily="var(--font-mono)">{Math.round(data.spot)}</text>
      {beLabels.map((be, i) => (
        <text key={i} x={sx(be)} y={H - padB + 15} textAnchor="middle" fontSize="8.5"
          fill="var(--amber)" fontFamily="var(--font-mono)">{Math.round(be)}</text>
      ))}

      {/* hover readout */}
      {hover && (
        <g>
          <line x1={sx(hover.spot)} y1={padT} x2={sx(hover.spot)} y2={plotBottom}
            stroke="var(--accent)" strokeWidth="0.75" opacity="0.4" />
          <circle cx={sx(hover.spot)} cy={sy(hover.pnl)} r="3" fill="var(--accent)"
            stroke="var(--panel)" strokeWidth="1.5" />
          <g transform={`translate(${Math.min(sx(hover.spot) + 10, W - 116)}, ${Math.max(sy(hover.pnl) - 34, padT)})`}>
            <rect width="110" height="36" rx="6" fill="var(--panel-2)" stroke="var(--line-2)" />
            <text x="9" y="14" fontSize="9" fill="var(--muted)" fontFamily="var(--font-mono)">NIFTY {Math.round(hover.spot)}</text>
            <text x="9" y="27" fontSize="10.5" fontWeight="600" fontFamily="var(--font-mono)"
              fill={hover.pnl >= 0 ? 'var(--green)' : 'var(--red)'}>P&L {fmtInr(hover.pnl)}</text>
          </g>
        </g>
      )}
    </svg>
  )
}

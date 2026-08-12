import { useMemo, useState } from 'react'

/**
 * Pure-SVG payoff diagram. No charting library — the curve, axes, breakevens,
 * strike markers, spot marker and probability band are all drawn by hand from
 * the piecewise-linear payoff the backend samples with its own segment engine.
 */
export default function PayoffChart({ data }) {
  const [hover, setHover] = useState(null)

  const W = 640
  const H = 320
  const padL = 58
  const padR = 18
  const padT = 24
  const padB = 46
  const probBandH = 46 // reserved strip at the bottom for the probability curve

  const geom = useMemo(() => {
    if (!data?.curve?.length) return null
    const xs = data.curve.map(p => p.spot)
    const ys = data.curve.map(p => p.pnl)
    const xMin = Math.min(...xs)
    const xMax = Math.max(...xs)
    let yMin = Math.min(...ys, 0)
    let yMax = Math.max(...ys, 0)
    const yPad = (yMax - yMin) * 0.14 || 1
    yMin -= yPad
    yMax += yPad

    const plotBottom = H - padB - probBandH
    const sx = (v) => padL + ((v - xMin) / (xMax - xMin)) * (W - padL - padR)
    const sy = (v) => padT + (1 - (v - yMin) / (yMax - yMin)) * (plotBottom - padT)
    // probability band maps density 0..1 into the reserved bottom strip
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

  // probability band: filled area under the density curve, in the bottom strip
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

  // x-axis: label only spot + breakevens (strikes already show as vertical
  // guide lines, so numbering them too just collides). Space-aware: drop a
  // breakeven label if it sits too close to the spot label.
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

      {/* y grid + labels */}
      {yTicks.map((v, i) => (
        <g key={i}>
          <line x1={padL} y1={sy(v)} x2={W - padR} y2={sy(v)} stroke="var(--line)" strokeWidth="1" />
          <text x={padL - 8} y={sy(v) + 3} textAnchor="end" fontSize="9" fill="var(--dim)">{fmtInr(v)}</text>
        </g>
      ))}

      {/* profit / loss fills */}
      <path d={areaPath(v => v >= 0)} fill="#22c55e" opacity="0.16" />
      <path d={areaPath(v => v < 0)} fill="#ef4444" opacity="0.14" />

      {/* zero line — prominent */}
      <line x1={padL} y1={zeroY} x2={W - padR} y2={zeroY} stroke="var(--muted)" strokeWidth="1.25" />
      <text x={W - padR} y={zeroY - 4} textAnchor="end" fontSize="8.5" fill="var(--muted)">break-even P&L = 0</text>

      {/* strike markers */}
      {data.strikes?.map((k, i) => (
        k >= xMin && k <= xMax ? (
          <line key={i} x1={sx(k)} y1={padT} x2={sx(k)} y2={plotBottom} stroke="var(--line-2)" strokeWidth="1" />
        ) : null
      ))}

      {/* breakevens */}
      {data.breakevens?.map((be, i) => (
        be >= xMin && be <= xMax ? (
          <line key={i} x1={sx(be)} y1={padT} x2={sx(be)} y2={plotBottom} stroke="#eab308" strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />
        ) : null
      ))}

      {/* payoff line */}
      <path d={linePath} fill="none" stroke="#38bdf8" strokeWidth="2.25" />

      {/* spot marker */}
      {data.spot >= xMin && data.spot <= xMax && (
        <>
          <line x1={sx(data.spot)} y1={padT - 4} x2={sx(data.spot)} y2={plotBottom} stroke="var(--ink)" strokeWidth="1.25" strokeDasharray="1 0" opacity="0.9" />
          <text x={sx(data.spot)} y={padT - 8} textAnchor="middle" fontSize="9.5" fill="var(--ink)" fontWeight="600">Spot {Math.round(data.spot)}</text>
        </>
      )}

      {/* probability band (bottom strip) */}
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--line-2)" strokeWidth="1" />
      <path d={probArea} fill="#c084fc" opacity="0.14" />
      <path d={data.curve.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.spot)} ${sProb(p.density)}`).join(' ')}
        fill="none" stroke="#c084fc" strokeWidth="1.25" opacity="0.7" />
      <text x={padL - 8} y={H - padB - probBandH / 2 + 3} textAnchor="end" fontSize="8" fill="var(--purple)">prob.</text>

      {/* x labels — spot (white) and breakevens (amber), collision-avoided */}
      <text x={sx(data.spot)} y={H - padB + 15} textAnchor="middle" fontSize="9" fill="var(--ink)" fontWeight="600">{Math.round(data.spot)}</text>
      {beLabels.map((be, i) => (
        <text key={`be${i}`} x={sx(be)} y={H - padB + 15} textAnchor="middle" fontSize="8.5" fill="#eab308">BE {Math.round(be)}</text>
      ))}

      {/* hover readout */}
      {hover && (
        <g>
          <line x1={sx(hover.spot)} y1={padT} x2={sx(hover.spot)} y2={plotBottom} stroke="#38bdf8" strokeWidth="0.75" opacity="0.5" />
          <circle cx={sx(hover.spot)} cy={sy(hover.pnl)} r="3.5" fill="#38bdf8" stroke="var(--panel)" strokeWidth="1.5" />
          <g transform={`translate(${Math.min(sx(hover.spot) + 10, W - 116)}, ${Math.max(sy(hover.pnl) - 34, padT)})`}>
            <rect width="108" height="36" rx="4" fill="var(--panel-2)" stroke="var(--line-2)" />
            <text x="8" y="14" fontSize="9" fill="var(--muted)">NIFTY {Math.round(hover.spot)}</text>
            <text x="8" y="27" fontSize="10.5" fontWeight="600" fill={hover.pnl >= 0 ? '#4ade80' : '#f87171'}>P&L {fmtInr(hover.pnl)}</text>
          </g>
        </g>
      )}
    </svg>
  )
}

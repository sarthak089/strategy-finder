import HeroCurve from './HeroCurve'
import './landing.css'

const STRATEGIES = [
  'Bull Call Spread', 'Bear Call Spread', 'Bull Put Spread', 'Bear Put Spread',
  'Iron Condor', 'Iron Butterfly', 'Call Butterfly', 'Put Butterfly',
  'Broken-Wing Call Butterfly', 'Broken-Wing Put Butterfly',
]

const METHOD = [
  {
    k: '01', title: 'Live option chain',
    body: 'Every run pulls the current NIFTY option chain straight from NSE — spot, per-strike call and put premiums, implied volatility, and India VIX — with an automatic fallback source if the primary API is rate-limited.',
  },
  {
    k: '02', title: 'Black–Scholes pricing & Greeks',
    body: 'Each leg is priced with Black–Scholes on the live implied volatility and time to expiry. Per-leg deltas are aggregated into a net position delta so you can read a strategy’s directional exposure at a glance.',
  },
  {
    k: '03', title: 'Piecewise-linear payoff engine',
    body: 'Any multi-leg position is modelled as a set of linear payoff segments. Max profit and max loss come analytically from the segment vertices, and unbounded risk is detected from the wing slopes — no Monte-Carlo, no approximation.',
  },
  {
    k: '04', title: 'Probability of profit',
    body: 'POP is computed by integrating a volatility-scaled normal distribution of the underlying over exactly the price ranges where the position finishes in profit — the same model that drives the probability curve on every diagram.',
  },
  {
    k: '05', title: 'Combinatorial search',
    body: 'The engine enumerates every valid 2- and 4-leg combination across the strike ladder, prunes by wing-width and strike-gap constraints for tractability, then filters on your reward:risk, POP, max-loss and market-bias criteria.',
  },
]

export default function Landing({ onLaunch, theme, onToggleTheme }) {
  return (
    <div className="lp">
      {/* nav */}
      <header className="lp-nav">
        <div className="lp-brand">
          <span className="lp-brand-mark">⟋</span> Strategy Finder
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="theme-toggle" onClick={onToggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}>
            {theme === 'light' ? '☾' : '☀'}
          </button>
          <button className="lp-nav-cta" onClick={onLaunch}>Launch tool</button>
        </div>
      </header>

      {/* hero */}
      <section className="lp-hero">
        <div className="lp-hero-copy">
          <div className="lp-eyebrow">NIFTY options · multi-leg screener</div>
          <h1 className="lp-h1">
            Find the option strategy<br />that fits your view.
          </h1>
          <p className="lp-lede">
            Pick your constraints — reward, probability, risk, market bias — and the engine
            searches every spread, condor and butterfly on the live NIFTY chain, then draws the
            payoff for each one.
          </p>
          <div className="lp-hero-actions">
            <button className="lp-cta" onClick={onLaunch}>Open Strategy Finder →</button>
            <a className="lp-cta-ghost" href="#how">How it works</a>
          </div>
        </div>
        <div className="lp-hero-art">
          <HeroCurve />
          <div className="lp-hero-art-caption">
            <span><i className="dot dot-blue" /> Payoff at expiry</span>
            <span><i className="dot dot-amber" /> Breakeven</span>
            <span><i className="dot dot-purple" /> Probability</span>
          </div>
        </div>
      </section>

      {/* beginner intro */}
      <section className="lp-intro">
        <h2 className="lp-h2">New to options? Start here.</h2>
        <div className="lp-intro-grid">
          <div className="lp-card">
            <div className="lp-card-num">Set your view</div>
            <p>Think NIFTY will stay flat, drift up, or fall? Choose a bias — or leave it open — and set how much you’re willing to risk.</p>
          </div>
          <div className="lp-card">
            <div className="lp-card-num">Get matched</div>
            <p>The tool returns ready-made strategies that fit, each with its risk, reward, and the odds of finishing in profit spelled out.</p>
          </div>
          <div className="lp-card">
            <div className="lp-card-num">See the picture</div>
            <p>Open any result to see exactly where it makes and loses money across every closing price — no options background needed to read it.</p>
          </div>
        </div>
      </section>

      {/* methodology / how it works */}
      <section className="lp-how" id="how">
        <div className="lp-how-head">
          <h2 className="lp-h2">How it works</h2>
          <p className="lp-how-sub">
            The screener is a five-stage pipeline. Everything below runs on live market data
            at request time — nothing is pre-computed or cached.
          </p>
        </div>
        <ol className="lp-steps">
          {METHOD.map(m => (
            <li key={m.k} className="lp-step">
              <span className="lp-step-k">{m.k}</span>
              <div>
                <h3 className="lp-step-title">{m.title}</h3>
                <p className="lp-step-body">{m.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* strategies covered */}
      <section className="lp-strats">
        <h2 className="lp-h2">Ten strategies, one search</h2>
        <div className="lp-chips">
          {STRATEGIES.map(s => <span key={s} className="lp-chip">{s}</span>)}
        </div>
      </section>

      {/* footer CTA */}
      <section className="lp-final">
        <h2 className="lp-final-h">Ready to screen the chain?</h2>
        <button className="lp-cta lp-cta-lg" onClick={onLaunch}>Open Strategy Finder →</button>
        <p className="lp-disclaimer">
          For research and education only. Not investment advice. Options carry risk of loss.
        </p>
      </section>

      <footer className="lp-foot">
        <span>Strategy Finder</span>
        <span>Built with FastAPI · React · SciPy</span>
      </footer>
    </div>
  )
}

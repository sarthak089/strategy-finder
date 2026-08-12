import { useState } from 'react'
import StrategyFinder from './components/StrategyFinder/index.jsx'
import Landing from './components/Landing/index.jsx'
import useTheme from './hooks/useTheme.js'

export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'finder'
  const { theme, toggle } = useTheme()

  if (view === 'finder') {
    return <StrategyFinder theme={theme} onToggleTheme={toggle} onBack={() => setView('landing')} />
  }

  return (
    <Landing
      onLaunch={() => setView('finder')}
      theme={theme}
      onToggleTheme={toggle}
    />
  )
}

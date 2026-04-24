import { useState } from 'react'
import StrategyFinder from './components/StrategyFinder/index.jsx'

export default function App() {
  const [open, setOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-cyan-700 text-white rounded"
      >
        Open Strategy Finder
      </button>
      {open && <StrategyFinder onClose={() => setOpen(false)} />}
    </div>
  )
}
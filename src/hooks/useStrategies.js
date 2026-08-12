import { useState, useEffect } from 'react'
import { DEFAULT_FILTERS } from '../constants/filters'
import { fetchStrategies, fetchExpiries } from '../services/api'

export default function useStrategies() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expiries, setExpiries] = useState([])
  const [meta, setMeta] = useState(null)

  // true until the first expiries fetch succeeds; drives the "waking server" overlay
  const [expiriesLoading, setExpiriesLoading] = useState(true)
  // how many times we've retried — lets the UI escalate its message
  const [wakeAttempts, setWakeAttempts] = useState(0)

  useEffect(() => {
    let cancelled = false

    const loadExpiries = async () => {
      try {
        const data = await fetchExpiries()
        if (cancelled) return
        setExpiries(data)
        setFilters(prev => ({ ...prev, expiry: data[1] ?? data[0] }))
        setExpiriesLoading(false)
      } catch (err) {
        if (cancelled) return
        console.log('Expiries error, retrying in 3s:', err)
        setWakeAttempts(n => n + 1)
        setTimeout(loadExpiries, 3000)
      }
    }
    loadExpiries()

    return () => { cancelled = true }
  }, [])

  const handleChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS)
    setResults([])
    setError(null)
    setMeta(null)
  }

  const handleFind = async () => {
    setLoading(true)
    setError(null)
    try {
      const { strategies, meta: newMeta } = await fetchStrategies(filters)
      setResults(strategies)
      setMeta(newMeta)
    } catch (err) {
      console.log('Error:', err)
      setError('Failed to fetch strategies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return {
    filters,
    results,
    loading,
    error,
    expiries,
    meta,
    expiriesLoading,
    wakeAttempts,
    handleChange,
    handleReset,
    handleFind,
  }
}

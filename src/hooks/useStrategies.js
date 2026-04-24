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

  useEffect(() => {
  const loadExpiries = async () => {
    try {
      const data = await fetchExpiries()
      setExpiries(data)
      setFilters(prev => ({ ...prev, expiry: data[1] ?? data[0] }))
    } catch (err) {
      console.log('Expiries error, retrying in 3s:', err)
      setTimeout(loadExpiries, 3000)
    }
  }
  loadExpiries()
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
    handleChange,
    handleReset,
    handleFind,
  }
}

// import { useState } from 'react'
// import { DEFAULT_FILTERS } from '../constants/filters'
// import { fetchStrategies } from '../services/api'

// export default function useStrategies() {
//   const [filters, setFilters] = useState(DEFAULT_FILTERS)
//   const [results, setResults] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const handleChange = (field) => (e) => {
//     setFilters((prev) => ({ ...prev, [field]: e.target.value }))
//   }

//   const handleReset = () => {
//     setFilters(DEFAULT_FILTERS)
//     setResults([])
//     setError(null)
//   }

//   const handleFind = async () => {
//   setLoading(true)
//   setError(null)
//   try {
//     const data = await fetchStrategies(filters)
//     setResults(data)
//   } catch (err) {
//     console.log('Error:', err)
//     setError('Failed to fetch strategies. Please try again.')
//   } finally {
//     setLoading(false)
//   }
// }

//   return {
//     filters,
//     results,
//     loading,
//     error,
//     handleChange,
//     handleReset,
//     handleFind,
//   }
// }
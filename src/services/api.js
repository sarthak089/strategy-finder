// For local dev the backend runs at http://127.0.0.1:8000
// When you deploy, switch BASE_URL to your Render URL:
// const BASE_URL = 'https://strategy-backend-suc2.onrender.com'
const BASE_URL = 'https://strategy-backend-suc2.onrender.com'

export const fetchExpiries = async () => {
  const response = await fetch(`${BASE_URL}/expiries`)
  const data = await response.json()
  if (!data.success) throw new Error(data.error)
  return data.expiries
}

export const fetchPayoff = async (legs, filters) => {
  const params = new URLSearchParams({
    legs,
    expiry: filters.expiry,
    otm_range: filters.otmRange,
    itm_range: filters.itmRange,
  })
  const response = await fetch(`${BASE_URL}/payoff?${params}`)
  const data = await response.json()
  if (!data.success) throw new Error(data.error)
  return data.data
}

export const fetchStrategies = async (filters) => {
  const params = new URLSearchParams({
    expiry: filters.expiry,
    otm_range: filters.otmRange,
    itm_range: filters.itmRange,
    min_rr: filters.minRewardRatio,
    min_pop: filters.minPOP,
  })

  if (filters.maxLoss) params.append('max_loss', filters.maxLoss)
  if (filters.biasFilter && filters.biasFilter !== 'Any') params.append('bias', filters.biasFilter)
  if (filters.legCount && filters.legCount !== 'Up To 4') params.append('leg_count', filters.legCount)

  const response = await fetch(`${BASE_URL}/strategies?${params}`)
  const data = await response.json()

  if (!data.success) throw new Error(data.error)
  return {
    strategies: data.strategies,
    meta: { spot: data.spot, atm: data.atm, expiry: data.expiry, vix: data.vix }
  }
}

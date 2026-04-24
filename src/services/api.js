const BASE_URL = 'https://strategy-backend-l6pa.onrender.com'

export const fetchExpiries = async () => {
  const response = await fetch('https://strategy-backend-l6pa.onrender.com/expiries')
  const data = await response.json()
  if (!data.success) throw new Error(data.error)
  return data.expiries
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

// export const fetchExpiries = async () => {
//   const response = await fetch('http://127.0.0.1:8000/expiries')
//   const data = await response.json()
//   if (!data.success) throw new Error(data.error)
//   return data.expiries
// }

// export const fetchStrategies = async (filters) => {
//   const params = new URLSearchParams({
//     expiry: filters.expiry,
//     otm_range: filters.otmRange,
//     itm_range: filters.itmRange,
//     min_rr: filters.minRewardRatio,
//     min_pop: filters.minPOP,
//   })

//   if (filters.maxLoss) params.append('max_loss', filters.maxLoss)
//   if (filters.biasFilter && filters.biasFilter !== 'Any') params.append('bias', filters.biasFilter)

//   const response = await fetch(`http://127.0.0.1:8000/strategies?${params}`)
//   const data = await response.json()

//   if (!data.success) throw new Error(data.error)
//   return {
//     strategies: data.strategies,
//     meta: { spot: data.spot, atm: data.atm, expiry: data.expiry, vix: data.vix }
//   }
// }
// export const fetchExpiries = async () => {
//   const response = await fetch('http://127.0.0.1:8000/expiries')
//   const data = await response.json()
//   if (!data.success) throw new Error(data.error)
//   return data.expiries
// }
// export const fetchStrategies = async (filters) => {
//   const params = new URLSearchParams({
//     expiry: filters.expiry,
//     otm_range: filters.otmRange,
//     itm_range: filters.itmRange,
//     min_rr: filters.minRewardRatio,
//     min_pop: filters.minPOP,
//   })

//   const response = await fetch(`http://127.0.0.1:8000/strategies?${params}`)
//   const data = await response.json()

//   if (!data.success) throw new Error(data.error)
//   return { strategies: data.strategies, meta: { spot: data.spot, atm: data.atm, expiry: data.expiry, vix: data.vix } }
// }

// export const fetchStrategies = async (filters) => {
//   const params = new URLSearchParams({
//     expiry: filters.expiry,
//     otm_range: filters.otmRange,
//     itm_range: filters.itmRange,
//     min_rr: filters.minRewardRatio,
//     min_pop: filters.minPOP,
//   })

//   const response = await fetch(`http://127.0.0.1:8000/strategies?${params}`)
//   const data = await response.json()

//   if (!data.success) throw new Error(data.error)
//   return data.strategies
// }

//import axios from 'axios'

// const client = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// export const fetchStrategies = async (filters) => {
//   try {
//     const response = await client.post('/strategies', filters)
//     return response.data
//   } catch (error) {
//     console.error('Error fetching strategies:', error)
//     return []
//   }
// }

// export const fetchStrategies = async () => {
//   await new Promise(res => setTimeout(res, 1000))
//   return [
//     { strategy: 'Bull Call Spread', rr: '2.5', pop: 65, netCredit: '120', maxProfit: '3000', maxLoss: '1200', delta: '0.35', bias: 'Bullish' },
//     { strategy: 'Iron Condor', rr: '1.8', pop: 72, netCredit: '250', maxProfit: '2500', maxLoss: '1400', delta: '0.10', bias: 'Neutral' },
//     { strategy: 'Bear Put Spread', rr: '2.1', pop: 58, netCredit: '80', maxProfit: '2100', maxLoss: '1000', delta: '-0.40', bias: 'Bearish' },
//   ]
// }


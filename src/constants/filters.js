export const DEFAULT_FILTERS = {
  minRewardRatio: 1,
  minPOP: 40,
  maxLoss: '',
  expiry: '28-Apr-2026',
  otmRange: 5,
  itmRange: 2,
  legCount: 'Up To 4',
  biasFilter: 'Any',
}

export const LEG_COUNT_OPTIONS = ['Fix 2', 'Fix 3', 'Fix 4', 'Up To 3', 'Up To 4']

export const BIAS_OPTIONS = ['Any', 'Bullish', 'Bearish', 'Neutral']

export const TABLE_COLUMNS = [
  '#',
  'Strategy',
  'R:R',
  'POP',
  'Net Credit',
  'Max Profit',
  'Max Loss',
  'Delta',
  'Bias',
  'Action',
]
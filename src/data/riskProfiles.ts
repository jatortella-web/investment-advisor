// ─── Types ────────────────────────────────────────────────────────────────────

export type RiskProfileId =
  | 'conservative'
  | 'moderate'
  | 'aggressive'
  | 'very-aggressive'

export type AssetClassId =
  | 'bonds'
  | 'index-funds'
  | 'etfs'
  | 'stocks'
  | 'commodities'
  | 'crypto'

export interface AssetAllocation {
  assetClassId: AssetClassId
  weight: number // 0–100 (percentage)
}

export interface AssetClass {
  id: AssetClassId
  label: string
  description: string
  isHighRisk: boolean
  color: string        // Tailwind bg-* class used in charts
  textColor: string    // Tailwind text-* class
  borderColor: string  // Tailwind border-* class
}

export interface RiskProfile {
  id: RiskProfileId
  label: string
  tagline: string
  description: string
  expectedReturn: string
  volatility: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High'
  horizon: string
  riskLevel: 1 | 2 | 3 | 4   // 1 = safest, 4 = highest risk
  accentColor: string         // Tailwind color token
  allocations: AssetAllocation[]
  allowedAssets: AssetClassId[]
}

// ─── Asset Class Registry ─────────────────────────────────────────────────────

export const ASSET_CLASSES: Record<AssetClassId, AssetClass> = {
  bonds: {
    id: 'bonds',
    label: 'Bonds / Fixed Income',
    description: 'Government and corporate bonds providing steady, predictable income with low risk.',
    isHighRisk: false,
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-400',
  },
  'index-funds': {
    id: 'index-funds',
    label: 'Index Funds',
    description: 'Diversified funds tracking broad market indices like the S&P 500.',
    isHighRisk: false,
    color: 'bg-indigo-500',
    textColor: 'text-indigo-600',
    borderColor: 'border-indigo-400',
  },
  etfs: {
    id: 'etfs',
    label: 'ETFs',
    description: 'Exchange-Traded Funds offering low-cost exposure to various sectors and asset classes.',
    isHighRisk: false,
    color: 'bg-violet-500',
    textColor: 'text-violet-600',
    borderColor: 'border-violet-400',
  },
  stocks: {
    id: 'stocks',
    label: 'Stocks',
    description: 'Individual equities with higher growth potential and higher volatility.',
    isHighRisk: true,
    color: 'bg-amber-500',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-400',
  },
  commodities: {
    id: 'commodities',
    label: 'Commodities',
    description: 'Physical assets like gold, silver, and oil that hedge against inflation.',
    isHighRisk: false,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    borderColor: 'border-yellow-400',
  },
  crypto: {
    id: 'crypto',
    label: 'Cryptocurrencies',
    description: 'Digital assets with very high return potential and very high volatility.',
    isHighRisk: true,
    color: 'bg-orange-500',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-400',
  },
}

// ─── Risk Profile Definitions ─────────────────────────────────────────────────

export const RISK_PROFILES: Record<RiskProfileId, RiskProfile> = {
  conservative: {
    id: 'conservative',
    label: 'Conservative',
    tagline: 'Capital preservation first',
    description:
      'Prioritises protecting your capital. Suited for investors near retirement or with a short time horizon who cannot afford to lose principal.',
    expectedReturn: '3–5% p.a.',
    volatility: 'Very Low',
    horizon: '1–3 years',
    riskLevel: 1,
    accentColor: 'blue',
    // 70 / 30 Bonds–Index Funds split as required
    allocations: [
      { assetClassId: 'bonds',        weight: 70 },
      { assetClassId: 'index-funds',  weight: 20 },
      { assetClassId: 'etfs',         weight: 10 },
    ],
    allowedAssets: ['bonds', 'index-funds', 'etfs'],
  },

  moderate: {
    id: 'moderate',
    label: 'Moderate',
    tagline: 'Balanced growth and stability',
    description:
      'A balanced approach mixing growth assets with stable income instruments. Suitable for investors with a medium time horizon.',
    expectedReturn: '6–9% p.a.',
    volatility: 'Medium',
    horizon: '3–7 years',
    riskLevel: 2,
    accentColor: 'indigo',
    allocations: [
      { assetClassId: 'index-funds', weight: 35 },
      { assetClassId: 'etfs',        weight: 25 },
      { assetClassId: 'bonds',       weight: 20 },
      { assetClassId: 'commodities', weight: 15 },
      { assetClassId: 'stocks',      weight: 5  },
    ],
    allowedAssets: ['bonds', 'index-funds', 'etfs', 'commodities'],
  },

  aggressive: {
    id: 'aggressive',
    label: 'Aggressive',
    tagline: 'Growth over stability',
    description:
      'Focuses on capital growth with a higher tolerance for volatility. Best for investors with a long time horizon and comfort with market swings.',
    expectedReturn: '10–15% p.a.',
    volatility: 'High',
    horizon: '7–15 years',
    riskLevel: 3,
    accentColor: 'amber',
    allocations: [
      { assetClassId: 'stocks',       weight: 40 },
      { assetClassId: 'etfs',         weight: 25 },
      { assetClassId: 'index-funds',  weight: 20 },
      { assetClassId: 'commodities',  weight: 10 },
      { assetClassId: 'crypto',       weight: 5  },
    ],
    allowedAssets: ['index-funds', 'etfs', 'stocks', 'commodities', 'crypto'],
  },

  'very-aggressive': {
    id: 'very-aggressive',
    label: 'Very Aggressive',
    tagline: 'Maximum growth, maximum risk',
    description:
      'Maximises exposure to high-growth, high-volatility assets. Only suitable for experienced investors with a very long time horizon.',
    expectedReturn: '15–25%+ p.a.',
    volatility: 'Very High',
    horizon: '15+ years',
    riskLevel: 4,
    accentColor: 'orange',
    allocations: [
      { assetClassId: 'stocks',       weight: 40 },
      { assetClassId: 'crypto',       weight: 30 },
      { assetClassId: 'etfs',         weight: 20 },
      { assetClassId: 'commodities',  weight: 10 },
    ],
    allowedAssets: ['index-funds', 'etfs', 'stocks', 'commodities', 'crypto'],
  },
}

export const RISK_PROFILE_ORDER: RiskProfileId[] = [
  'conservative',
  'moderate',
  'aggressive',
  'very-aggressive',
]

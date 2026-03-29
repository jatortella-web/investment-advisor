// ─── Asset Types ──────────────────────────────────────────────────────────────

export type AssetKey = 'indexFunds' | 'etfs' | 'stocks' | 'commodities' | 'crypto'

export type RiskLevel =
  | 'conservative'
  | 'moderate'
  | 'aggressive'
  | 'very-aggressive'

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface Asset {
  key: AssetKey
  label: string
  description: string
  isHighRisk: boolean
  /** Hex colour used in SVG paths and canvas elements */
  hex: string
  /** Tailwind bg-* class for CSS-only elements (badges, legend dots) */
  tailwindBg: string
  tailwindText: string
  tailwindBorder: string
}

export interface Allocation {
  assetKey: AssetKey
  /** Portfolio weight expressed as a whole-number percentage (0–100) */
  weight: number
}

export interface RiskTheme {
  /** Tailwind gradient applied to the selected card header */
  gradient: string
  border: string
  darkBorder: string
  badge: string
  ring: string
}

export interface RiskProfile {
  id: RiskLevel
  label: string
  tagline: string
  description: string
  /** 1 = safest → 4 = highest risk */
  riskScore: 1 | 2 | 3 | 4
  expectedReturn: string
  volatility: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High'
  timeHorizon: string
  /** Ordered allocations; must sum to 100 */
  allocations: Allocation[]
  /** Asset keys that are visible for this profile */
  availableAssets: AssetKey[]
  theme: RiskTheme
}

export interface PortfolioAllocation extends Allocation {
  asset: Asset
}

// ─── Asset Registry ───────────────────────────────────────────────────────────

export const ASSETS: Record<AssetKey, Asset> = {
  indexFunds: {
    key: 'indexFunds',
    label: 'Index Funds',
    description: 'Broad-market passive funds tracking major indices (S&P 500, etc.).',
    isHighRisk: false,
    hex: '#6366f1',
    tailwindBg: 'bg-indigo-500',
    tailwindText: 'text-indigo-600 dark:text-indigo-400',
    tailwindBorder: 'border-indigo-400',
  },
  etfs: {
    key: 'etfs',
    label: 'ETFs',
    description: 'Exchange-Traded Funds offering low-cost, sector-diversified exposure.',
    isHighRisk: false,
    hex: '#8b5cf6',
    tailwindBg: 'bg-violet-500',
    tailwindText: 'text-violet-600 dark:text-violet-400',
    tailwindBorder: 'border-violet-400',
  },
  stocks: {
    key: 'stocks',
    label: 'Stocks',
    description: 'Individual equities with higher growth potential and higher volatility.',
    isHighRisk: true,
    hex: '#f59e0b',
    tailwindBg: 'bg-amber-500',
    tailwindText: 'text-amber-600 dark:text-amber-400',
    tailwindBorder: 'border-amber-400',
  },
  commodities: {
    key: 'commodities',
    label: 'Commodities',
    description: 'Physical assets (gold, silver, oil) that hedge against inflation.',
    isHighRisk: false,
    hex: '#eab308',
    tailwindBg: 'bg-yellow-500',
    tailwindText: 'text-yellow-600 dark:text-yellow-400',
    tailwindBorder: 'border-yellow-400',
  },
  crypto: {
    key: 'crypto',
    label: 'Cryptocurrencies',
    description: 'Digital assets with very high return potential and extreme volatility.',
    isHighRisk: true,
    hex: '#f97316',
    tailwindBg: 'bg-orange-500',
    tailwindText: 'text-orange-600 dark:text-orange-400',
    tailwindBorder: 'border-orange-400',
  },
}

// ─── Risk Profile Definitions ─────────────────────────────────────────────────

export const RISK_PROFILES: Record<RiskLevel, RiskProfile> = {
  conservative: {
    id: 'conservative',
    label: 'Conservative',
    tagline: 'Capital preservation first',
    description:
      'Prioritises protecting principal with stable, low-volatility instruments. ' +
      'Suited for short time horizons or investors unwilling to absorb drawdowns.',
    riskScore: 1,
    expectedReturn: '3–5% p.a.',
    volatility: 'Very Low',
    timeHorizon: '1–3 years',
    // 70 / 30 Index Funds – ETFs (no high-risk assets permitted)
    allocations: [
      { assetKey: 'indexFunds',  weight: 70 },
      { assetKey: 'etfs',        weight: 20 },
      { assetKey: 'commodities', weight: 10 },
    ],
    availableAssets: ['indexFunds', 'etfs', 'commodities'],
    theme: {
      gradient: 'from-blue-600 to-blue-500',
      border: 'border-blue-500',
      darkBorder: 'dark:border-blue-400',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      ring: 'ring-blue-400',
    },
  },

  moderate: {
    id: 'moderate',
    label: 'Moderate',
    tagline: 'Balanced growth and stability',
    description:
      'Blends growth and income assets to deliver steady long-term returns ' +
      'without extreme swings. Suitable for medium-term investors.',
    riskScore: 2,
    expectedReturn: '6–9% p.a.',
    volatility: 'Medium',
    timeHorizon: '3–7 years',
    allocations: [
      { assetKey: 'indexFunds',  weight: 40 },
      { assetKey: 'etfs',        weight: 30 },
      { assetKey: 'commodities', weight: 20 },
      { assetKey: 'stocks',      weight: 10 },
    ],
    availableAssets: ['indexFunds', 'etfs', 'commodities', 'stocks'],
    theme: {
      gradient: 'from-indigo-600 to-indigo-500',
      border: 'border-indigo-500',
      darkBorder: 'dark:border-indigo-400',
      badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
      ring: 'ring-indigo-400',
    },
  },

  aggressive: {
    id: 'aggressive',
    label: 'Aggressive',
    tagline: 'Growth over stability',
    description:
      'Concentrates on high-growth equities with a small crypto allocation. ' +
      'Requires tolerance for significant short-term volatility.',
    riskScore: 3,
    expectedReturn: '10–15% p.a.',
    volatility: 'High',
    timeHorizon: '7–15 years',
    allocations: [
      { assetKey: 'stocks',      weight: 45 },
      { assetKey: 'etfs',        weight: 25 },
      { assetKey: 'indexFunds',  weight: 15 },
      { assetKey: 'commodities', weight: 10 },
      { assetKey: 'crypto',      weight: 5  },
    ],
    availableAssets: ['indexFunds', 'etfs', 'stocks', 'commodities', 'crypto'],
    theme: {
      gradient: 'from-amber-600 to-amber-500',
      border: 'border-amber-500',
      darkBorder: 'dark:border-amber-400',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
      ring: 'ring-amber-400',
    },
  },

  'very-aggressive': {
    id: 'very-aggressive',
    label: 'Very Aggressive',
    tagline: 'Maximum growth, maximum risk',
    description:
      'Maximises exposure to equities and crypto. Only for experienced investors ' +
      'with a very long horizon who can withstand extreme drawdowns.',
    riskScore: 4,
    expectedReturn: '15–30%+ p.a.',
    volatility: 'Very High',
    timeHorizon: '15+ years',
    allocations: [
      { assetKey: 'stocks',      weight: 35 },
      { assetKey: 'crypto',      weight: 35 },
      { assetKey: 'etfs',        weight: 20 },
      { assetKey: 'commodities', weight: 10 },
    ],
    availableAssets: ['indexFunds', 'etfs', 'stocks', 'commodities', 'crypto'],
    theme: {
      gradient: 'from-orange-600 to-rose-500',
      border: 'border-orange-500',
      darkBorder: 'dark:border-orange-400',
      badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      ring: 'ring-orange-400',
    },
  },
}

export const RISK_LEVEL_ORDER: RiskLevel[] = [
  'conservative',
  'moderate',
  'aggressive',
  'very-aggressive',
]

// ─── Pure Logic Functions ─────────────────────────────────────────────────────

/** Returns full allocation objects with the resolved Asset metadata attached. */
export function resolveAllocations(profile: RiskProfile): PortfolioAllocation[] {
  return profile.allocations.map((a) => ({
    ...a,
    asset: ASSETS[a.assetKey],
  }))
}

/**
 * Re-normalises weights to 100 when only a subset of assets is selected.
 * Returns an empty array when no assets are selected.
 */
export function normaliseAllocations(
  profile: RiskProfile,
  selectedKeys: AssetKey[],
): PortfolioAllocation[] {
  const filtered = profile.allocations.filter((a) =>
    selectedKeys.includes(a.assetKey),
  )
  if (filtered.length === 0) return []

  const total = filtered.reduce((s, a) => s + a.weight, 0)
  return filtered.map((a) => ({
    assetKey: a.assetKey,
    weight: Math.round((a.weight / total) * 100),
    asset: ASSETS[a.assetKey],
  }))
}

/** Returns true only when the asset is permitted for the given profile. */
export function isAssetAvailable(key: AssetKey, profile: RiskProfile): boolean {
  return profile.availableAssets.includes(key)
}

/** Volatility badge Tailwind classes keyed by level. */
export const VOLATILITY_BADGE: Record<RiskProfile['volatility'], string> = {
  'Very Low': 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
  Low: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300',
  High: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
  'Very High': 'bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300',
}

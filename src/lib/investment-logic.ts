// ─── Asset Types ──────────────────────────────────────────────────────────────

export type AssetKey = 'indexFunds' | 'etfs' | 'stocks' | 'commodities' | 'crypto'

export type RiskLevel =
  | 'conservative'
  | 'moderate'
  | 'aggressive'
  | 'very-aggressive'

export type Volatility = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High'

// ─── Educational Disclaimer ───────────────────────────────────────────────────

export type DisclaimerContext = 'educational' | 'historical'

export interface DisclaimerNote {
  /** Describes the intended purpose of the data */
  context: DisclaimerContext
  /** Human-readable project name shown in the tooltip header */
  projectContext: string
  /** Full disclaimer text displayed to the user */
  text: string
}

export const EDUCATIONAL_DISCLAIMER = {
  context: 'educational',
  projectContext: 'DAM (Digital Asset Management) training project',
  text:
    'All tickers, funds, allocations, and return figures shown are historical ' +
    'examples used exclusively for educational purposes within a DAM project. ' +
    'They do not represent live prices, current buy/sell recommendations, or ' +
    'personalised financial advice. Past performance is not indicative of future ' +
    'results. Consult a licensed financial adviser before making any investment decision.',
} as const satisfies DisclaimerNote

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
  /** Real-world instruments recommended for this asset class within the profile */
  examples: string[]
}

export interface TopPick {
  ticker: string
  name: string
  assetKey: AssetKey
  /** One-line rationale shown on the asset card */
  note: string
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
  volatility: Volatility
  timeHorizon: string
  /** Ordered allocations; must sum to 100 */
  allocations: Allocation[]
  /** Asset keys that are visible for this profile */
  availableAssets: AssetKey[]
  /** 3–4 curated real-world instruments highlighted for this profile */
  topPicks: TopPick[]
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
    description: 'Low-cost passive funds tracking broad markets. e.g. VTSAX (Vanguard Total Stock Market), VFIAX (Vanguard 500 Index), FXAIX (Fidelity 500 Index).',
    isHighRisk: false,
    hex: '#6366f1',
    tailwindBg: 'bg-indigo-500',
    tailwindText: 'text-indigo-600 dark:text-indigo-400',
    tailwindBorder: 'border-indigo-400',
  },
  etfs: {
    key: 'etfs',
    label: 'ETFs',
    description: 'Exchange-Traded Funds for diversified, intraday-tradeable exposure. e.g. SPY (S&P 500), QQQ (Nasdaq-100), BND (Total Bond Market), VTI (Total Stock Market).',
    isHighRisk: false,
    hex: '#8b5cf6',
    tailwindBg: 'bg-violet-500',
    tailwindText: 'text-violet-600 dark:text-violet-400',
    tailwindBorder: 'border-violet-400',
  },
  stocks: {
    key: 'stocks',
    label: 'Stocks',
    description: 'Individual equities with higher growth potential and higher volatility. e.g. AAPL (Apple), MSFT (Microsoft), NVDA (Nvidia), GOOGL (Alphabet), AMZN (Amazon).',
    isHighRisk: true,
    hex: '#f59e0b',
    tailwindBg: 'bg-amber-500',
    tailwindText: 'text-amber-600 dark:text-amber-400',
    tailwindBorder: 'border-amber-400',
  },
  commodities: {
    key: 'commodities',
    label: 'Commodities',
    description: 'Hard-asset exposure that hedges inflation and currency risk. e.g. GLD (SPDR Gold Shares), IAU (iShares Gold Trust), SLV (iShares Silver Trust), USO (Oil Fund).',
    isHighRisk: false,
    hex: '#eab308',
    tailwindBg: 'bg-yellow-500',
    tailwindText: 'text-yellow-600 dark:text-yellow-400',
    tailwindBorder: 'border-yellow-400',
  },
  crypto: {
    key: 'crypto',
    label: 'Cryptocurrencies',
    description: 'Digital assets with very high return potential and extreme volatility. e.g. Bitcoin (BTC), Ethereum (ETH), Solana (SOL).',
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
      'Prioritises protecting principal with stable, low-volatility instruments such as ' +
      'VTSAX (Vanguard Total Stock Market), BND (Total Bond ETF), and GLD (SPDR Gold). ' +
      'Suited for short time horizons or investors unwilling to absorb drawdowns.',
    riskScore: 1,
    expectedReturn: '3–5% p.a.',
    volatility: 'Very Low',
    timeHorizon: '1–3 years',
    allocations: [
      { assetKey: 'indexFunds',  weight: 70, examples: ['VTSAX', 'VFIAX', 'FXAIX'] },
      { assetKey: 'etfs',        weight: 20, examples: ['BND', 'AGG', 'SCHZ']       },
      { assetKey: 'commodities', weight: 10, examples: ['GLD', 'IAU']               },
    ],
    availableAssets: ['indexFunds', 'etfs', 'commodities'],
    topPicks: [
      { ticker: 'VTSAX', name: 'Vanguard Total Stock Market Index', assetKey: 'indexFunds', note: 'Broadest US equity coverage at 0.04% expense ratio' },
      { ticker: 'BND',   name: 'Vanguard Total Bond Market ETF',   assetKey: 'etfs',        note: 'Stable fixed-income anchor across 10,000+ bonds' },
      { ticker: 'FXAIX', name: 'Fidelity 500 Index Fund',          assetKey: 'indexFunds',  note: 'S&P 500 tracker with a 0% expense ratio' },
      { ticker: 'GLD',   name: 'SPDR Gold Shares ETF',             assetKey: 'commodities', note: 'Physically-backed gold hedge against inflation' },
    ],
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
      'Blends growth and income assets for steady long-term returns without extreme swings. ' +
      'Core holdings include VTSAX (index), SPY / VTI (ETFs), GLD (gold hedge), ' +
      'and blue-chip stocks like AAPL and MSFT. Suitable for medium-term investors.',
    riskScore: 2,
    expectedReturn: '6–9% p.a.',
    volatility: 'Medium',
    timeHorizon: '3–7 years',
    allocations: [
      { assetKey: 'indexFunds',  weight: 40, examples: ['VTSAX', 'FXAIX']       },
      { assetKey: 'etfs',        weight: 30, examples: ['SPY', 'VTI', 'SCHB']   },
      { assetKey: 'commodities', weight: 20, examples: ['GLD', 'SLV']           },
      { assetKey: 'stocks',      weight: 10, examples: ['AAPL', 'MSFT', 'JNJ']  },
    ],
    availableAssets: ['indexFunds', 'etfs', 'commodities', 'stocks'],
    topPicks: [
      { ticker: 'VTSAX', name: 'Vanguard Total Stock Market Index', assetKey: 'indexFunds',  note: 'Core equity position with maximum US market diversification' },
      { ticker: 'SPY',   name: 'SPDR S&P 500 ETF Trust',           assetKey: 'etfs',         note: 'Most liquid ETF; tracks 500 large-cap US companies' },
      { ticker: 'GLD',   name: 'SPDR Gold Shares ETF',             assetKey: 'commodities',  note: 'Balances equity risk with a non-correlated hard asset' },
      { ticker: 'AAPL',  name: 'Apple Inc.',                       assetKey: 'stocks',       note: 'Mega-cap quality anchor with strong cash flows and buybacks' },
    ],
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
      'Concentrates on high-growth equities (NVDA, GOOGL, AMZN) and tech ETFs (QQQ, VGT) ' +
      'with a small Bitcoin/Ethereum allocation for asymmetric upside. ' +
      'Requires tolerance for significant short-term volatility.',
    riskScore: 3,
    expectedReturn: '10–15% p.a.',
    volatility: 'High',
    timeHorizon: '7–15 years',
    allocations: [
      { assetKey: 'stocks',      weight: 45, examples: ['NVDA', 'GOOGL', 'AMZN', 'AAPL']  },
      { assetKey: 'etfs',        weight: 25, examples: ['QQQ', 'VGT', 'SOXX']             },
      { assetKey: 'indexFunds',  weight: 15, examples: ['VTSAX']                          },
      { assetKey: 'commodities', weight: 10, examples: ['GLD', 'PDBC']                    },
      { assetKey: 'crypto',      weight: 5,  examples: ['BTC', 'ETH']                     },
    ],
    availableAssets: ['indexFunds', 'etfs', 'stocks', 'commodities', 'crypto'],
    topPicks: [
      { ticker: 'QQQ',   name: 'Invesco Nasdaq-100 ETF',  assetKey: 'etfs',    note: 'Top 100 non-financial Nasdaq stocks; tech and AI-heavy' },
      { ticker: 'NVDA',  name: 'Nvidia Corporation',      assetKey: 'stocks',  note: 'Dominant AI infrastructure play with GPU market leadership' },
      { ticker: 'GOOGL', name: 'Alphabet Inc.',           assetKey: 'stocks',  note: 'Diversified tech platform: search, cloud (GCP), and AI' },
      { ticker: 'BTC',   name: 'Bitcoin',                 assetKey: 'crypto',  note: 'Small satellite crypto allocation for asymmetric upside' },
    ],
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
      'Maximises exposure to high-conviction equities (TSLA, NVDA, META), ' +
      'crypto (BTC, ETH, SOL), and high-beta ETFs (QQQ, ARKK). ' +
      'Only for experienced investors with a very long horizon who can withstand extreme drawdowns.',
    riskScore: 4,
    expectedReturn: '15–30%+ p.a.',
    volatility: 'Very High',
    timeHorizon: '15+ years',
    allocations: [
      { assetKey: 'stocks',      weight: 35, examples: ['TSLA', 'NVDA', 'META', 'AMZN']  },
      { assetKey: 'crypto',      weight: 35, examples: ['BTC', 'ETH', 'SOL']             },
      { assetKey: 'etfs',        weight: 20, examples: ['QQQ', 'ARKK', 'VGT']           },
      { assetKey: 'commodities', weight: 10, examples: ['GLD', 'USO', 'SLV']            },
    ],
    availableAssets: ['indexFunds', 'etfs', 'stocks', 'commodities', 'crypto'],
    topPicks: [
      { ticker: 'NVDA', name: 'Nvidia Corporation',     assetKey: 'stocks', note: 'AI chip monopolist; central to every major AI infrastructure build-out' },
      { ticker: 'BTC',  name: 'Bitcoin',                assetKey: 'crypto', note: 'Largest crypto by market cap; now ETF-accessible (IBIT, FBTC)' },
      { ticker: 'TSLA', name: 'Tesla Inc.',             assetKey: 'stocks', note: 'High-beta growth across EVs, energy storage, and autonomous driving' },
      { ticker: 'QQQ',  name: 'Invesco Nasdaq-100 ETF', assetKey: 'etfs',  note: 'High-conviction tech concentration for maximum long-run growth exposure' },
    ],
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
    examples: a.examples,
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
    examples: a.examples,
    asset: ASSETS[a.assetKey],
  }))
}

/** Returns true only when the asset is permitted for the given profile. */
export function isAssetAvailable(key: AssetKey, profile: RiskProfile): boolean {
  return profile.availableAssets.includes(key)
}

/** Volatility badge Tailwind classes keyed by level. */
export const VOLATILITY_BADGE: Record<Volatility, string> = {
  'Very Low': 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
  Low: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300',
  High: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
  'Very High': 'bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300',
}

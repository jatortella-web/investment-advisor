'use client'

import { useState } from 'react'
import {
  ASSETS,
  RISK_PROFILES,
  VOLATILITY_BADGE,
  EDUCATIONAL_DISCLAIMER,
  normaliseAllocations,
  type AssetKey,
  type PortfolioAllocation,
  type RiskLevel,
  type TopPick,
} from '@/lib/investment-logic'
import InfoTooltip from '@/components/InfoTooltip'

// ─── SVG Donut Chart ──────────────────────────────────────────────────────────

const CX = 100
const CY = 100
const OUTER_R = 80
const INNER_R = 52

function polarToXY(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  }
}

function donutArcPath(startDeg: number, endDeg: number): string {
  // Avoid SVG degenerate path when a single segment fills 100%
  if (endDeg - startDeg >= 359.999) endDeg = startDeg + 359.999

  const o1 = polarToXY(startDeg, OUTER_R)
  const o2 = polarToXY(endDeg, OUTER_R)
  const i1 = polarToXY(endDeg, INNER_R)
  const i2 = polarToXY(startDeg, INNER_R)
  const large = endDeg - startDeg > 180 ? 1 : 0

  return [
    `M ${o1.x.toFixed(3)} ${o1.y.toFixed(3)}`,
    `A ${OUTER_R} ${OUTER_R} 0 ${large} 1 ${o2.x.toFixed(3)} ${o2.y.toFixed(3)}`,
    `L ${i1.x.toFixed(3)} ${i1.y.toFixed(3)}`,
    `A ${INNER_R} ${INNER_R} 0 ${large} 0 ${i2.x.toFixed(3)} ${i2.y.toFixed(3)}`,
    'Z',
  ].join(' ')
}

interface DonutChartProps {
  allocations: PortfolioAllocation[]
  profileLabel: string
}

function DonutChart({ allocations, profileLabel }: DonutChartProps) {
  const [hovered, setHovered] = useState<AssetKey | null>(null)

  let cumAngle = 0
  const segments = allocations.map((a) => {
    const startDeg = cumAngle
    const endDeg = cumAngle + (a.weight / 100) * 360
    cumAngle = endDeg
    return { ...a, startDeg, endDeg }
  })

  const hoveredAlloc = hovered ? allocations.find((a) => a.assetKey === hovered) : null

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 200 200"
        className="w-full max-w-[220px] drop-shadow-sm"
        aria-label={`Donut chart of ${profileLabel} portfolio allocation`}
        role="img"
      >
        {/* Background ring */}
        <circle
          cx={CX}
          cy={CY}
          r={(OUTER_R + INNER_R) / 2}
          fill="none"
          stroke="currentColor"
          strokeWidth={OUTER_R - INNER_R}
          className="text-slate-100 dark:text-slate-700"
          opacity={0.5}
        />

        {segments.map((seg) => (
          <path
            key={seg.assetKey}
            d={donutArcPath(seg.startDeg, seg.endDeg)}
            fill={seg.asset.hex}
            opacity={hovered && hovered !== seg.assetKey ? 0.3 : 1}
            className="cursor-pointer transition-opacity duration-200"
            onMouseEnter={() => setHovered(seg.assetKey)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(seg.assetKey)}
            onBlur={() => setHovered(null)}
            tabIndex={0}
            role="img"
            aria-label={`${seg.asset.label}: ${seg.weight}%`}
          >
            <title>{`${seg.asset.label}: ${seg.weight}%`}</title>
          </path>
        ))}

        {/* Centre label */}
        {hoveredAlloc ? (
          <>
            <text
              x={CX}
              y={CY - 8}
              textAnchor="middle"
              fontSize="22"
              fontWeight="700"
              fill={hoveredAlloc.asset.hex}
            >
              {hoveredAlloc.weight}%
            </text>
            <text
              x={CX}
              y={CY + 10}
              textAnchor="middle"
              fontSize="9"
              className="fill-slate-500 dark:fill-slate-300"
              fill="currentColor"
            >
              {hoveredAlloc.asset.label}
            </text>
          </>
        ) : (
          <>
            <text
              x={CX}
              y={CY - 6}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              className="fill-slate-700 dark:fill-slate-200"
              fill="currentColor"
            >
              {profileLabel}
            </text>
            <text
              x={CX}
              y={CY + 10}
              textAnchor="middle"
              fontSize="9"
              className="fill-slate-400 dark:fill-slate-500"
              fill="currentColor"
            >
              Hover to inspect
            </text>
          </>
        )}
      </svg>
    </div>
  )
}

// ─── Allocation Rows ──────────────────────────────────────────────────────────

function AllocationRow({ alloc }: { alloc: PortfolioAllocation }) {
  const { asset, weight } = alloc
  return (
    <div className="group">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-sm"
            style={{ backgroundColor: asset.hex }}
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {asset.label}
          </span>
          {asset.isHighRisk && (
            <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-semibold text-orange-600 dark:bg-orange-900/40 dark:text-orange-400">
              High Risk
            </span>
          )}
        </div>
        <span
          className="text-sm font-bold"
          style={{ color: asset.hex }}
        >
          {weight}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${weight}%`, backgroundColor: asset.hex }}
        />
      </div>

      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
        {asset.description}
      </p>

      {alloc.examples.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {alloc.examples.map((ticker) => (
            <span
              key={ticker}
              className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300"
            >
              {ticker}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Asset Toggle Checkboxes ──────────────────────────────────────────────────

interface AssetToggleProps {
  available: AssetKey[]
  selected: AssetKey[]
  onChange: (keys: AssetKey[]) => void
}

function AssetToggles({ available, selected, onChange }: AssetToggleProps) {
  function toggle(key: AssetKey) {
    onChange(
      selected.includes(key)
        ? selected.filter((k) => k !== key)
        : [...selected, key],
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {available.map((key) => {
        const asset = ASSETS[key]
        const checked = selected.includes(key)
        return (
          <button
            key={key}
            onClick={() => toggle(key)}
            className={`
              flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold
              transition-all duration-150
              ${
                checked
                  ? 'border-transparent text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }
            `}
            style={checked ? { backgroundColor: asset.hex } : {}}
            aria-pressed={checked}
          >
            <span
              className={`h-2 w-2 rounded-full ${checked ? 'bg-white/60' : ''}`}
              style={!checked ? { backgroundColor: asset.hex } : {}}
            />
            {asset.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Top Recommended Assets ───────────────────────────────────────────────────

const ASSET_KEY_LABEL: Record<AssetKey, string> = {
  indexFunds: 'Index Fund',
  etfs: 'ETF',
  stocks: 'Stock',
  commodities: 'Commodity',
  crypto: 'Crypto',
}

function TopPickCard({ pick }: { pick: TopPick }) {
  const asset = ASSETS[pick.assetKey]
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
      {/* Ticker + type badge */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="rounded-md px-2.5 py-1 font-mono text-sm font-bold text-white"
          style={{ backgroundColor: asset.hex }}
        >
          {pick.ticker}
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ color: asset.hex, backgroundColor: `${asset.hex}18` }}
        >
          {ASSET_KEY_LABEL[pick.assetKey]}
        </span>
      </div>

      {/* Name */}
      <p className="text-sm font-semibold leading-tight text-slate-800 dark:text-slate-100">
        {pick.name}
      </p>

      {/* Rationale */}
      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        {pick.note}
      </p>
    </div>
  )
}

function TopRecommendedAssets({ picks }: { picks: TopPick[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
          Top Recommended Assets
        </h4>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-400">
          {picks.length} picks
        </span>
        <InfoTooltip note={EDUCATIONAL_DISCLAIMER} direction="bottom" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {picks.map((pick) => (
          <TopPickCard key={pick.ticker} pick={pick} />
        ))}
      </div>
    </div>
  )
}

// ─── Returns Calculator ───────────────────────────────────────────────────────

/** Extracts the numeric midpoint from strings like "6–9% p.a." or "15–30%+ p.a." */
function parseMidpointRate(expectedReturn: string): number {
  const nums = (expectedReturn.match(/\d+(?:\.\d+)?/g) ?? []).map(Number)
  if (nums.length === 0) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length / 100
}

function compoundValue(principal: number, rate: number, years: number): number {
  return principal * Math.pow(1 + rate, years)
}

function formatEUR(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}

const FORECAST_YEARS = [1, 5, 10] as const

interface ReturnsCalculatorProps {
  expectedReturn: string
}

function ReturnsCalculator({ expectedReturn }: ReturnsCalculatorProps) {
  const [principal, setPrincipal] = useState('')

  const rate = parseMidpointRate(expectedReturn)
  const p = parseFloat(principal)
  const hasValue = principal !== '' && !isNaN(p) && p > 0

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
          Returns Calculator
        </h4>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-400">
          {expectedReturn}
        </span>
      </div>

      {/* Amount input */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative w-56">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-semibold text-slate-400">
            €
          </span>
          <input
            type="number"
            min={0}
            step={100}
            placeholder="10 000"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="
              w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-4
              text-sm font-semibold text-slate-800 shadow-sm
              placeholder:text-slate-300
              focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
              dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100
              dark:placeholder:text-slate-600 dark:focus:ring-indigo-500
            "
          />
        </div>
        {hasValue && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            @ {(rate * 100).toFixed(1)}% midpoint annual rate
          </p>
        )}
      </div>

      {/* Forecast cards */}
      <div className="grid grid-cols-3 gap-3">
        {FORECAST_YEARS.map((years) => {
          const value = hasValue ? compoundValue(p, rate, years) : null
          const gain = value !== null ? value - p : null
          return (
            <div
              key={years}
              className="flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {years} {years === 1 ? 'year' : 'years'}
              </p>
              {value !== null ? (
                <>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {formatEUR(value)}
                  </p>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    +{formatEUR(gain!)}
                  </p>
                </>
              ) : (
                <p className="text-base font-bold text-slate-300 dark:text-slate-600">—</p>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
        A&nbsp;=&nbsp;P(1&nbsp;+&nbsp;r)ⁿ at the midpoint rate. Illustrative only — actual returns will vary.
      </p>
    </div>
  )
}

// ─── InvestmentDashboard ──────────────────────────────────────────────────────

interface Props {
  profileId: RiskLevel
}

export default function InvestmentDashboard({ profileId }: Props) {
  const profile = RISK_PROFILES[profileId]
  const [selectedAssets, setSelectedAssets] = useState<AssetKey[]>(
    profile.availableAssets,
  )

  // Re-seed when profile changes externally
  // (parent will remount this component by keying on profileId)
  const allocations = normaliseAllocations(profile, selectedAssets)

  return (
    <div className="flex flex-col gap-8">
      {/* Profile header */}
      <div
        className={`
          flex flex-wrap items-center justify-between gap-4 rounded-2xl
          bg-gradient-to-r ${profile.theme.gradient} p-5 text-white shadow
        `}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Active Profile
          </p>
          <h3 className="text-2xl font-bold">{profile.label}</h3>
          <p className="text-sm text-white/80">{profile.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-right">
          <div>
            <p className="text-xs text-white/60">Expected Return</p>
            <p className="font-semibold">{profile.expectedReturn}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Time Horizon</p>
            <p className="font-semibold">{profile.timeHorizon}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Volatility</p>
            <span
              className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${VOLATILITY_BADGE[profile.volatility]}`}
            >
              {profile.volatility}
            </span>
          </div>
        </div>
      </div>

      {/* Asset filter toggles */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Customise — toggle asset classes
        </p>
        <AssetToggles
          available={profile.availableAssets}
          selected={selectedAssets}
          onChange={setSelectedAssets}
        />
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          High-risk assets (Stocks, Crypto) are only available for Aggressive profiles.
          Weights auto-normalise to 100% when you deselect an asset.
        </p>
      </div>

      {allocations.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <span className="mb-2 text-4xl">📊</span>
          <p className="font-semibold text-slate-500 dark:text-slate-400">
            Select at least one asset class above
          </p>
        </div>
      ) : (
        /* Two-column layout: chart + breakdown */
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr]">
          {/* Donut chart */}
          <div className="flex justify-center md:justify-start">
            <DonutChart
              allocations={allocations}
              profileLabel={profile.label}
            />
          </div>

          {/* Allocation breakdown rows */}
          <div className="flex flex-col justify-center gap-5">
            {allocations
              .slice()
              .sort((a, b) => b.weight - a.weight)
              .map((alloc) => (
                <AllocationRow key={alloc.assetKey} alloc={alloc} />
              ))}
          </div>
        </div>
      )}

      {/* Returns Calculator */}
      <ReturnsCalculator expectedReturn={profile.expectedReturn} />

      {/* Divider */}
      <hr className="border-slate-100 dark:border-slate-700" />

      {/* Top Recommended Assets */}
      <TopRecommendedAssets picks={profile.topPicks} />
    </div>
  )
}

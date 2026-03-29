'use client'

import { type RiskProfileId, type AssetClassId } from '@/data/riskProfiles'
import {
  calculatePortfolioAllocations,
  getProfileById,
  validateSelection,
  volatilityBadgeClass,
} from '@/lib/investmentLogic'
import AssetAllocationChart from './AssetAllocationChart'

interface Props {
  profileId: RiskProfileId | null
  selectedAssets: AssetClassId[]
}

export default function PortfolioSummary({ profileId, selectedAssets }: Props) {
  const validation = validateSelection(profileId, selectedAssets)

  if (!profileId) {
    return (
      <Placeholder
        icon="🔒"
        title="No profile selected"
        body="Complete Steps 1 and 2 above to generate your personalised portfolio allocation."
      />
    )
  }

  if (selectedAssets.length === 0) {
    return (
      <Placeholder
        icon="📋"
        title="No investment types selected"
        body="Select at least one investment type in Step 2 to see your portfolio breakdown."
      />
    )
  }

  const profile = getProfileById(profileId)
  const allocations = calculatePortfolioAllocations(profileId, selectedAssets)

  return (
    <section>
      <h2 className="mb-1 text-xl font-semibold text-slate-800">
        Step 3 — Your Portfolio Summary
      </h2>
      <p className="mb-6 text-sm text-slate-500">
        Weights are normalised to 100% across your selected asset classes.
      </p>

      {/* Validation errors */}
      {!validation.valid && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="mb-1 text-sm font-semibold text-red-700">
            Please fix the following:
          </p>
          <ul className="list-inside list-disc space-y-1">
            {validation.errors.map((e) => (
              <li key={e} className="text-sm text-red-600">{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Profile banner */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 p-4">
        <div className="flex-1">
          <p className="text-xs text-slate-400">Risk Profile</p>
          <p className="text-lg font-bold text-slate-800">{profile.label}</p>
          <p className="text-sm text-slate-500">{profile.tagline}</p>
        </div>
        <div className="flex flex-col items-end gap-2 text-right">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${volatilityBadgeClass(profile.volatility)}`}
          >
            {profile.volatility} Volatility
          </span>
          <div>
            <p className="text-xs text-slate-400">Expected Return</p>
            <p className="font-semibold text-slate-700">{profile.expectedReturn}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Time Horizon</p>
            <p className="font-semibold text-slate-700">{profile.horizon}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      {allocations.length > 0 ? (
        <AssetAllocationChart allocations={allocations} />
      ) : (
        <p className="text-sm text-slate-500">
          None of your selected assets are available for this profile.
        </p>
      )}

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-slate-400">
        This is a suggested allocation for illustrative purposes only and does
        not constitute financial advice. Past performance is not indicative of
        future results. Consult a licensed financial adviser before investing.
      </p>
    </section>
  )
}

function Placeholder({
  icon,
  title,
  body,
}: {
  icon: string
  title: string
  body: string
}) {
  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold text-slate-800">
        Step 3 — Your Portfolio Summary
      </h2>
      <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center">
        <span className="mb-3 text-5xl">{icon}</span>
        <p className="mb-1 font-semibold text-slate-600">{title}</p>
        <p className="max-w-xs text-sm text-slate-400">{body}</p>
      </div>
    </section>
  )
}

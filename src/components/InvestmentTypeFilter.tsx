'use client'

import { type AssetClassId, type RiskProfileId } from '@/data/riskProfiles'
import { getAllowedAssetClasses } from '@/lib/investmentLogic'

interface Props {
  profileId: RiskProfileId
  selected: AssetClassId[]
  onChange: (selected: AssetClassId[]) => void
}

function AssetIcon({ id }: { id: AssetClassId }) {
  const icons: Record<AssetClassId, string> = {
    bonds: '🏛️',
    'index-funds': '📊',
    etfs: '📈',
    stocks: '🏢',
    commodities: '🥇',
    crypto: '₿',
  }
  return <span className="text-xl">{icons[id]}</span>
}

export default function InvestmentTypeFilter({ profileId, selected, onChange }: Props) {
  const allowed = getAllowedAssetClasses(profileId)

  function toggle(id: AssetClassId) {
    if (selected.includes(id)) {
      onChange(selected.filter((a) => a !== id))
    } else {
      onChange([...selected, id])
    }
  }

  function selectAll() {
    onChange(allowed.map((a) => a.id))
  }

  function clearAll() {
    onChange([])
  }

  return (
    <section>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">
          Step 2 — Choose Investment Types
        </h2>
        <div className="flex gap-2 text-xs">
          <button
            onClick={selectAll}
            className="font-medium text-indigo-600 hover:text-indigo-800"
          >
            Select all
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={clearAll}
            className="font-medium text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        </div>
      </div>

      <p className="mb-6 text-sm text-slate-500">
        Only asset classes compatible with your risk profile are shown. High-risk
        assets (Stocks, Crypto) are restricted to Aggressive profiles.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allowed.map((asset) => {
          const isChecked = selected.includes(asset.id)
          return (
            <label
              key={asset.id}
              className={`
                flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4
                transition-all duration-150
                ${isChecked
                  ? `${asset.borderColor} bg-white shadow-sm`
                  : 'border-slate-200 bg-white hover:border-slate-300'
                }
              `}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(asset.id)}
                className="sr-only"
              />

              {/* Custom checkbox */}
              <span
                className={`
                  mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded
                  border-2 transition-colors
                  ${isChecked ? `${asset.borderColor} bg-current` : 'border-slate-300 bg-white'}
                `}
              >
                {isChecked && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <AssetIcon id={asset.id} />
                  <span className="font-semibold text-slate-800">
                    {asset.label}
                  </span>
                  {asset.isHighRisk && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                      High Risk
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {asset.description}
                </p>
              </div>
            </label>
          )
        })}
      </div>

      {selected.length === 0 && (
        <p className="mt-4 text-sm text-amber-600">
          Select at least one investment type to generate your portfolio.
        </p>
      )}
    </section>
  )
}

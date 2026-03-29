'use client'

import { ASSET_CLASSES, type AssetAllocation } from '@/data/riskProfiles'

interface Props {
  allocations: AssetAllocation[]
}

export default function AssetAllocationChart({ allocations }: Props) {
  if (allocations.length === 0) return null

  // Sort descending so largest slice comes first
  const sorted = [...allocations].sort((a, b) => b.weight - a.weight)

  return (
    <div className="space-y-5">
      {/* Stacked bar */}
      <div>
        <div className="mb-2 flex h-8 w-full overflow-hidden rounded-full shadow-inner">
          {sorted.map((alloc, i) => {
            const asset = ASSET_CLASSES[alloc.assetClassId]
            return (
              <div
                key={alloc.assetClassId}
                style={{ width: `${alloc.weight}%` }}
                className={`
                  ${asset.color} h-full transition-all duration-500
                  ${i === 0 ? 'rounded-l-full' : ''}
                  ${i === sorted.length - 1 ? 'rounded-r-full' : ''}
                `}
                title={`${asset.label}: ${alloc.weight}%`}
              />
            )
          })}
        </div>
        {/* Tick labels */}
        <div className="flex justify-between text-xs text-slate-400">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Legend with individual bars */}
      <div className="space-y-3">
        {sorted.map((alloc) => {
          const asset = ASSET_CLASSES[alloc.assetClassId]
          return (
            <div key={alloc.assetClassId}>
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-sm ${asset.color}`} />
                  <span className="text-sm font-medium text-slate-700">
                    {asset.label}
                  </span>
                  {asset.isHighRisk && (
                    <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-xs text-orange-600">
                      High Risk
                    </span>
                  )}
                </div>
                <span className={`text-sm font-bold ${asset.textColor}`}>
                  {alloc.weight}%
                </span>
              </div>
              {/* Individual progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`${asset.color} h-full rounded-full transition-all duration-700`}
                  style={{ width: `${alloc.weight}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

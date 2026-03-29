'use client'

import { RISK_PROFILES, RISK_PROFILE_ORDER, type RiskProfileId } from '@/data/riskProfiles'
import { riskLevelColor, volatilityBadgeClass } from '@/lib/investmentLogic'

interface Props {
  selected: RiskProfileId | null
  onChange: (id: RiskProfileId) => void
}

const ACCENT: Record<RiskProfileId, string> = {
  conservative: 'border-blue-500 bg-blue-50',
  moderate: 'border-indigo-500 bg-indigo-50',
  aggressive: 'border-amber-500 bg-amber-50',
  'very-aggressive': 'border-orange-500 bg-orange-50',
}

const RING: Record<RiskProfileId, string> = {
  conservative: 'ring-blue-400',
  moderate: 'ring-indigo-400',
  aggressive: 'ring-amber-400',
  'very-aggressive': 'ring-orange-400',
}

const RISK_DOTS: Record<number, JSX.Element> = {
  1: <RiskDots filled={1} />,
  2: <RiskDots filled={2} />,
  3: <RiskDots filled={3} />,
  4: <RiskDots filled={4} />,
}

function RiskDots({ filled }: { filled: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`block h-2 w-2 rounded-full ${
            i <= filled ? 'bg-current' : 'bg-slate-200'
          }`}
        />
      ))}
    </div>
  )
}

export default function RiskProfileSelector({ selected, onChange }: Props) {
  return (
    <section>
      <h2 className="mb-1 text-xl font-semibold text-slate-800">
        Step 1 — Select Your Risk Profile
      </h2>
      <p className="mb-6 text-sm text-slate-500">
        Choose the profile that best describes your investment goals and comfort
        with market volatility.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {RISK_PROFILE_ORDER.map((id) => {
          const profile = RISK_PROFILES[id]
          const isSelected = selected === id

          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`
                group relative flex flex-col gap-3 rounded-2xl border-2 p-5 text-left
                transition-all duration-200 hover:shadow-md focus:outline-none
                ${isSelected
                  ? `${ACCENT[id]} ring-2 ring-offset-2 ${RING[id]} shadow-sm`
                  : 'border-slate-200 bg-white hover:border-slate-300'
                }
              `}
              aria-pressed={isSelected}
            >
              {/* Header row */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-lg font-bold text-slate-800">
                    {profile.label}
                  </span>
                  <p className="text-xs font-medium text-slate-500">
                    {profile.tagline}
                  </p>
                </div>

                {/* Selection indicator */}
                <span
                  className={`
                    flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2
                    ${isSelected
                      ? 'border-current bg-current'
                      : 'border-slate-300 bg-white'
                    }
                  `}
                >
                  {isSelected && (
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-slate-600">
                {profile.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                <Stat label="Expected Return" value={profile.expectedReturn} />
                <Stat label="Time Horizon" value={profile.horizon} />
                <div>
                  <p className="mb-1 text-xs text-slate-400">Risk Level</p>
                  <div className={riskLevelColor(profile.riskLevel)}>
                    {RISK_DOTS[profile.riskLevel]}
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs text-slate-400">Volatility</p>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${volatilityBadgeClass(profile.volatility)}`}
                  >
                    {profile.volatility}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-700">{value}</p>
    </div>
  )
}

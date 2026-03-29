'use client'

import {
  RISK_PROFILES,
  RISK_LEVEL_ORDER,
  VOLATILITY_BADGE,
  type RiskLevel,
  type RiskProfile,
} from '@/lib/investment-logic'

// ─── Sub-components ───────────────────────────────────────────────────────────

function RiskScoreDots({ score }: { score: RiskProfile['riskScore'] }) {
  return (
    <div className="flex gap-1" aria-label={`Risk score ${score} of 4`}>
      {([1, 2, 3, 4] as const).map((i) => (
        <span
          key={i}
          className={`block h-2 w-5 rounded-full transition-colors ${
            i <= score
              ? 'bg-current'
              : 'bg-slate-200 dark:bg-slate-600'
          }`}
        />
      ))}
    </div>
  )
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {value}
      </span>
    </div>
  )
}

// ─── Profile Card ─────────────────────────────────────────────────────────────

interface CardProps {
  profile: RiskProfile
  isSelected: boolean
  onSelect: () => void
}

function ProfileCard({ profile, isSelected, onSelect }: CardProps) {
  const { theme } = profile

  return (
    <button
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      className={`
        group relative flex flex-col overflow-hidden rounded-2xl border-2 text-left
        transition-all duration-200 focus:outline-none focus-visible:ring-2
        focus-visible:ring-offset-2 ${theme.ring}
        ${
          isSelected
            ? `${theme.border} ${theme.darkBorder} shadow-lg ring-2 ring-offset-2 ${theme.ring}`
            : 'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
        }
      `}
    >
      {/* Gradient header strip */}
      <div
        className={`
          bg-gradient-to-r ${theme.gradient}
          flex items-center justify-between px-5 py-3
        `}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            {['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive'][profile.riskScore - 1]}
          </p>
          <h3 className="text-lg font-bold text-white">{profile.tagline}</h3>
        </div>

        {/* Selection indicator */}
        <span
          className={`
            flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white
            transition-colors
            ${isSelected ? 'bg-white' : 'bg-white/20'}
          `}
        >
          {isSelected && (
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: 'currentColor' }}
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 bg-white p-5 dark:bg-slate-800">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {profile.description}
        </p>

        {/* Risk score + volatility badge */}
        <div className="flex items-center justify-between">
          <div className={`${theme.gradient.replace('from-', 'text-').split(' ')[0].replace('text-', 'text-')} text-amber-600`} style={{ color: undefined }}>
            <div className={`${profile.id === 'conservative' ? 'text-blue-500' : profile.id === 'moderate' ? 'text-indigo-500' : profile.id === 'aggressive' ? 'text-amber-500' : 'text-orange-500'}`}>
              <RiskScoreDots score={profile.riskScore} />
            </div>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${VOLATILITY_BADGE[profile.volatility]}`}
          >
            {profile.volatility} Volatility
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 dark:border-slate-700">
          <StatPill label="Expected Return" value={profile.expectedReturn} />
          <StatPill label="Time Horizon" value={profile.timeHorizon} />
        </div>

        {/* Asset tags */}
        <div className="flex flex-wrap gap-1.5">
          {profile.availableAssets.map((key) => (
            <span
              key={key}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400"
            >
              {key === 'indexFunds' ? 'Index Funds'
                : key === 'etfs' ? 'ETFs'
                : key === 'stocks' ? 'Stocks'
                : key === 'commodities' ? 'Commodities'
                : 'Crypto'}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}

// ─── RiskSelector ─────────────────────────────────────────────────────────────

interface Props {
  selected: RiskLevel | null
  onChange: (level: RiskLevel) => void
}

export default function RiskSelector({ selected, onChange }: Props) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Select Your Risk Profile
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Your profile determines which asset classes are available and how your
          portfolio is weighted. You must choose a profile before customising
          investment types.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Risk profile selection"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {RISK_LEVEL_ORDER.map((id) => (
          <ProfileCard
            key={id}
            profile={RISK_PROFILES[id]}
            isSelected={selected === id}
            onSelect={() => onChange(id)}
          />
        ))}
      </div>

      {!selected && (
        <p className="mt-4 flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          Please select a risk profile to continue.
        </p>
      )}
    </div>
  )
}

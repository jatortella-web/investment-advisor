'use client'

import { useState } from 'react'
import { type RiskLevel } from '@/lib/investment-logic'
import RiskSelector from '@/components/RiskSelector'
import InvestmentDashboard from '@/components/InvestmentDashboard'
import Chat from '@/components/Chat'

// ─── Step indicator ───────────────────────────────────────────────────────────

function Step({
  n,
  label,
  done,
  active,
}: {
  n: number
  label: string
  done: boolean
  active: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`
          flex h-7 w-7 shrink-0 items-center justify-center rounded-full
          text-sm font-bold transition-colors
          ${done
            ? 'bg-emerald-500 text-white'
            : active
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'}
        `}
      >
        {done ? (
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          n
        )}
      </span>
      <span
        className={`text-sm font-medium ${
          active || done
            ? 'text-slate-800 dark:text-slate-100'
            : 'text-slate-400 dark:text-slate-600'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

// ─── Disclaimer ───────────────────────────────────────────────────────────────

function FinancialDisclaimer() {
  return (
    <footer
      role="contentinfo"
      className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/30"
    >
      <div className="flex gap-3">
        <svg
          className="mt-0.5 h-5 w-5 shrink-0 text-amber-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <p className="mb-1 font-semibold text-amber-800 dark:text-amber-300">
            Financial Disclaimer
          </p>
          <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-400">
            The portfolio allocations and expected returns shown in this application are{' '}
            <strong>illustrative and educational only</strong>. They do not constitute
            financial advice, an investment recommendation, or a solicitation to buy or sell
            any security. Past performance is not indicative of future results. All
            investments carry risk, including the possible loss of principal. Cryptocurrency
            and high-risk assets may experience extreme price swings. Please consult a
            qualified financial adviser before making any investment decisions.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [profileId, setProfileId] = useState<RiskLevel | null>(null)

  const profileSelected = profileId !== null

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Investment Advisor Chat
      </h1>

      {/* Hero banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-8 py-12 shadow-xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
          Investment Advisor
        </p>
        <h1 className="mb-3 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          Build Your{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Ideal Portfolio
          </span>
        </h1>
        <p className="max-w-2xl text-base text-slate-400">
          Select a risk profile and customise your asset mix. Allocations update
          in real-time and are normalised to 100% automatically.
        </p>

        {/* Progress steps */}
        <div className="mt-8 flex flex-wrap gap-6">
          <Step n={1} label="Choose Risk Profile" done={profileSelected} active={!profileSelected} />
          <div className="flex items-center">
            <span className="w-8 border-t border-slate-600" />
          </div>
          <Step n={2} label="Customise Assets" done={false} active={profileSelected} />
          <div className="flex items-center">
            <span className="w-8 border-t border-slate-600" />
          </div>
          <Step n={3} label="View Allocation" done={false} active={profileSelected} />
        </div>
      </div>

      {/* Step 1 – Risk profile selector */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700 sm:p-8">
        <RiskSelector selected={profileId} onChange={setProfileId} />
      </section>

      {/* Step 2 + 3 – Dashboard (shown only after profile is chosen) */}
      {profileId ? (
        <section
          key={profileId}   /* remount to reset internal asset selection on profile change */
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700 sm:p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Portfolio Dashboard
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Toggle asset classes to see how your allocation changes in real-time.
              Hover or tap a donut segment to inspect its weight.
            </p>
          </div>
          <InvestmentDashboard profileId={profileId} />
        </section>
      ) : (
        /* Placeholder card when no profile is selected */
        <section className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <span className="mb-3 text-5xl">📊</span>
          <p className="font-semibold text-slate-500 dark:text-slate-400">
            Your portfolio dashboard will appear here
          </p>
          <p className="mt-1 max-w-xs text-sm text-slate-400 dark:text-slate-500">
            Select a risk profile above to get started.
          </p>
        </section>
      )}

      {/* Finance calculator chat */}
      <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <Chat />
      </section>

      {/* Financial disclaimer */}
      <FinancialDisclaimer />
    </div>
  )
}

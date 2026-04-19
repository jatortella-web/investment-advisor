'use client'

import { useState } from 'react'
import { type DisclaimerNote } from '@/lib/investment-logic'

interface InfoTooltipProps {
  note: DisclaimerNote
  /** Controls which side the tooltip panel opens toward. Defaults to 'top'. */
  direction?: 'top' | 'bottom'
}

export default function InfoTooltip({ note, direction = 'top' }: InfoTooltipProps) {
  const [visible, setVisible] = useState<boolean>(false)

  const panelPosition: string =
    direction === 'top'
      ? 'bottom-full left-0 mb-2'
      : 'top-full left-0 mt-2'

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label="Show educational disclaimer"
        aria-expanded={visible}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 bg-white text-[10px] font-bold leading-none text-slate-400 transition-colors hover:border-slate-400 hover:text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500 dark:hover:border-slate-400 dark:hover:text-slate-300"
      >
        i
      </button>

      {visible && (
        <span
          role="tooltip"
          className={`absolute ${panelPosition} z-50 w-72 rounded-xl border border-amber-200 bg-amber-50 p-3 shadow-lg dark:border-amber-800/60 dark:bg-amber-950/80`}
        >
          {/* Header */}
          <span className="mb-1 flex items-center gap-1.5">
            <svg
              className="h-3.5 w-3.5 shrink-0 text-amber-500"
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
            <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              {note.projectContext}
            </span>
          </span>

          {/* Body */}
          <span className="block text-xs leading-relaxed text-amber-800 dark:text-amber-300">
            {note.text}
          </span>
        </span>
      )}
    </span>
  )
}

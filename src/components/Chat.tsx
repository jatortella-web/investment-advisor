'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { calculateCompoundInterest, calculateRuleOf72 } from '@/utils/finance'

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'user' | 'assistant'
interface Message { id: number; role: Role; text: string }

// ─── Number extraction helpers ────────────────────────────────────────────────

/** Extracts the first percentage value (e.g. "7%", "7 percent"). */
function extractRate(text: string): number | undefined {
  const m = text.match(/([\d.]+)\s*(%|percent)/i)
  return m ? parseFloat(m[1]) : undefined
}

/**
 * Fallback rate extractor for Rule of 72 when the user omits the % sign
 * (e.g. "rule of 72 at 8"). Returns the first number that is not 72 itself
 * and falls in a plausible annual-rate range (0.1–50).
 */
function extractBareRate(text: string): number | undefined {
  for (const m of text.matchAll(/\b(\d+(?:\.\d+)?)\b/g)) {
    const v = parseFloat(m[1])
    if (!isNaN(v) && v !== 72 && v >= 0.1 && v <= 50) return v
  }
  return undefined
}

/** Extracts the number of years (e.g. "10 years", "10yr"). */
function extractYears(text: string): number | undefined {
  const m = text.match(/([\d.]+)\s*yr/i) ?? text.match(/([\d.]+)\s*year/i)
  return m ? parseFloat(m[1]) : undefined
}

/**
 * Extracts the principal investment amount.
 * Looks for a currency symbol prefix ($, €, £) or the word "invest" followed
 * by a number, to avoid confusing the principal with a rate or year count.
 */
function extractPrincipal(text: string): number | undefined {
  const m =
    text.match(/[$€£]\s*([\d,]+(?:\.\d+)?)/) ??
    text.match(/invest\s+([\d,]+(?:\.\d+)?)/i)
  if (!m) return undefined
  const v = parseFloat(m[1].replace(/,/g, ''))
  return isNaN(v) ? undefined : v
}

// ─── Assistant logic ──────────────────────────────────────────────────────────

/**
 * Interprets the user's free-text message, calls the relevant finance utility,
 * and returns a plain-text answer.
 */
function respond(input: string): string {
  console.log('[Chat] respond called with:', input)

  // ── Rule of 72 ──
  const matchesRule72 = /rule.{0,5}72|doubl(e|ing)|how long.{0,20}double/i.test(input)
  console.log('[Chat] Rule of 72 keyword match:', matchesRule72)

  if (matchesRule72) {
    // Accept "8%", "8 percent", or bare "8" (fallback) so users don't need the % sign
    const rate = extractRate(input) ?? extractBareRate(input)
    console.log('[Chat] Extracted rate:', rate)

    if (!rate || rate <= 0) {
      return 'Please include an annual return rate, e.g. "rule of 72 at 8%" or "how long to double at 6%"'
    }

    const years = calculateRuleOf72(rate)
    console.log('[Chat] calculateRuleOf72 result:', years)

    return (
      `At ${rate}% per year, your investment doubles in approximately ${years.toFixed(1)} years.\n` +
      `(Rule of 72: 72 ÷ ${rate} = ${years.toFixed(1)})`
    )
  }

  // ── Compound interest ──
  const matchesCompound = /compound|future value|how much.{0,20}(have|grow|worth)|will.{0,20}grow|invest/i.test(input)
  console.log('[Chat] Compound interest keyword match:', matchesCompound)

  if (matchesCompound) {
    const principal = extractPrincipal(input)
    const rate = extractRate(input)
    const years = extractYears(input)
    console.log('[Chat] principal:', principal, 'rate:', rate, 'years:', years)

    if (!principal || !rate || !years) {
      const missing: string[] = []
      if (!principal) missing.push('initial amount (prefix with $, e.g. $10,000)')
      if (!rate) missing.push('annual rate (e.g. 7%)')
      if (!years) missing.push('time horizon (e.g. 10 years)')
      return `I'm missing: ${missing.join('; ')}.\nTry: "If I invest $10,000 at 7% for 10 years, how much will I have?"`
    }

    const future = calculateCompoundInterest(principal, rate / 100, years)
    const gain = future - principal
    const fmt = (n: number) =>
      n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    console.log('[Chat] calculateCompoundInterest result:', future)

    return (
      `$${principal.toLocaleString()} at ${rate}% for ${years} years → $${fmt(future)}\n` +
      `Gain: $${fmt(gain)} (${((gain / principal) * 100).toFixed(1)}% total return)`
    )
  }

  console.log('[Chat] No intent matched — returning help message')
  return (
    'I can calculate:\n' +
    '• Compound interest — e.g. "If I invest $10,000 at 7% for 10 years, how much will I have?"\n' +
    '• Rule of 72 — e.g. "How long to double my money at 8%?"'
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

const WELCOME: Message = {
  id: 0,
  role: 'assistant',
  text:
    'Hi! I can calculate:\n' +
    '• Compound interest — e.g. "If I invest $10,000 at 7% for 10 years, how much will I have?"\n' +
    '• Rule of 72 — e.g. "How long to double my money at 8%?"',
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send() {
    const text = input.trim()
    if (!text) return

    const userMsg: Message = { id: Date.now(), role: 'user', text }
    const replyMsg: Message = { id: Date.now() + 1, role: 'assistant', text: respond(text) }

    setMessages(prev => [...prev, userMsg, replyMsg])
    setInput('')
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-3 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-white">Finance Calculator</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Compound interest &amp; Rule of 72
        </p>
      </div>

      {/* Message list */}
      <div
        className="flex flex-col gap-3 overflow-y-auto p-5"
        style={{ minHeight: '220px', maxHeight: '340px' }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-tr-sm bg-indigo-600 text-white'
                  : 'rounded-tl-sm bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask a finance question…"
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { calculateCompoundInterest, calculateRuleOf72 } from '@/utils/finance'

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'user' | 'assistant'
type Intent = 'ruleOf72' | 'compoundInterest' | null
interface Message { id: number; role: Role; text: string }
interface LocalResult { text: string; intent: Intent }

// ─── Number extraction helpers ────────────────────────────────────────────────

function containsNumber(text: string): boolean {
  return /\d/.test(text)
}

function extractRate(text: string): number | undefined {
  const m = text.match(/([\d.]+)\s*(%|percent)/i)
  return m ? parseFloat(m[1]) : undefined
}

function extractBareRate(text: string): number | undefined {
  for (const m of text.matchAll(/\b(\d+(?:\.\d+)?)\b/g)) {
    const v = parseFloat(m[1])
    if (!isNaN(v) && v !== 72 && v >= 0.1 && v <= 50) return v
  }
  return undefined
}

function extractYears(text: string): number | undefined {
  const m = text.match(/([\d.]+)\s*yr/i) ?? text.match(/([\d.]+)\s*year/i)
  return m ? parseFloat(m[1]) : undefined
}

function extractPrincipal(text: string): number | undefined {
  const m =
    text.match(/[$€£]\s*([\d,]+(?:\.\d+)?)/) ??
    text.match(/invest\s+([\d,]+(?:\.\d+)?)/i)
  if (!m) return undefined
  const v = parseFloat(m[1].replace(/,/g, ''))
  return isNaN(v) ? undefined : v
}

// ─── Local intent processing ──────────────────────────────────────────────────

function processLocally(input: string, lastIntent: Intent): LocalResult | null {
  const lower = input.toLowerCase()

  // ── Rule of 72 (explicit keywords) ──
  const matchesRule72 =
    lower.includes('72') && (lower.includes('rule') || lower.includes('regla'))

  if (matchesRule72) {
    const rate = extractRate(input) ?? extractBareRate(input)
    if (!rate || rate <= 0) {
      return {
        text: 'Please include an annual return rate, e.g. "rule of 72 at 8%" or "how long to double at 6%"',
        intent: null,
      }
    }
    const years = calculateRuleOf72(rate)
    return {
      text:
        `At ${rate}% per year, your investment doubles in approximately ${years.toFixed(1)} years.\n` +
        `(Rule of 72: 72 ÷ ${rate} = ${years.toFixed(1)})`,
      intent: 'ruleOf72',
    }
  }

  // ── Contextual follow-up for Rule of 72 ──
  if (lastIntent === 'ruleOf72' && containsNumber(input)) {
    const rate = extractRate(input) ?? extractBareRate(input)
    if (rate && rate > 0) {
      const years = calculateRuleOf72(rate)
      return {
        text:
          `At ${rate}% per year, your investment doubles in approximately ${years.toFixed(1)} years.\n` +
          `(Rule of 72: 72 ÷ ${rate} = ${years.toFixed(1)})`,
        intent: 'ruleOf72',
      }
    }
  }

  // ── Compound interest ──
  const matchesCompound =
    /compound|future value|how much.{0,20}(have|grow|worth)|will.{0,20}grow|invest/i.test(input)

  if (matchesCompound) {
    const principal = extractPrincipal(input)
    const rate = extractRate(input)
    const years = extractYears(input)

    if (!principal || !rate || !years) {
      const missing: string[] = []
      if (!principal) missing.push('initial amount (prefix with $, e.g. $10,000)')
      if (!rate) missing.push('annual rate (e.g. 7%)')
      if (!years) missing.push('time horizon (e.g. 10 years)')
      return {
        text:
          `I'm missing: ${missing.join('; ')}.\n` +
          `Try: "If I invest $10,000 at 7% for 10 years, how much will I have?"`,
        intent: null,
      }
    }

    const future = calculateCompoundInterest(principal, rate / 100, years)
    const gain = future - principal
    const fmt = (n: number) =>
      n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return {
      text:
        `$${principal.toLocaleString()} at ${rate}% for ${years} years → $${fmt(future)}\n` +
        `Gain: $${fmt(gain)} (${((gain / principal) * 100).toFixed(1)}% total return)`,
      intent: 'compoundInterest',
    }
  }

  return null
}

// ─── Component ────────────────────────────────────────────────────────────────

const WELCOME: Message = {
  id: 0,
  role: 'assistant',
  text:
    'Hi! I can calculate:\n' +
    '• Compound interest — e.g. "If I invest $10,000 at 7% for 10 years, how much will I have?"\n' +
    '• Rule of 72 — e.g. "How long to double my money at 8%?"\n' +
    'You can also ask me anything about personal finance.',
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  // Ref so send() always reads the latest intent even if a closure captured an older render
  const lastIntentRef = useRef<Intent>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    console.log('[Chat] Current state lastIntent:', lastIntentRef.current)

    const userMsg: Message = { id: Date.now(), role: 'user', text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')

    // Try local processing first — read from ref to avoid stale closure
    const local = processLocally(text, lastIntentRef.current)
    if (local) {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: local.text },
      ])
      lastIntentRef.current = local.intent
      return
    }

    // AI fallback
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = (await res.json()) as { text: string }
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: data.text },
      ])
      lastIntentRef.current = null
    } catch {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: 'Something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
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
          Compound interest, Rule of 72 &amp; AI-powered finance Q&amp;A
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

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2 text-sm text-slate-500 dark:bg-slate-700 dark:text-slate-400">
              Thinking…
            </div>
          </div>
        )}

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
            disabled={loading}
            placeholder="Ask a finance question…"
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import DarkModeToggle from '@/components/DarkModeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Investment Advisor — Risk Profile Portfolio Builder',
  description:
    'Select your risk profile and preferred asset classes to get a personalised portfolio allocation recommendation.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script prevents flash-of-wrong-theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' ||
                    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`
          ${inter.className}
          bg-slate-100 text-slate-900
          dark:bg-slate-900 dark:text-slate-100
          transition-colors duration-200
        `}
      >
        {/* Navigation */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span className="font-bold text-slate-800 dark:text-white">
                InvestAdvisor
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 sm:inline">
                Illustrative Only — Not Financial Advice
              </span>
              <DarkModeToggle />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-10">{children}</main>

        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-600">
          Built with Next.js &amp; Tailwind CSS &bull; For educational purposes only
        </footer>
      </body>
    </html>
  )
}

# InvestAdvisor — Risk Profile Portfolio Builder

A Next.js 14 web application that maps investor risk profiles to suggested portfolio allocations across multiple asset classes.

> **Disclaimer:** This application is for illustrative and educational purposes only. It does not constitute financial advice. Consult a licensed financial adviser before making investment decisions.

---

## Features

| Feature | Details |
|---|---|
| **4 Risk Profiles** | Conservative · Moderate · Aggressive · Very Aggressive |
| **6 Asset Classes** | Bonds, Index Funds, ETFs, Stocks, Commodities, Crypto |
| **Smart Filtering** | High-risk assets (Stocks, Crypto) are only shown for Aggressive profiles |
| **Conservative 70/30 Rule** | Conservative profile allocates 70% Bonds / 30% Index Funds by default |
| **Input Validation** | Profile must be selected before asset types can be chosen |
| **Dynamic Weighting** | Weights re-normalise to 100% when the user picks a subset of assets |

---

## Project Structure

```
investment-advisor/
├── .github/workflows/deploy.yml   # CI/CD via GitHub Actions → Vercel
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with header/footer
│   │   ├── page.tsx               # Main orchestrator (state lives here)
│   │   └── globals.css            # Tailwind base styles
│   ├── components/
│   │   ├── RiskProfileSelector.tsx    # Step 1 – profile card grid
│   │   ├── InvestmentTypeFilter.tsx   # Step 2 – filtered asset checkboxes
│   │   ├── AssetAllocationChart.tsx   # Stacked bar + legend chart
│   │   └── PortfolioSummary.tsx       # Step 3 – combined result view
│   ├── data/
│   │   └── riskProfiles.ts        # All profile/asset data (single source of truth)
│   └── lib/
│       └── investmentLogic.ts     # Pure functions: filtering, weighting, validation
├── .env.example                   # Template for environment variables
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/investment-advisor.git
cd investment-advisor

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your API keys

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values. **Never commit `.env.local` to version control.**

| Variable | Service | Required |
|---|---|---|
| `NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY` | [Alpha Vantage](https://www.alphavantage.co/) — market data | Optional |
| `NEXT_PUBLIC_COINGECKO_API_KEY` | [CoinGecko](https://www.coingecko.com/en/api) — crypto prices | Optional |
| `POLYGON_API_KEY` | [Polygon.io](https://polygon.io/) — stocks/ETF data | Optional |
| `NEXT_PUBLIC_APP_URL` | Your deployment URL | Recommended |

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser bundle. **Never put secret keys in `NEXT_PUBLIC_` variables.**

---

## Deployment via GitHub Actions

The workflow at `.github/workflows/deploy.yml` performs:

1. **On every PR** → lint + build check.
2. **On push to `main`** → lint + build + deploy to Vercel.

### Setup Steps

#### 1. Fork / push this repo to GitHub

#### 2. Create a Vercel project

```bash
npm i -g vercel
vercel link   # follow the prompts
```

Retrieve your IDs:
```bash
cat .vercel/project.json
# { "orgId": "...", "projectId": "..." }
```

#### 3. Add GitHub repository secrets

Navigate to **Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|---|---|
| `VERCEL_TOKEN` | Vercel personal access token (Account → Settings → Tokens) |
| `ALPHA_VANTAGE_API_KEY` | Your Alpha Vantage key |
| `COINGECKO_API_KEY` | Your CoinGecko key |
| `POLYGON_API_KEY` | Your Polygon.io key |
| `APP_URL` | `https://your-app.vercel.app` |

#### 4. Push to `main`

The Actions workflow triggers automatically. View progress under the **Actions** tab.

---

## Architecture Decisions

### Data Layer (`src/data/riskProfiles.ts`)
Single source of truth for all profile definitions and asset class metadata. Editing allocations or adding a new profile requires changes only in this file.

### Logic Layer (`src/lib/investmentLogic.ts`)
Pure functions with no side effects:
- `getAllowedAssetClasses(profileId)` — returns the filtered asset list for a profile
- `calculatePortfolioAllocations(profileId, selectedAssets)` — normalises weights to 100%
- `validateSelection(profileId, selectedAssets)` — returns `{ valid, errors[] }`

### Component Layer
Each component has a single responsibility and receives only the data it needs via props. State is lifted to the page level (`page.tsx`).

---

## Extending the App

**Add a new risk profile:**
1. Add the profile to `RISK_PROFILES` in `src/data/riskProfiles.ts`
2. Add its id to `RISK_PROFILE_ORDER`
3. Add accent/ring colours to the maps in `RiskProfileSelector.tsx`

**Add a new asset class:**
1. Add it to `ASSET_CLASSES` in `src/data/riskProfiles.ts`
2. Include it in the `allowedAssets` arrays of relevant profiles
3. Add an icon mapping in `InvestmentTypeFilter.tsx`

**Connect a live price API:**
- Add your key to `.env.local` and to GitHub secrets
- Create a route handler at `src/app/api/prices/route.ts` that calls the API server-side using `POLYGON_API_KEY` (never exposed to the browser)

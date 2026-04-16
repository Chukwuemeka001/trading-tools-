# POIWatcher Backend

Python Flask backend for price monitoring, Telegram alerts, AI level suggestions, MT4 trade auto-logging, and Kraken/Binance exchange integration.
Works with the [Trade Journal app](https://chukwuemeka001.github.io/trading-tools-/trade-log.html).

## Features

- **Price Monitoring** — Checks BTCUSDT price every 60s via Kraken/CoinCap/CoinGecko
- **Telegram Alerts** — Fires alerts when price crosses your levels
- **AI Level Suggestions** — Claude analyzes candle data using your exact trading system framework
- **MT4 Auto-Logging** — Expert Advisor sends trade open/close/modify events to backend
- **Break Even Automation** — EA auto-moves SL to entry at configurable RR
- **Trade Execution Pipeline** — Approve trades from journal → backend risk-checks → MT4 EA auto-executes
- **Risk Engine** — Hard blocks (risk%, daily/weekly/monthly drawdown) and soft warnings (DXY conflicts, low confidence, no entry confirm)
- **Kraken Exchange Integration** — Auto-log trades, monitor positions, balance tracking
- **Binance Exchange Integration** — Same auto-logging features as Kraken (parallel option)
- **1:5 R:R Break Even Alerts** — Telegram notification when positions reach 1:5 R:R
- **Gist Storage** — Alerts and trades stored in the same Gist as your trade journal

## Setup Guide

### Step 1 — Create Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` and follow the prompts
3. Copy the **bot token** (looks like `123456:ABC-DEF...`)
4. Start a chat with your new bot (send it any message)
5. Get your **chat ID**:
   - Search for **@userinfobot** on Telegram
   - Send it any message — it replies with your chat ID
   - Or visit: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` after messaging your bot

### Step 2 — Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Copy it — you'll need it for the AI level suggestion feature

### Step 3 — Get Kraken API Key

1. Log into [kraken.com](https://www.kraken.com)
2. Go to **Settings → API** (or Security → API)
3. Click **Generate New Key**
4. Set these permissions:
   - Query Funds — **YES**
   - Query Open Orders & Trades — **YES**
   - Query Closed Orders & Trades — **YES**
   - Cancel/Close Orders — NO (not needed)
   - Create & Modify Orders — NO (not needed)
   - **NO withdrawal permissions needed**
5. Copy the **API Key** and **Private Key (Secret)**

### Step 4 — Get Binance API Key (Optional)

1. Log into [binance.com](https://www.binance.com) (global, not .ca)
2. Go to **API Management**
3. Create a new API key
4. Set permissions:
   - Read Info — **YES**
   - Enable Spot Trading — NO (read-only is sufficient)
   - Enable Withdrawals — **NO** (never enable this)
5. Copy the **API Key** and **Secret Key**

> **Note:** If Binance is geo-blocked in your region, the backend will auto-detect this and fall back to Kraken only with a warning logged.

### Step 5 — Deploy to Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Add these **environment variables** in Render dashboard:

   | Variable | Value |
   |----------|-------|
   | `TELEGRAM_BOT_TOKEN` | Your bot token from Step 1 |
   | `TELEGRAM_CHAT_ID` | Your chat ID from Step 1 |
   | `GITHUB_GIST_TOKEN` | Your GitHub PAT with `gist` scope |
   | `ANTHROPIC_API_KEY` | Your Anthropic API key from Step 2 |
   | `KRAKEN_API_KEY` | Your Kraken API key from Step 3 |
   | `KRAKEN_API_SECRET` | Your Kraken private key from Step 3 |
   | `BINANCE_API_KEY` | Your Binance API key from Step 4 (optional) |
   | `BINANCE_API_SECRET` | Your Binance secret from Step 4 (optional) |
   | `EXECUTION_API_KEY` | A long random secret (e.g. `openssl rand -hex 32`) — required for trade execution |
   | `GIST_ID` | `bc004e07ada6586fc4492590f80b182b` (already set) |
   | `ALLOWED_ORIGIN` | `https://chukwuemeka001.github.io` (already set) |

   > **EXECUTION_API_KEY** — Generate a random 64-char hex string and put the SAME value in three places: (a) Render env var, (b) journal app Settings → Profile → Execution API Key, (c) MT4 EA `ExecutionAPIKey` input. Without this, the trade execution pipeline is disabled.

5. Deploy — Render will auto-detect the `render.yaml` config

### Step 6 — Connect Journal App

1. Open your Trade Journal: https://chukwuemeka001.github.io/trading-tools-/trade-log.html
2. Go to the **Alerts** tab
3. Enter your Render backend URL (e.g. `https://poiwatcher-backend.onrender.com`)
4. Click **Save** — should show "Connected"
5. Exchange status indicator in the nav bar will show green when connected

### Step 7 — Install MT4 Expert Advisor

1. **Copy the EA file:**
   - Copy `POIWatcher.mq4` to your MT4 installation:
   - `C:\Users\[YOU]\AppData\Roaming\MetaQuotes\Terminal\[ID]\MQL4\Experts\`
   - Or in MT4: File → Open Data Folder → MQL4 → Experts

2. **Compile the EA:**
   - Open MetaEditor (press F4 in MT4)
   - File → Open → select `POIWatcher.mq4`
   - Press F7 (Compile) — should show "0 errors"
   - Close MetaEditor

3. **Allow WebRequest:**
   - In MT4: Tools → Options → Expert Advisors
   - Check "Allow automated trading"
   - Check "Allow WebRequest for listed URL"
   - Click "Add" and enter your backend URL:
     `https://poiwatcher-backend.onrender.com`
   - Click OK

4. **Attach to chart:**
   - In MT4: View → Navigator (Ctrl+N)
   - Expand "Expert Advisors"
   - Drag "POIWatcher" onto any chart
   - In the popup, go to **Inputs** tab:
     - `BackendURL` — your Render URL
     - `EnableAutoBreakEven` — true (recommended)
     - `BreakEvenRR` — 1.5 (move SL to entry at 1:1.5 RR)
     - `EnableAutoLogging` — true
     - `HeartbeatMinutes` — 5
     - `EnableAutoExecution` — **false** by default (turn ON only when you've tested everything)
     - `ExecutionAPIKey` — paste the same secret you set as `EXECUTION_API_KEY` on Render
     - `MaxSlippagePips` — 3 (slippage tolerance for market orders)
     - `ExecutionCheckSeconds` — 5 (poll backend every 5s for approved trades)
     - `MaxLotSize` — 1.0 (hard cap — EA refuses anything above this regardless of risk%)
   - Click OK

5. **Verify:**
   - Make sure the "AutoTrading" button in MT4 toolbar is ON (green)
   - You should see a smiley face on the chart
   - Check the Experts tab (Ctrl+E) for "POIWatcher EA initialized"
   - In your journal app, the MT4 indicator should turn green

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/alerts` | Get all alerts from Gist |
| `POST` | `/alerts` | Add new alert |
| `PUT` | `/alerts/:id` | Update/re-arm alert |
| `DELETE` | `/alerts/:id` | Remove alert |
| `GET` | `/price/:symbol` | Get current price |
| `POST` | `/ai-levels` | Get AI level suggestions |
| `POST` | `/mt4/trade-open` | Log new trade from MT4 EA |
| `POST` | `/mt4/trade-close` | Log trade close from MT4 EA |
| `POST` | `/mt4/trade-modify` | Log SL/TP modification |
| `POST` `/GET` | `/mt4/status` | EA heartbeat |
| `GET` | `/mt4/connection` | MT4 connection status |
| `GET` | `/mt4/open-trades` | Currently open MT4 trades |
| `GET` | `/kraken/account` | Kraken balance, orders, recent trades |
| `GET` | `/kraken/positions` | Kraken open positions with R:R |
| `GET` | `/binance/account` | Binance balance and open orders |
| `GET` | `/exchange/status` | Connection status for all exchanges |
| `POST` | `/api/trade/approve` | Approve a journal trade for execution (risk-checked) |
| `GET` | `/api/trade` | EA polls this — returns latest approved trade |
| `POST` | `/api/trade/executed` | EA confirms execution back to backend |
| `POST` | `/api/trade/cancelled` | Cancel a pending approved trade |
| `GET` | `/api/trade/status/<id>` | Status of a specific trade in the queue |
| `GET` | `/api/execution/queue` | Full pending execution queue |

> **Execution endpoints** (`/api/trade/*`, `/api/execution/*`) require `X-Execution-Key` header matching `EXECUTION_API_KEY`.

## Trade Execution Pipeline

End-to-end flow:

```
Journal app → POST /api/trade/approve → Risk Engine → Execution Queue
                                              │
                                              ▼
              ┌─── Telegram alert (approved/rejected) ───┐
              │                                          │
MT4 EA polls /api/trade every 5s ──→ Validates locally ──→ OrderSend()
              │                                          │
              └──→ POST /api/trade/executed ──→ Updates Gist + Telegram
```

**Risk Engine — Hard Blocks** (trade rejected):
- Missing/invalid SL or TP
- SL/TP on wrong side of entry for direction
- Risk % above configured limit (default 2%)
- Daily / weekly / monthly drawdown limit hit (configurable in journal Settings)

**Risk Engine — Soft Warnings** (trade still approved, warnings sent to Telegram):
- Risk above 1.5% but below hard limit
- Approaching drawdown limits (within 80%)
- Confidence score below 7
- DXY direction conflicts with trade direction
- No entry confirmation (MBOS / Trusted BOS) on the candle

**Execution Safety (EA-side):**
- `EnableAutoExecution = false` by default — must be opted in
- Refuses to execute if account equity < $100
- Refuses if `MaxLotSize` would be exceeded
- Refuses duplicate symbol (one trade per symbol max)
- Refuses if symbol unavailable on the broker
- Skips when market closed (spread = 0)
- Tracks executed trade IDs to prevent re-execution loops

## Architecture

```
MT4 Terminal ──→ POIWatcher EA ──→ Flask Backend ──→ Telegram Bot
       ▲           │                   │                    │
       │           │                   │                    └── Your phone
       │           ├── auto-log        │
       │           ├── auto-BE         │
       │           └── auto-EXECUTE ◄──┤◄── Risk Engine ◄──── Journal app
       │                               │       (validates approved trades)
Kraken/CoinCap ──→ Price Monitor ──────┤
                                       │
Kraken Private ──→ Trade Auto-Logger ──┤
Binance Private ─┘                     │
                                       ├── GitHub Gist (trades + alerts)
                                       │
                                       └── Claude API (AI levels)
```

- Backend polls Kraken every 60 seconds for price alerts
- Exchange sync loop checks Kraken/Binance every 60 seconds for new trades
- MT4 EA sends trade events and heartbeats to backend
- MT4 EA polls `/api/trade` every 5s when `EnableAutoExecution=true`
- Open positions monitored for 1:5 R:R break even alerts
- All data syncs to GitHub Gist for the journal app
- Telegram notifications for alerts, trade opens, closes, break even, and execution events

## Security

- All credentials stored as environment variables — never hardcoded
- API keys and secrets are **never** logged, exported, or included in Gist data
- API keys are **never** included in Claude AI exports or Telegram messages
- CORS restricted to GitHub Pages domain only
- MT4 EA communicates via HTTPS — no API keys needed for trade logging
- Broker API keys stay in browser cookies only — never sent to backend
- Gist token needs only `gist` scope
- Kraken requests signed with HMAC-SHA512 per Kraken documentation
- Binance requests signed with HMAC-SHA256 per Binance documentation
- If API returns auth error, exchange sync is disabled automatically (no repeated bad requests)
- Trade execution endpoints require `X-Execution-Key` header — compared with `hmac.compare_digest` (constant-time)
- Execution is opt-in: `EnableAutoExecution=false` by default in EA, hard `MaxLotSize` cap, equity floor, duplicate-symbol guard
- Risk engine enforces hard SL/TP validation, risk%, and drawdown limits before any trade is queued for execution

# NSE Quant Engine Sim (`NSE_1L_Aggressive_Trading_Master_Ledger_Nov2026`)

**Current Production Version:** `v17.0 OMNI-INSTITUTIONAL ACCELERATED` (Two-Way Deterministic Quant + Gemini 4 Argon Antigravity API + 3-Role Adversarial AI Council + Zerodha 2026 Statutory Friction Engine)  
**Starting Base Capital:** INR 1,00,000.00 | **Blended Institutional Buying Power:** INR 4,35,000.00 (4.35x)  
**Master Ledger Sheet:** `NSE_1L_Aggressive_Trading_Master_Ledger_Nov2026` (5 Synchronized Tabs)  
**Google Apps Script Target ID:** `1RNS5iWWta0WBAhA8uZDvUXNcVRuRK1cy` (`Code.gs`)

---

## 1. System Architecture & Separation of Powers

The engine operates as a cloud-autonomous institutional trading and statutory accounting terminal on the National Stock Exchange of India (NSE), divided into four distinct layers:

1. **Layer 1 — Deterministic 2-Day Microstructure & Order-Flow Scanner (`Code.gs` Pure JS Math):**
   - Live sweeps of **2,000+ NSE equities** via `https://scanner.tradingview.com/india/scan` filtering for `Market Cap >= 1,000 Cr`, `Turnover >= 15 Cr`, and `Relative Volume (RVOL) >= 1.25`.
   - Streams parallel 2-day (`range=2d`) 1-minute OHLCV candles from Yahoo Finance (`query1` / `query2`) with real-time Google Finance DOM fallback (`09:08–09:14 IST` Pre-Open IEP & quote scraper).
   - Computes `todayOpen`, `todayVwap`, `prevClose`, `prevVwap`, `pdh`, `pdl`, `orh5m`, `orh30m`, `orl15m`, `atr5m`, **Per-Bar Mean Volume Dry-Up Ratio (`vduRatio`)**, **Wick Buying Pressure (`WickBP`)**, **Order Flow Imbalance (OFI)**, **Point of Control (POC)**, and **Volume at Price (VAP)**.
   - Pre-computes mathematically locked setups (`entryTrigger`, odd-decimal `stopLoss`, `target1`, `target2`) and a `0–100` `quantScore` before any LLM is invoked.

2. **Layer 2 — Gemini 4 Argon & The 3-Role Adversarial AI Council:**
   - **Gemini 4 Argon (Tier 0 via Antigravity Interactions API):** Queries `https://generativelanguage.googleapis.com/v1beta/interactions` with `model: "gemini-4-argon"` and `agent: "antigravity-preview-09-2026"` for deep macro regimes, cross-sector rotation, and 48-hour news catalyst audits.
   - **10-Model Parachute Cascade:** If Argon preview limits are saturated, the engine automatically cascades through `gemini-3.8-flash` (high thinking) -> `3.6-flash` -> `2.5-flash` -> `2.0-flash` -> `1.5-flash` -> `flash-lite` models across a 5-key rotating pool.
   - **3 Adversarial Roles:**
     - `FLOW_DETECTIVE`: Validates institutional accumulation/distribution against 9 NSE Sector Indices.
     - `TRAP_PROSECUTOR`: Ruthlessly vetoes midday exhaustion spikes, liquidity sweeps, and upper-wick rejections (`WickBP < 0.50` on longs, `> 0.48` on shorts).
     - `CHIEF_RISK_JUDGE`: Enforces strict risk budgeting (`judgeConviction >= 78`, `quantScore >= 74`, max 1 new MTF + 1 new MIS per cycle).

3. **Layer 3 — 5-Pillar Accelerated Capital Allocation Engine:**
   - **Pillar 1 (4x MTF Swing Longs):** Allocates up to 65% capital into Stage-2 leaders (`Close > SMA20 > SMA50`), trailing with a 20-EMA chandelier.
   - **Pillar 2A (5x MIS Intraday Long Velocity):** Captures high-momentum breakout velocity on surging positive OFI above VWAP.
   - **Pillar 2B (5x MIS Intraday Short Velocity):** Exploits institutional breakdowns below VWAP on heavy selling OFI (`Mcap >= 10,000 Cr`).
   - **Pillar 4 (Overnight Statutory Cash Shield):** Squares off 100% of intraday shorts by 15:18 PM; parks idle margin into LiquidBees / TREPS (6.5% p.a.).
   - **Pillar 5 (70% T1 Free-Ride Shield & Runner Trailing):** Once a position reaches `>= 70%` of Target 1, it locks in partial profit, ratchets Stop-Loss to net breakeven + friction buffer, and lets the 30% runner trail.

4. **Layer 4 — Evolutionary Memory (FinMem) & Statutory Friction Auditor:**
   - Maintains a self-updating rulebook inside Google Sheets (`Evolutionary_Rulebook_Memory`), calibrating `atrMultiplier`, `maxChaseMisPct`, and `minRelVol` based on closed trade results and counterfactual shadow-book misses.
   - Zerodha 2026 audited friction engine: Real-time calculation of STT, NSE Exchange Turnover Charges, SEBI Turnover Fees, Stamp Duty, GST, and MTF interest.

---

## 2. Institutional Simulation & Multi-Regime Stress Test Results

| Metric | V1 (1x Cash Baseline) | V2 (5-Pillar Accel 1-Year) | V3 (5-Year Multi-Regime 2021–2026) |
| :--- | :--- | :--- | :--- |
| **Initial Capital** | INR 1,00,00,000 | INR 1,00,000 | INR 1,00,000 |
| **Ending Equity (Net)** | INR 1,07,29,069 | INR 10,84,997 | Calibrated Safe Plateau |
| **Net Annualized Return** | +11.00% | +985.00% | Multi-Regime Calibrated |
| **Max Drawdown (%)** | -6.85% | -7.04% | Calibrated Limit: -12.0% |
| **Sharpe Ratio** | 1.12 | 8.28 | Robust Plateau |
| **Trades Executed** | 141 | 711 | 3,758 audited trades |
| **Win Rate / Profit Factor**| 46.8% / 1.32 | 67.5% / 2.92 | Calibrated Guardrails Enforced |

---

## 3. Directory Layout

```
nse-quant-engine-sim/
├── Code.gs                               # Production v17.0 Master Apps Script (Unified 4,400+ lines)
├── src/
│   ├── Code.gs                           # Core modular deployment script
│   └── Code.js                           # JavaScript runtime mirror
├── versions/
│   ├── v16.0_omni_sovereign_apex.gs      # v16.0 release snapshot
│   ├── v17.0_omni_institutional_accelerated.gs # v17.0 release snapshot
│   └── v17.0_omni_institutional_accelerated.js # v17.0 JS release snapshot
├── simulations/
│   ├── NSE_Institutional_Quant_Simulation.ipynb    # V1 vs V2 1-Year Multi-Engine Jupyter Notebook
│   ├── NSE_Institutional_Quant_Simulation_v3.ipynb # V3 5-Year Multi-Regime Stress Test Notebook
│   ├── nse_v2_institutional_tearsheet.png          # V2 4-Panel Institutional Tear Sheet
│   ├── nse_v3_multi_regime_stress_sheet.png        # V3 5-Year Multi-Regime Stress Sheet
│   ├── nse_v2_accelerated_trades.csv               # 711 Verified V2 Trade Records
│   ├── nse_v3_multi_regime_trades.csv              # 3,758 Verified V3 Trade Records
│   └── run_extensive_quant_sim.ps1                 # High-velocity quant simulation runner
├── tools/
│   └── call_argon_agent.ps1              # Direct Gemini 4 Argon Antigravity API testing harness
├── CHANGELOG.md                          # Complete historical release log & architectural audit
└── README.md                             # Engine architecture & execution specification
```

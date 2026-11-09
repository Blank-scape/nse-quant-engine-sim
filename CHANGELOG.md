# Complete Evolution & Changelog — `nse-quant-engine-sim`

This document traces the complete architectural evolution of the **NSE ₹1,00,000 Autonomous Quant & Statutory Audit Simulation (`NSE_1L_Aggressive_Trading_Master_Ledger_Nov2026`)** across every version built in Gemini, Google Drive, Google Sheets Apps Script, and Google AI Studio from **November 1, 2026 to November 7, 2026**.

---

## Executive Version Matrix

| Version | Date (IST) | Codename | Core Architectural Changes, Bug Fixes & Upgrades |
| :--- | :--- | :--- | :--- |
| **v6.3** | 2026-11-01 | `Quant & Sheet Forensic Terminal` | Built initial Google AI Studio Applet & Apps Script generator; established 5-tab sheet architecture and Zerodha 2026 statutory friction engine. |
| **v6.4** | 2026-11-01 | `Ruthless Auditor & LockService` | Added `LockService` 1-minute candle loop (`LAST_BAR_<tradeId>`), mandatory `15:15 IST` MIS auto-square-off (`CLOSED_MIS_315PM`), `15:34 IST` EOD audit hook, 0-day MTF interest = `₹0`, and 50% T1 margin/loan reduction. |
| **v6.5 / v6.6** | 2026-11-01 | `Initial 6-Ticket Ledger Seed` | Seeded `LAURUSLABS`, `TRENT`, `NTPC` (4x MTF) and `DEEPAKNTR`, `TCS`, `BEL` (5x MIS) totaling 97.5% capital utilization (`₹97,492.80` margin). Audited by In-Sheet Gemini. |
| **v6.8** | 2026-11-01 | `Calibrated 5-Key & Omni-Audited` | Calibrated model pools to AI Studio 5-key dashboard (`gemini-3.8-flash`, `gemini-3.6-flash`, `gemini-3.5-flash-lite`); harmonized `Opportunity_Rotation_Matrix` active MIS rows with standby challengers (`BOROLTD`, `DIXON`). |
| **v9.1** | 2026-11-03 | `Single-Block Zero-Crash JSON` | Added hex escape `\x60` markdown fence stripper, `doGet`/`doPost` webhooks for Tampermonkey `v9.3`, `Cell M2` dropzone, `Portfolio_Dashboard!A23:I30` telemetry panel, and `[PULLBACK_BUY]` morning dip filter. |
| **v9.2** | 2026-11-03 | `T2 Runner & Anti-Churn Guard` | Fixed `ReferenceError: ru is not defined` in `ingestArgonJsonPacket`; added `PARTIAL_T1_BOOKED` runner execution (`CLOSED_T2_FULL` & `CLOSED_TRAIL_SL`); hard-guarded `EXIT_AT_CMP` (`liveR <= -0.35` & `< VWAP`); added 36-hour MIS loser cooldown; enforced `.35/.65` odd-decimal stop snapping. |
| **v9.4** | 2026-11-03 | `Auto-Purge & Date Serial Healer` | Built `purgeFalseTradesAndReconcileSheet_` to delete premature midday `CLOSED_MIS_315PM` & fake `dayHigh` T1/T2 rows; healed Google Sheets `46328/46329` date serials; reconciled backdated fills (`WELSPUNLIV`); enabled `thinkingLevel: "HIGH"`. |
| **v9.5** | 2026-11-03 | `Sleeve Cap Normalizer & Tape Sniper` | Healed `126.9%` margin over-allocation via `reconcileAndNormalizePortfolioCaps_`; built `buildCandleTapeSummary_` (5m structure + Volume POC); added `consultFlashTapeSniper_` 1m event check at Entry (no falling knives) and T1 (100% full runner). |
| **v10.0** | 2026-11-03 | `Institutional Quant & Factory Reset` | Added 1-click `factoryResetMasterEngine()` (resets to ₹1,00,000 while preserving `GEMINI_API_KEY`), per-key 19-RPD enforcer (`inspectAllKeyQuotas`), and `swingRotation` for stagnant MTF holdings. *(Note: suffered 9,082-byte truncation & lacked Flash-Lite fallback).* |
| **v10.5** | 2026-11-03 | `Enterprise Master (Dual-Tier)` | Restored untruncated master builders, added `FLASH_LITE_MODELS` (5,000 RPD parachute), and unified 1-minute trigger. *(Introduced 4 regressions caught in audit: phantom share scaling on active trades, `DD/MM/YYYY` 237-day false interest bug, `gemini-2.5-flash` priority inversion, and `0.3%` MTF brokerage).* |
| **v11.0** | 2026-11-03 | `Omni-Master Defense` | Fixed all 4 `v10.5` regressions: banned scaling down `ACTIVE_LIVE` share quantities (only throttles `PENDING_OPEN`), added `DD/MM/YYYY` regex parser, restored `gemini-3.8-flash` / `3.6-flash` priority, and fixed Zerodha MTF brokerage to `0.03%` (`0.0003`). |
| **v11.4** | 2026-11-05 | `Forward-Pass Deduplicator` | Separated Tier-0 (`AI_CALLS_T0_KEY_`) and Tier-1 (`AI_CALLS_T1_KEY_`) quota counters; added sub-second `thinkingLevel: "minimal"` for 1m Tape Sniper; implemented Forward-Pass Deduplication (preserving oldest filled trade) and rescued `CLOSED_CAP_RECONCILED` audit rows. |
| **v12.1** | 2026-11-05 | `OMNI-APEX (ABCD Playbooks)` | Introduced Lockless 2-Phase AI Commander, Dual-Host Yahoo (`query1`/`query2`) + Google Finance DOM scraper, 4 ABCD Playbook Archetypes (`OPENING_DRIVE_SCALP`, `HFT_TRAP_REVERSAL`, `MIDDAY_COMEBACK_SURGE`, `INSTITUTIONAL_CLOSING_RAMP`), and 4 Anti-Sabotage Guardrails (`₹5,000 Cr` Mcap / `₹25 Cr` Turnover gate, `4.0x` fee hurdle, 60m pending TTL, no MTF stop-choking before T1). |
| **v12.2 / v12.3** | 2026-11-05 | `Self-Healing 1m Hook & Pure JSON` | Fixed Nov 5 morning freeze: embedded self-healing 5m wave dispatcher inside `runAutonomousCycle`, added Morning Wave Catch-Up (`09:07–11:00 IST`), and removed `google_search: {}` + `thinkingConfig` HTTP 400 conflict to lock `responseMimeType: "application/json"`. |
| **v13.0** | 2026-11-05 | `OMNI-COUNCIL (Deterministic 2D)` | Post-mortem overhaul after `LGEINDIA` (`-₹1,750.46`) peak-chase loss: upgraded Yahoo fetch to `range=2d` (`PDH`, `PDL`, `prevVwap`, `orl15m`), replaced LLM price guessing with **Deterministic Setup Math**, replaced `0.55%` pullback clamp, added **Per-Bar Mean VDU Ratio**, **8-Index FactSet-to-NSE Sector Map**, **Bounded Volatility-Corridor Sizing**, **70% T1 Free-Ride Shield**, **09:16–09:19 AM True-Gap Reconciler**, and **3-Role Adversarial AI Council** (`FLOW_DETECTIVE`, `TRAP_PROSECUTOR`, `CHIEF_RISK_JUDGE`) with `grossR` vs. `netLiquidationMtmRs` split. |
| **v13.1** | 2026-11-06 | `OMNI-COUNCIL (100KB Cache Hotfix)` | Fixed `range=2d` `CacheService` `>100KB` (`Argument too large: value`) crash in `fetchBatch1MinCandles_`; restored `runAutonomousCycle` 1-minute trigger binding and `09:15 AM` 10-minute AI cadence. |
| **v14.0** | 2026-11-06 | `OMNI-PREDATOR (Two-Way Quant)` | Added Bidirectional `SHORT_MIS (5x)` Engine (`Mcap >= 10,000 Cr`), 16-Row 4-Bucket Radar, WickBP chop gates, and unconditional `>= 15:15 IST` MIS square-off. |
| **v15.0** | 2026-11-07 | `OMNI-SOVEREIGN (FinMem & OFI)` | Built Evolutionary Self-Learning Memory (`Evolutionary_Rulebook_Memory`), Order Flow Imbalance (OFI), Volume Point of Control (POC), and dynamic parameter learning from closed trades. |
| **v16.0** | 2026-11-08 | `OMNI-SOVEREIGN APEX (5 Bug Fixes)` | Forensic post-mortem remediating 5 execution bugs: post-staging watermarks (`STAGE_HIGH`/`STAGE_LOW`), rolling 5-bar burst slices, ATR-buffered 70% T1 shield, and ghost variable wiring. |
| **v17.0** | 2026-11-09 | `OMNI-INSTITUTIONAL ACCELERATED` | **Current Production Master:** Native Gemini 4 Argon Antigravity Interactions API integration, 10-model failover parachute cascade, 5-Pillar Accelerated architecture, fail-closed liquidity gates, gap-and-go margin rescaling, 5-year multi-regime simulation validation, and 4.2x fee hurdle. |

---

## Detailed Version-by-Version Breakdown

### 1. Phase I: Foundation & Statutory Accounting (`v6.3` -> `v6.8`) — Nov 1–2, 2026
* **v6.3 (`NSE ₹1L Quant & Sheet Forensic Terminal`):**
  * Created in Google AI Studio + Apps Script to establish the 5-tab master ledger (`Portfolio_Dashboard`, `Active_Trade_Tickets`, `Audited_Ledger_and_Friction`, `Opportunity_Rotation_Matrix`, `Evolutionary_Rulebook_Memory`).
* **v6.4 (`NSE Ruthless Auditor & LockService Engine`):**
  * Established strict separation of powers: Apps Script (`Code.gs`) acts as the sole intraday execution engine under `LockService`, stamping `LAST_BAR_<tradeId> = YYYY-MM-DD:HHMM` so only future 1-minute candles are evaluated.
  * Implemented the `09:21 AM IST` minimum entry time (`09:45 AM` if opening gap `> 2.5%`) and `CANCELLED_GAP_EXCEEDED` guard.
  * Coded the mandatory `15:15 IST` (`3:15 PM`) MIS square-off (`CLOSED_MIS_315PM`) and `15:34 IST` post-market auditor hook (`EOD_AUDIT_DONE_YYYY-MM-DD`).
  * Verified Zerodha 2026 statutory friction: `0-day MTF interest = ₹0`, `₹35.40` pledge + `₹15.93` CDSL DP charged only once on final exit without double-GST, and 50% margin/loan reduction at `Target_1`.
* **v6.5 / v6.6 -> v6.8 (`Calibrated 5-Key & Omni-Audited Master`):**
  * Calibrated the multi-key router to your 5 Google AI Studio keys (`DEEP_THINK_MODELS = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3-flash", "gemini-3.5-flash-lite"]`), eliminating `HTTP 404` errors on unprovisioned 2.0/2.5 endpoints.
  * Resolved the In-Sheet Gemini audit findings by synchronizing all 5 tab banners to `v6.8` and harmonizing `Opportunity_Rotation_Matrix` so `DEEPAKNTR`, `TCS`, and `BEL` were listed as `ACTIVE MIS #1–#3` alongside `BOROLTD` (MTF Challenger) and `DIXON` (Standby MIS Challenger).

---

### 2. Phase II: Webhooks, Telemetry & Microstructure Tape Sniper (`v9.1` -> `v9.5`) — Nov 3, 2026
* **v9.1 (`Single-Block Zero-Crash JSON + Tampermonkey Bridge`):**
  * Replaced literal backticks in regex with hex escape `\x60` so code blocks never split when pasted or processed.
  * Built `doGet(e)` and `doPost(e)` web app endpoints to pair with **Tampermonkey Browser Bridge `v9.3`** (`⚡ Pull Live Sheet -> Argon` button and passive auto-sync on `gemini.google.com`).
  * Added **Section 3 Telemetry Panel (`Portfolio_Dashboard!A23:I30`)** and `Opportunity_Rotation_Matrix!M2` manual JSON dropzone.
* **v9.2 (`Zero-Crash JSON + T2 Runner + Anti-Churn Guard`):**
  * Fixed `ReferenceError: ru is not defined` inside `ingestArgonJsonPacket`.
  * Added `PARTIAL_T1_BOOKED` runner execution (`CLOSED_T2_FULL` and `CLOSED_TRAIL_SL`) which had been missing in `v9.1`.
  * Added **Hard Anti-Churn Guard** on `EXIT_AT_CMP` (requiring `belowVwap && currentR <= -0.35`) to stop ₹0.20 tick panic exits (such as `RELIANCE` `1294.50 -> 1294.30`).
  * Added **36-Hour MIS Loss Cooldown** (`recentMisLosers`) and universal `.35 / .65` odd-decimal stop snapping (`snapToAntiHftDecimal_`).
* **v9.4 (`Auto-Purge False Trades + Date Serial Healer`):**
  * Built `purgeFalseTradesAndReconcileSheet_` to automatically purge impossible midday `CLOSED_MIS_315PM` audit rows (caused when `v9.2` called `runAutonomousCycle(true)` during market hours) and fake `dayHigh` T1/T2 bookings.
  * Healed Excel/Sheets serial numbers (`46328`, `46329`) in Column B into `yyyy-mm-dd` strings and fixed backdated entry prices (`WELSPUNLIV`).
* **v9.5 (`Sleeve Cap Normalizer + OHLCV Tape-Reading AI + 1m Tape Sniper`):**
  * Fixed `126.9%` margin over-allocation by enforcing max 3 MTF slots (`<= 65%` cap) and max 3 MIS slots (`<= 35%` cap).
  * Added `buildCandleTapeSummary_` (synthesizing 5-minute OHLCV structure, `HIGHER_LOWS_BULLISH` vs `LOWER_HIGHS_BEARISH`, and Volume Point of Control `pocPrice`).
  * Added event-driven `consultFlashTapeSniper_` at Entry (`FILL_NOW` vs `WAIT_WATERFALL`) and Target 1 (`HOLD_FULL_AND_TRAIL` 100% runner when `relV >= 1.35` vs `BOOK_50PCT_T1`).

---

### 3. Phase III: Dual-Tier Quotas & Multi-Agent Defense (`v10.0` -> `v11.4`) — Nov 3–5, 2026
* **v10.0 (`Institutional Quant Engine`):**
  * Added `factoryResetMasterEngine()` (1-click reset to ₹1,00,000 preserving `GEMINI_API_KEY`) and `inspectAllKeyQuotas()` (19 RPD per key limit).
  * *Defects identified:* Truncated at byte 9,082, removed `FLASH_LITE_MODELS` fallback, split triggers causing lock collisions, and removed `consultFlashTapeSniper_`.
* **v10.5 (`Enterprise Master`):**
  * Restored untruncated master tab builders, `FLASH_LITE_MODELS` 5,000 RPD fallback, and unified 1-minute orchestration.
  * *Defects identified in technical defense:* (1) Scaled down share quantities on `ACTIVE_LIVE` trades (`Phantom Share Deletion`), (2) `new Date("03/11/2026")` parsed as March 11 (`237 days` of false MTF interest = `₹5,688` penalty), (3) put `gemini-2.5-flash` at index 0 ahead of `3.8/3.6-flash`, and (4) charged `0.3%` (`0.003`) MTF brokerage instead of `0.03%` (`0.0003`).
* **v11.0 & v11.4 (`Omni-Master`):**
  * Eliminated phantom share deletion (`reconcileAndNormalizePortfolioCaps_` never touches `ACTIVE_LIVE` shares; only cancels `PENDING_OPEN` cap overruns).
  * Added `DD/MM/YYYY` regex parser in `normalizeSheetDateObj_` and Trade-ID date extraction (`extractDateFromTradeId_`).
  * Separated Tier-0 (`AI_CALLS_T0_KEY_`) and Tier-1 (`AI_CALLS_T1_KEY_`) counters so Flash-Lite calls never lock Full-Flash keys.
  * Implemented **Forward-Pass Deduplication** (preserving the oldest active position and deleting newer duplicates) and rescued `CLOSED_CAP_RECONCILED` rows into the audit ledger.

---

### 4. Phase IV: Lockless ABCD Playbooks & Guardrails (`v12.1` -> `v12.3`) — Nov 5, 2026
* **v12.1 (`OMNI-APEX — 3-Brain & ABCD Playbook Terminal`):**
  * **Lockless AI Commander:** Phase 1 reads sheet state and executes Gemini HTTP calls *outside* `LockService`; Phase 2 acquires `LockService` for `<400ms` only to write mutations.
  * **Dual-Host Yahoo + Google Finance DOM Scraper:** Parallel `query1`/`query2.finance.yahoo.com` + `google.com/finance/quote/<SYM>:NSE` DOM fallback.
  * **4 Hard Anti-Sabotage Guardrails:**
    1. *Guardrail #1 (Hands Off My Winner):* Blocked MTF stop-tightening before T1 (`BEL +4.71%` lesson) and MIS stop-ratcheting before 80% progress to T1.
    2. *Guardrail #2 (Institutional Liquidity Gate):* Enforced `Market Cap >= ₹5,000 Cr` and `Daily Turnover >= ₹25 Cr` in TradingView scanner payloads (blocking micro-cap traps like `NELCAST` / `KITEX`).
    3. *Guardrail #3 (60m Patience Timer & Time-Locks):* Added `[Time-Lock: HH:MM IST]` and ABCD Playbook tags (`PLAYBOOK_A` through `PLAYBOOK_D`).
    4. *Guardrail #4 (4.0x Fee-to-Reward Hurdle):* Verified `0.03%` MTF brokerage and rejected any setup where expected T1 gross profit `< 4.0x` round-trip Zerodha friction.
* **v12.2 / v12.3 (`Self-Healing Trigger & JSON Schema Enforcement`):**
  * Fixed the Nov 5 morning stall (`I2` frozen at Nov 4 `15:30:05 IST`) by embedding `runTacticalBrainAndWaveDispatcher()` inside `runAutonomousCycle` and widening `DEEP_WAVE2` catch-up to `11:00 AM IST`.
  * Removed `tools: [{ google_search: {} }]` when `thinkingConfig` is active on `v1beta`, locking `responseMimeType: "application/json"` on all Deep Research waves.

---

### 5. Phase V: Deterministic 2-Day Microstructure & 3-Role Adversarial Council (`v13.0` -> `v13.1`) — Nov 5–6, 2026
* **Forensic Catalyst (`Nov 5 Post-11:00 AM v12.3 Audit`):**
  * Despite Nifty rallying `+576 pts (+2.40%)`, the portfolio closed at `₹98,802.79 (-1.20%)` due to 6 bugs in `v12.3`:
    1. `MAX_PULLBACK_DEPTH_PCT = 0.0055` (`0.55%` clamp) dragged `LGEINDIA`'s pullback limit up to `₹1,809.34` (the exact top of an 11:46 AM 3.02x volume burst), resulting in a `-₹1,750.46` MTM loss when it mean-reverted to `₹1,778.50`.
    2. `APOLLOTYRE` (`Entry ₹423.40` below `Ref ₹423.85`) lacked the literal `[PULLBACK_BUY]` string and deadlocked `boTrigger` all afternoon.
    3. `LT` was up `+₹12.19/share (+₹255.99 gross)` but displayed `-₹201.10` Net MTM due to Day-0 round-trip MTF exit fee deduction, tricking the AI into thinking `LT` was losing money.
    4. `factoryResetMasterEngine()` overwrote the live matrix with hardcoded `defaultWatchlist` tickers (`BEL`, `HAL`, `SBIN`, `LT`, `TRENT`, `SHRIRAMFIN`).
    5. `ENTERO` (`+10.6%` exhaustion top) and `BLUEJET` trapped 100% of MIS cash for 60 minutes due to the blind 60m pending lock.
* **v13.0 (`OMNI-COUNCIL — Deterministic Quant + Adversarial AI`):**
  * **Zero Price Guessing by LLMs:** JavaScript pre-computes `VWAP_PULLBACK`, `VCP_COIL`, and `SPIKE_RETEST` setups deterministically from 2-day (`range=2d`) 1-minute candles (`todayVwap`, `prevVwap`, `pdh`, `pdl`, `orl15m`, **Per-Bar Mean VDU Ratio**, **Wick Buying Pressure**, and **50% Impulse Burst Retest Midpoint**).
  * **Sequence-Locked `09:16–09:19 AM` True-Gap Reconciler:** Recalibrates pre-market orders gapping `+1.5% to +4.5%` into `[GAP_AND_GO_RETEST]` before the `65%` Missed-Boat check runs; cancels `>4.5%` exhaustion gaps.
  * **8-Index FactSet-to-NSE Sector Breadth Engine + Nifty 15m Slope Gate:** Maps TradingView FactSet sectors to `NIFTY_BANK`, `NIFTY_IT`, `NIFTY_AUTO`, `NIFTY_PHARMA`, `NIFTY_METAL`, `NIFTY_ENERGY`, `NIFTY_INFRA`, and `NIFTY_MIDCAP`, blocking breakout chasing during `"GAP_AND_CRAP_FADE"` index distribution.
  * **Bounded Volatility-Corridor Sizing & 70% T1 Free-Ride Shield:** Sizes positions by Rupee Risk (`1.35%` equity MTF / `0.85%` MIS) floored at `₹16,000` MTF / `₹8,500` MIS margin, and ratchets Stop-Loss to **True Net Breakeven** at `>= 70%` progress to Target 1.
  * **3-Role Adversarial AI Council:** Single JSON call roleplaying `FLOW_DETECTIVE`, `TRAP_PROSECUTOR`, and `CHIEF_RISK_JUDGE`, receiving both `grossR` and `netLiquidationMtmRs` (with an explicit `feeNote` protecting price-positive MTF trades like `LT`).
* **v13.1 (`Hotfix for >100KB CacheService Crash`):**
  * Fixed the Nov 6 `09:17 AM` crash where `range=2d` across 16 symbols exceeded Google Apps Script's `100 KB` `CacheService` limit (`Exception: Argument too large: value` on `cache.put()`), restoring the 1-minute CMP radar and 10-minute wave dispatcher.

---

### 6. Phase VI: Two-Way Long/Short Quant & 16-Row 4-Bucket Radar (`v14.0 OMNI-PREDATOR`) — Nov 6–7, 2026
* **Forensic Catalyst (`Nov 6 Live Sheet Audit`):**
  * Identified 9 live defects in `v13.1`:
    1. `calculateZerodhaFriction_(...)` returns an object `{ brk, stt, ..., total }`, but `v13.1`'s 70% T1 Free-Ride Shield and `computeSafeProtectedStop_` forgot `.total`, dividing `[object Object] / qty -> NaN` and silently disabling profit ratchets on `HDFCBANK` and `DIVISLAB`.
    2. `stageTicketsFromCurrentWatchlistIfEmpty_` (`-WATCH-` tag) bypassed the `quantScore >= 75` and AI Council (`judgeConviction >= 78`) gates, dumping raw webhook rows (`UNOMINDA`, `MOTILALOFS`, `DIVISLAB`) straight into `Active_Trade_Tickets`.
    3. `inSweetSpotNow` allowed instant market fills at `liveCmp` (`UNOMINDA` filled in 33 seconds at peak).
    4. Dual order-mode tags (`[PULLBACK_LIMIT] [BREAKOUT_STOP]`) caused `M&M` (WickBP `0.32` upper-wick rejection) to trigger as a breakout and hit Stop-Loss (`-₹598.18`).
    5. `HDFCBANK` (low-beta large-cap) had an unrealistic `+3.09%` MIS Target 1, peaking at `+1.81%` (`70.6%` of T1) without booking profits and sitting unclosed past `15:15 IST`.
* **v14.0 (`OMNI-PREDATOR — Current Production Master`):**
  * **Fixed `.total` `NaN` Bug:** Verified `calculateZerodhaFriction_(...).total` across all 5 call sites so the 70% T1 Free-Ride Shield and post-T1 breakeven stops execute with 100% mathematical precision.
  * **Zero Auto-Stage Bypasses & Max 1+1 Slot Pacing:** Deleted `stageTicketsFromCurrentWatchlistIfEmpty_`. Every trade must pass `quantScore >= 74` AND `judgeConviction >= 78`, capped at max `1 MTF + 1 MIS` new entry per cycle.
  * **True Resting Pullback Limits & Mutually Exclusive Order Tags:** Removed `inSweetSpotNow` instant market fills; every ticket starts as `PENDING_OPEN`. `[PULLBACK_LIMIT]` Longs rest at `<= cmp - 0.30 * atr5m` (and `[PULLBACK_SELL_LIMIT]` Shorts rest at `>= cmp + 0.30 * atr5m`). Enforced `replaceOrderModeTag_` so a ticket never carries two order mode tags.
  * **Wick Rejection Gate & Time-Scaled ATR Chop/Exhaustion Filter:** Longs require `WickBP >= 0.50`; Shorts require `WickBP <= 0.42`. Requires `Day_Range >= 0.28 * Daily_ATR` before `10:30 IST` and `>= 0.42 * Daily_ATR` after `10:30 IST`, blocking MIS breakouts if `Day_Move > 0.80 * Daily_ATR`.
  * **Realistic MIS Target 1 Cap (`1.15x Daily ATR`):** Caps MIS `Target_1` at `prevClose ± 1.15 * dailyAtr` (while still clearing the `4.0x` fee hurdle) so low-beta large-caps like `HDFCBANK` hit `Target_1` intraday.
  * **Bidirectional `SHORT_MIS (5x)` Engine with Circuit-Squeeze Guard:** Added `fetchTradingViewShortScan_()` (`Market Cap >= ₹10,000 Cr`, `Turnover >= ₹40 Cr`, `change -1.0% to -5.5%`, `Close < VWAP`, `RSI 22–45`) and full `SHORT` polarity across entry/exit slippage, 70% T1 Free-Ride Shield, and trailing stops.
  * **16-Row 4-Bucket Institutional Radar (`Opportunity_Rotation_Matrix` Rows 5–20):**
    * `Rows 5–9`: `5 LONG_MTF` Swing Leaders
    * `Rows 10–13`: `4 LONG_MIS` Intraday Bull Leaders
    * `Rows 14–17`: `4 SHORT_MIS` Intraday Breakdown / VWAP Rejection Shorts
    * `Rows 18–20`: `3 ARGON_CATALYST_INBOX` (isolated webhook slots so external Argon pushes never overwrite Rows 5–17).
  * **Unconditional `>= 15:15 IST` MIS Square-Off & Post-Market Lock:** Automatically closes any lingering MIS positions into `Audited_Ledger_and_Friction` after `15:15 IST` or on weekend runs, and blocks EOD audits (`>= 15:00 IST`) from staging new tickets.
  * **Post-Code Self-Audit Fix (`Line 798`):** Patched `if (feedMap[wIdx] &&` -> `if (feedMap[wSym] &&` inside `runFastPriceAndTriggerRadar` so 5-minute volume burst anomalies on watchlist stocks log cleanly.


---

### 7. Phase VII: The 5 Critical Bug Fixes (`v16.0 OMNI-SOVEREIGN APEX`) — Nov 8–9, 2026
* **Forensic Catalyst (Autonomous Ledger & Execution Audit):**
  * Identified 5 hidden execution bugs in `v14.0`:
    1. *Fix #1 (Post-Staging Watermarks):* Premature fills and false `CANCELLED_MISSED_BOAT_RUNAWAY` caused by evaluating pre-market highs/lows. Added `STAGE_HIGH_<id>` and `STAGE_LOW_<id>`.
    2. *Fix #2 (Rolling 5-Bar Burst):* Replaced partial 5m chunks at minutes :01–:04 with true rolling 5-minute OHLCV bar slices (`bars.slice(-5)`).
    3. *Fix #3 (ATR-Buffered 70% T1 Shield & OFI Stall Scale-Out):* Replaced fixed `0.994` breakeven stop with `liveCmp - Math.max(0.20, atr5m * 0.25)`, booking 40% partial profits at $\ge 70\%$ T1 on OFI stalls.
    4. *Fix #5 & Bug A (Ghost Variables & Single Conviction Scale):* Wired all 5 unused variables (`iepPrice`, `sma200`, `pctFrom1MHigh`, `memCfg.atrMultiplier`, `memCfg.minRelVol`) into candidate math, persisted `CONV_SCALE_<id>`, and passed `requestedMargin = 0` on fill to prevent double-discounting.

---

### 8. Phase VIII: 5-Pillar Accelerated Institutional Engine (`v17.0 OMNI-INSTITUTIONAL ACCELERATED`) — Nov 9, 2026
* **Forensic Catalyst (Gemini 4 Argon & 5-Year Multi-Regime Colab Stress Test):**
  * Analysis of 3,758 historical trades across 94 NSE equities demonstrated that blind execution burns capital in friction (₹2.19 Lakh paid in taxes on a ₹1 Lakh base).
* **v17.0 Architecture Upgrades:**
  1. **Strict 4.2x Fee-to-Reward Hurdle (`BASE_GUARDRAILS.MIN_FEE_TO_REWARD_MULTIPLE = 4.2`):**
     * Automatically drops any setup where Target 1 gross profit is less than 4.2x Zerodha round-trip friction, eliminating low-edge intraday churn.
  2. **Strict Integer Share Sizing & Expensive Stock Exclusion (`sized.qty < 1` Skip):**
     * Drops high-priced equities (e.g., `BOSCHLTD`, `MARUTI`, `ABB`) if 1 share exceeds the account rupee risk budget, eliminating account over-leverage on small capital bases.
  3. **Harmonized 1.50% MTF / 0.75% MIS Dynamic Risk Parity:**
     * Aligns target rupee risk to ₹1,500 on 4x MTF swings and ₹750 on 5x MIS intraday momentum, with sleeve floors lowered to ₹5,000 / ₹2,500.
  4. **Bear-Market 100% Cash Shield & LiquidBees Collateral Yield:**
     * When Nifty trades below its 50-EMA or market breadth drops below 52%, MTF swings are completely locked out, parking 100% idle margin into 6.50% p.a. TREPS/LiquidBees collateral yield.
  5. **Expanded Long-to-Short Auto-Flip on Exhaustion Gaps:**
     * Auto-flips long watchlist candidates into short momentum breakdowns if open gap $> 3.2\%$ with buying pressure $\le 0.38$ on large-caps ($\ge ₹10,000$ Cr market cap).


---

### 9. Phase IX: Gemini 4 Argon Antigravity API & 5-Year Multi-Regime Stress Calibration (17.0) â€” Nov 9, 2026
* **Forensic Catalyst (Gemini 4 Argon & 5-Year 36-Combination Parameter Plateau):**
  * Evaluated 36 orthogonal parameter combinations across continuous 5-year NSE data (2021â€“2026, 94 equities).
  * Discovered that unrestricted intraday execution incurs massive statutory friction (INR 2.2+ Lakhs in taxes/charges on a 1 Lakh base).
  * Established calibrated guardrails:
    * MIN_FEE_TO_REWARD_MULTIPLE = 4.2: Setup rejected unless Target 1 gross reward is at least 4.2x round-trip friction.
    * MIN_MARKET_CAP_CR = 10000 for Shorts: Strictly eliminates illiquid penny/small-cap manipulation.
    * Conjunction Climax Law: Short entry requires uyingPressure <= 0.48 strictly verified.
    * Gap-and-Go Rescaling: Automatically scales position size qty = Math.floor((oldEntry * qty) / entryTrigger) if opening bar gaps past stage trigger, preventing margin breach.
    * STAGE_INIT_<tradeId> Watermark: Stops premature cancellation of limit pullback orders on same-bar touches.
    * Native Gemini 4 Argon Integration: Connected directly via https://generativelanguage.googleapis.com/v1beta/interactions with failover to 10 Flash models with thinking.
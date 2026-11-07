# NSE Quant Engine Sim (`NSE_1L_Aggressive_Trading_Master_Ledger_Nov2026`)

**Current Production Version:** `v14.0 OMNI-PREDATOR` (Two-Way Deterministic Quant + 3-Role Adversarial AI Council + Zerodha 2026 Statutory Audit Terminal)  
**Starting Base Capital:** ₹1,00,000.00 | **Blended Buying Power:** ₹4,35,000.00 (4.35x)  
**Master Ledger Sheet:** `NSE_1L_Aggressive_Trading_Master_Ledger_Nov2026` (5 Synchronized Tabs)

---

## 1. System Architecture & Separation of Powers

The simulation operates as a cloud-autonomous institutional trading and statutory accounting terminal on the National Stock Exchange of India (NSE), divided into four distinct layers:

1. **Layer 1 — Deterministic 2-Day Microstructure & Order-Flow Scanner (`Code.gs` Pure JS Math):**
   - Streams parallel 2-day (`range=2d`) 1-minute OHLCV candles from Yahoo Finance (`query1` / `query2`) with real-time Google Finance DOM fallback (`09:08–09:14 IST` Pre-Open IEP & quote scraper).
   - Computes `todayOpen`, `todayVwap`, `prevClose`, `prevVwap`, `pdh` (Previous Day High), `pdl` (Previous Day Low), `orh5m`, `orh30m`, `orl15m` (`09:15–09:30 IST` Opening Range Low), `atr5m`, **Per-Bar Mean Volume Dry-Up Ratio (`vduRatio`)**, **Wick Buying Pressure (`WickBP`)**, **3-Bar VCP Compression**, and **5m Volume Burst Impulse Midpoint**.
   - Pre-computes mathematically locked setups (`entryTrigger`, odd-decimal `stopLoss`, `target1`, `target2`) and a `0–100` `quantScore` before any LLM is invoked.

2. **Layer 2 — The 3-Role Adversarial AI Council (`5-Key Gemini 3.8 / 3.6 Flash Pool`):**
   - Rotates across 5 Google AI Studio project keys (`gemini-3.8-flash` -> `gemini-3.6-flash` Tier 0 at 19 RPD/key = 95 calls/day, backed by a 5,000 RPD `gemini-3.5-flash-lite` / `3.1-flash-lite` Tier 1 parachute).
   - Evaluates pre-computed mathematical candidates using three adversarial personas in a single 100% JSON-locked call:
     - `FLOW_DETECTIVE`: Identifies DII VWAP peg absorption vs. FII sector basket flows across 8 NSE Sector Indices (`NIFTY_BANK`, `NIFTY_IT`, `NIFTY_AUTO`, `NIFTY_PHARMA`, `NIFTY_METAL`, `NIFTY_ENERGY`, `NIFTY_INFRA`, `NIFTY_MIDCAP`).
     - `TRAP_PROSECUTOR`: Ruthlessly vetoes midday exhaustion spikes, upper-wick rejections (`WickBP < 0.50`), and isolated bull traps.
     - `CHIEF_RISK_JUDGE`: Enforces `"CASH IS KING"` (`judgeConviction >= 78`, `quantScore >= 74`, max 1 new MTF + 1 new MIS per cycle).

3. **Layer 3 — Bidirectional Sleeve Allocation & Statutory Execution Clerk (`Code.gs`):**
   - **Sleeve A (65% / ~₹65,000 Cash Cap):** `4x MTF Swing Engine` (`LONG` only, `Close > SMA20 > SMA50`, max 3 slots, `₹16,000–₹21,500` bounded volatility-corridor margin, `1.2%–3.0%` stop corridor).
   - **Sleeve B (35% / ~₹35,000 Cash Cap):** `5x MIS Intraday Engine` (`LONG_MIS` & `SHORT_MIS`, max 3 slots, `₹8,500–₹11,500` margin, `0.6%–1.5%` stop corridor, unconditional `>= 15:15 IST` auto-square-off).
   - **Anti-HFT Stop Shield:** All stops snap to `.35` or `.65` odd decimals and require both `Live_CMP` and `avg3mClose` (3-minute average close) confirmation. Multi-day MTF swings only trigger normal stops after `15:00 IST` unless an intraday crash breaches SL by `>1.2%`.
   - **70% T1 Free-Ride Shield:** Once a position reaches `>= 70%` of the distance to `Target_1`, its Stop-Loss ratchets to **True Net Breakeven** (`Entry ± Round_Trip_Friction_Per_Share ± 0.15%`, snapped to `.35/.65`).

4. **Layer 4 — Argon External Webhooks, Tampermonkey Bridge & 4 Daily Scheduled Waves:**
   - **4 Daily Gemini Argon Waves (Mon–Fri IST):**
     - `Wave 1 (08:30 AM IST)`: Overnight Macro, Global Cues & Pre-Market Catalyst Discovery (`nse-alpha-predator`).
     - `Wave 2 (10:00 AM / 09:08 AM IST)`: Post-Shakeout VWAP Defense & Equilibrium Matrix Builder.
     - `Wave 3 (01:15 PM IST)`: European Open & Afternoon Sector Rotation.
     - `Wave 4 (03:45 PM IST)`: Ruthless Post-Market Audit & Self-Learning Rulebook Writer (`nse-ruthless-auditor`).
   - **Tampermonkey Browser Bridge (`v9.3`):** Connects `gemini.google.com` & Google AI Studio directly to the Google Sheet Web App (`doGet` / `doPost`), routing external catalyst picks into the isolated `ARGON_CATALYST_INBOX` (`Rows 18–20` of `Opportunity_Rotation_Matrix`).

---

## 2. 5-Tab Master Spreadsheet Schema

| Tab # | Sheet Name | Range & Columns | Core Responsibility |
| :--- | :--- | :--- | :--- |
| **Tab 1** | `Portfolio_Dashboard` | `A1:M30` | Real-time NAV (`B5`), Realized Net P&L (`C5`), Unrealized Live MTM (`D5`), Statutory Friction Drag (`E5`), Live Nifty 50 (`I5`), 1m Heartbeat Clock (`I2`), Sleeve Utilization (`A9:I11`), Zerodha 2026 Tax Breakdown (`A15:E21`), and 3-Role AI Telemetry (`A23:I30`). |
| **Tab 2** | `Active_Trade_Tickets` | `Row 6+`, `Cols A:R` (18 cols) | Relational order book tracking `Trade_ID`, `Date_Issued`, `Symbol`, `Segment_Leverage`, `Direction`, `Ref_Close`, `Entry_Trigger`, `Live_CMP`, `Stop_Loss`, `Target_1`, `Target_2`, `Qty`, `Total_Exposure_Rs`, `Cash_Margin_Rs`, `Funded_Loan_Rs`, `Setup_Rationale`, `Status`, and `Live_Net_MTM_Rs`. |
| **Tab 3** | `Audited_Ledger_and_Friction` | `Row 6+`, `Cols A:X` (24 cols) | Immutable audit log of every closed/partial trade with itemized Zerodha brokerage (`0.03%` or ₹20), STT (`0.10%` MTF / `0.025%` MIS sell), NSE turnover (`0.00297%`), SEBI (`0.0001%`), Stamp Duty, `18%` GST, CDSL DP (`₹15.93`), Pledge (`₹35.40`), MTF Interest (`0.04%/day`), and Slippage. |
| **Tab 4** | `Opportunity_Rotation_Matrix` | `Rows 5–20`, `Cols A:L` + `M2` | **16-Row 4-Bucket Institutional Radar:** `Rows 5–9` (`5 LONG_MTF`), `Rows 10–13` (`4 LONG_MIS`), `Rows 14–17` (`4 SHORT_MIS`), `Rows 18–20` (`3 ARGON_CATALYST_INBOX`), plus `Cell M2` JSON Webhook Dropzone. |
| **Tab 5** | `Evolutionary_Rulebook_Memory` | `A1:F30+` | Row-agnostic adaptive parameters (`ATR_Stop_Multiplier`, `Max_Chase_MIS_Pct`, `Min_Relative_Volume`, `Stagnation_Cut_Days`) + chronological post-mortem directives. |

---

## 3. Repository Structure

```text
nse-quant-engine-sim/
├── README.md                                  # Master project overview & architecture
├── CHANGELOG.md                               # Complete version-by-version evolution (v6.3 -> v14.0)
├── push_to_github.sh                          # 1-command Git commit & push script (with history tags)
├── src/
│   ├── Code.gs                                # Latest Production v14.0 OMNI-PREDATOR (with line-798 patch)
│   ├── appsscript.json                        # Google Apps Script manifest (Asia/Kolkata, V8 runtime)
│   └── tampermonkey_argon_bridge_v9.3.user.js # Chrome Tampermonkey bidirectional webhook bridge
├── versions/                                  # Complete historical archive of every engine version
│   ├── v6.3_v6.4_ruthless_auditor_spec.md
│   ├── v6.8_calibrated_5key.gs
│   ├── v6.8_omni_audited_master.gs
│   ├── v9.1_single_block_5key.gs
│   ├── v9.2_zero_crash_t2_runner.gs
│   ├── v9.4_auto_purge_date_healer.gs
│   ├── v9.5_tape_sniper_sleeve_normalizer.gs
│   ├── v10.0_institutional_gatekeeper.gs
│   ├── v10.5_enterprise_master.gs
│   ├── v11.0_omni_master_defense.gs
│   ├── v11.4_omni_master_dual_tier.gs
│   ├── v12.1_omni_apex_abcd_playbook.gs
│   ├── v12.2_omni_apex_self_healing.gs
│   ├── v13.0_omni_council_deterministic.gs
│   ├── v13.1_omni_council_hotfix.gs
│   └── v14.0_omni_predator_master.gs
├── docs/
│   ├── MASTER_CONTEXT_HANDOUT.md              # Full system handout & operational runbook
│   └── forensics/                             # Post-mortems, multi-agent debates & audits
│       ├── 01_v6.5_to_v6.8_in_sheet_audit.md
│       ├── 02_v10.0_vs_v10.5_vs_v11.0_debate.md
│       ├── 03_nov05_v12.1_trigger_and_api_forensics.md
│       ├── 04_nov05_v12.3_lgeindia_loss_and_v13_blueprint.md
│       ├── 05_nov06_scheduled_tasks_static_ticker_audit.md
│       ├── 06_nov06_v13.0_cacheservice_100kb_hotfix.md
│       └── 07_nov06_v14.0_omni_predator_pre_flight_audit.md
├── skills/                                    # Gemini Custom Skills & Scheduled Wave Prompts
│   ├── nse-alpha-predator/SKILL.md
│   ├── nse-ruthless-auditor/SKILL.md
│   └── scheduled_4_waves_prompts.md
├── ai_studio/                                 # Google AI Studio Applets & Prompt Artifacts
│   ├── applet_access_history.json
│   └── ai_studio_prompts_inventory.md
└── ledger_snapshots/                          # Live Sheet State & Trade Snapshots (Nov 2026)
    ├── 2026-11-02_v6.8_initial_6_tickets.md
    ├── 2026-11-05_v12.3_post_11am_forensic_snapshot.md
    └── 2026-11-07_v14.0_live_portfolio_snapshot.md
```

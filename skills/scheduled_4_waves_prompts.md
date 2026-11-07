# Daily 4-Wave Argon Scheduled Tasks (`nse-quant-engine-sim`)

## Schedule & Remediation History (Audited Nov 6, 2026)

| Wave ID | Scheduled Time (IST) | Skill / Persona | Core Function & Anti-Repetition Rules |
| :--- | :--- | :--- | :--- |
| **Wave 1** | `08:30 AM` (Mon–Fri) | `nse-alpha-predator` | **Pre-Market Discovery:** Analyzes overnight global cues, GIFT Nifty, India VIX, FII/DII provisional flows, and Q2/Q3 earnings/order wins. Outputs 8 fresh `[PULLBACK_BUY]` setups into `ARGON_QUANT_BRIDGE`. Strictly bans static ticker recycling (`TRENT`, `SHRIRAMFIN`, etc.). |
| **Wave 2** | `10:00 AM` (Mon–Fri) | `nse-alpha-predator` | **Post-Shakeout Check:** Evaluates which stocks survived the `09:15–09:45 AM` retail flush and identifies DII VWAP absorption. *(Remediated Nov 6: stripped 12 hardcoded tickers and static `LAURUSLABS`/`DIXON` actions).* |
| **Wave 3** | `01:15 PM` (Mon–Fri) | `nse-alpha-predator` | **Midday / Europe Open Rotation:** Assesses European opening momentum, FII TWAP sector basket flows, and afternoon relative volume leaders. *(Remediated Nov 6: stripped static ticker list).* |
| **Wave 4** | `03:45 PM` (Mon–Fri) | `nse-ruthless-auditor` | **Post-Market Statutory Audit:** Verifies `15:15 IST` MIS square-offs, audits `Audited_Ledger_and_Friction`, writes 1 root-cause quantitative directive into `Evolutionary_Rulebook_Memory`, and flags stagnant setups. *(Remediated Nov 6: aligned schedule from 3:40 PM to 3:45 PM IST and removed static closing price queries).* |

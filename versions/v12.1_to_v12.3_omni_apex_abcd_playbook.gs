/**
 * ============================================================================
 * VERSION ARCHIVE: v12.1 -> v12.3 (OMNI-APEX — ABCD Playbooks & 4 Guardrails)
 * Date: November 5, 2026 (10:22 AM - 11:00 AM IST)
 * ============================================================================
 * Key Upgrades in v12.1 -> v12.3:
 * 1. Lockless 2-Phase AI Commander: Executes Gemini HTTP calls outside LockService
 *    and acquires LockService for <400ms only during sheet batch writes.
 * 2. Dual-Host Yahoo (query1/query2) + Google Finance DOM Scraper (09:08-09:14 IST IEP).
 * 3. 4 Intraday Playbook Archetypes:
 *    - PLAYBOOK_A (OPENING_DRIVE_SCALP, 09:15-09:45)
 *    - PLAYBOOK_B (HFT_TRAP_REVERSAL, 09:45-11:30)
 *    - PLAYBOOK_C (MIDDAY_COMEBACK_SURGE, 11:30-14:00)
 *    - PLAYBOOK_D (INSTITUTIONAL_CLOSING_RAMP, 14:00-15:10)
 * 4. 4 Hard Anti-Sabotage Guardrails:
 *    - Guardrail #1: No MTF stop-tightening before T1 (BEL +4.71% lesson).
 *    - Guardrail #2: Institutional Liquidity Gate (Mcap >= ₹5,000 Cr, Turnover >= ₹25 Cr).
 *    - Guardrail #3: 60-minute Patience Timer on pending orders.
 *    - Guardrail #4: 4.0x Fee-to-Reward Hurdle (0.03% MTF brokerage verified).
 * 5. v12.2/v12.3 Hotfixes: Embedded self-healing wave dispatcher inside 1m loop
 *    and removed google_search + thinkingConfig HTTP 400 conflict.
 * ============================================================================
 */

function passesFourXFeeHurdleV121_(segment, entryPrice, target1Price, qty) {
  var isMIS = String(segment).indexOf("MIS") !== -1;
  var grossProfit = Math.abs(target1Price - entryPrice) * qty;
  var buyTurn = entryPrice * qty;
  var sellTurn = target1Price * qty;
  var totalTurn = buyTurn + sellTurn;
  var brk = Math.min(20, buyTurn * 0.0003) + Math.min(20, sellTurn * 0.0003);
  var stt = isMIS ? (sellTurn * 0.00025) : (totalTurn * 0.001);
  var exch = totalTurn * 0.0000307;
  var stamp = buyTurn * (isMIS ? 0.00003 : 0.00015);
  var gst = 0.18 * (brk + exch);
  var dpPledge = isMIS ? 0 : (15.93 + 35.40);
  var slip = totalTurn * (isMIS ? 0.0005 : 0.0010);
  var estRoundTripFee = brk + stt + exch + stamp + gst + dpPledge + slip;
  return grossProfit >= 4.0 * estRoundTripFee;
}

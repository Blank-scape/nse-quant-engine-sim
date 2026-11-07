/**
 * ============================================================================
 * VERSION ARCHIVE: v13.0 & v13.1 (OMNI-COUNCIL — 2D Microstructure & 3-Role Council)
 * Date: November 5, 2026 (23:02 IST) & November 6, 2026 Morning
 * ============================================================================
 * Post-Mortem Fixes & Upgrades (After Nov 5 LGEINDIA -₹1,750.46 Peak-Chase Audit):
 * 1. 2-Day (range=2d) 1-Minute Microstructure Engine: Computes todayVwap, prevClose,
 *    prevVwap, pdh (Previous Day High), pdl (Previous Day Low), orl15m,
 *    Per-Bar Mean VDU Ratio (meanGreenVol / meanRedVol), and Wick Buying Pressure.
 * 2. Deleted the 0.55% MAX_PULLBACK_DEPTH_PCT clamp that caused LGEINDIA to buy
 *    the 11:46 AM 5m volume spike top (₹1,809.34). Replaced with 50% Impulse
 *    Midpoint Retest.
 * 3. Sequence-Locked 09:16-09:19 AM True-Gap Reconciler: Recalibrates +1.5% to +4.5%
 *    gap-ups into [GAP_AND_GO_RETEST] before the 65% Missed-Boat check runs.
 * 4. 8-Index FactSet-to-NSE Sector Breadth Engine + Nifty 15m Slope Gate.
 * 5. Bounded Volatility-Corridor Position Sizing + 70% T1 Free-Ride Breakeven Shield.
 * 6. 3-Role Adversarial AI Council (FLOW_DETECTIVE, TRAP_PROSECUTOR, CHIEF_RISK_JUDGE)
 *    with grossR vs. netLiquidationMtmRs separation (fixing LT Day-0 fee illusion).
 * 7. v13.1 Hotfix: Guarded CacheService.put() against >90KB payloads on range=2d.
 * ============================================================================
 */

function computeDeterministicSetupV130_(c, isMTF) {
  var cmp = Number(c.cmp || 0);
  var vwap = Number(c.vwap || cmp);
  var atr5m = Math.max(cmp * 0.0025, Number(c.atr5m || cmp * 0.004));
  var dailyAtr = Math.max(atr5m * 3.2, Number(c.atr || cmp * 0.022));

  // Never chase an uncooled 5-minute volume burst top (LGEINDIA lesson)
  var entryTrigger = c.burstActive && c.burstMid > 0
    ? Math.min(cmp, c.burstMid)
    : Math.max(vwap, cmp - 0.30 * atr5m);

  var rawStop = isMTF
    ? Math.min(entryTrigger - 1.2 * dailyAtr, Number(c.pdl || entryTrigger * 0.975))
    : Math.min(entryTrigger - 1.5 * atr5m, Number(c.orl15m || vwap - 1.2 * atr5m));

  var minStopDist = entryTrigger * (isMTF ? 0.012 : 0.006);
  var maxStopDist = entryTrigger * (isMTF ? 0.030 : 0.015);
  var stopDist = Math.min(maxStopDist, Math.max(minStopDist, entryTrigger - rawStop));
  var sl = +(entryTrigger - stopDist).toFixed(2);
  var t1 = +(entryTrigger + stopDist * (isMTF ? 1.9 : 1.65)).toFixed(2);
  var t2 = +(entryTrigger + stopDist * (isMTF ? 3.2 : 2.75)).toFixed(2);

  return { entryTrigger: +entryTrigger.toFixed(2), stopLoss: sl, target1: t1, target2: t2 };
}

/**
 * ============================================================================
 * VERSION ARCHIVE: v9.2 (T2 Runner Execution + Anti-Churn Guard + 36h Cooldown)
 * Date: November 3, 2026 (12:47 IST)
 * ============================================================================
 * Key Fixes & Upgrades in v9.2:
 * 1. Fixed ReferenceError: ru is not defined inside ingestArgonJsonPacket.
 * 2. Added PARTIAL_T1_BOOKED runner execution (CLOSED_T2_FULL & CLOSED_TRAIL_SL).
 * 3. Hard Anti-Churn Guard on EXIT_AT_CMP: blocks AI panic exits unless price is
 *    below VWAP AND currentR <= -0.35R (prevented RELIANCE ₹0.20 tick churn).
 * 4. 36-Hour MIS Loser Cooldown (recentMisLosers) + universal .35/.65 odd-decimal
 *    anti-HFT stop snapping (snapToAntiHftDecimal_).
 * ============================================================================
 */

function snapToAntiHftDecimalV92_(price, direction) {
  var p = Number(price || 0);
  if (p <= 0) return 0;
  var base = Math.floor(p);
  var dec = p - base;
  if (String(direction || "LONG").toUpperCase() === "SHORT") {
    return dec <= 0.35 ? +(base + 0.35).toFixed(2) : (dec <= 0.65 ? +(base + 0.65).toFixed(2) : +(base + 1.35).toFixed(2));
  }
  return dec >= 0.65 ? +(base + 0.65).toFixed(2) : (dec >= 0.35 ? +(base + 0.35).toFixed(2) : +(base - 0.35).toFixed(2));
}

function canExecuteAiExitAtCmpV92_(liveCmp, entryPrice, stopLoss, vwap) {
  var riskPerShare = Math.max(0.05, Math.abs(entryPrice - stopLoss));
  var currentR = (liveCmp - entryPrice) / riskPerShare;
  var belowVwap = vwap > 0 ? (liveCmp < vwap) : true;
  // Hard Anti-Churn Guard: never allow AI to panic-dump a flat/winning trade
  return belowVwap && currentR <= -0.35;
}

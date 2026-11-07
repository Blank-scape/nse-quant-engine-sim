/**
 * ============================================================================
 * VERSION ARCHIVE: v11.0 & v11.4 (Omni-Master Defense & Forward-Pass Deduplicator)
 * Date: November 3 Night & November 5, 2026 (10:22 IST)
 * ============================================================================
 * Key Fixes & Upgrades in v11.0 -> v11.4:
 * 1. Eliminated Phantom Share Deletion: reconcileAndNormalizePortfolioCaps_ NEVER
 *    scales down ACTIVE_LIVE or PARTIAL_T1_BOOKED share quantities; only throttles
 *    unfilled PENDING_OPEN tickets.
 * 2. Fixed 237-Day False MTF Interest Bug: Added explicit DD/MM/YYYY regex parser
 *    in normalizeSheetDateObj_ + Trade-ID date extraction (extractDateFromTradeId_).
 * 3. Separated Tier-0 (AI_CALLS_T0_KEY_ = 19 RPD) and Tier-1 (AI_CALLS_T1_KEY_ = 4500 RPD)
 *    quota counters so 1-minute Flash-Lite calls never lock out Deep Research waves.
 * 4. Forward-Pass Deduplication: Preserves the oldest active position and removes
 *    newer duplicate rows; rescues CLOSED_CAP_RECONCILED rows into the audit ledger.
 * ============================================================================
 */

function normalizeSheetDateObjV114_(val, fallbackTradeId) {
  if (val instanceof Date && !isNaN(val.getTime())) return val;
  var s = String(val || "").trim();
  // Explicit DD/MM/YYYY parser to prevent US MM/DD/YYYY 237-day MTF interest bug
  var dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) {
    var d = parseInt(dmy[1], 10);
    var m = parseInt(dmy[2], 10) - 1;
    var y = parseInt(dmy[3], 10);
    return new Date(y, m, d, 9, 15, 0);
  }
  var ymd = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (ymd) {
    return new Date(parseInt(ymd[1], 10), parseInt(ymd[2], 10) - 1, parseInt(ymd[3], 10), 9, 15, 0);
  }
  var tidMatch = String(fallbackTradeId || "").match(/^(20\d{2})(\d{2})(\d{2})/);
  if (tidMatch) {
    return new Date(parseInt(tidMatch[1], 10), parseInt(tidMatch[2], 10) - 1, parseInt(tidMatch[3], 10), 9, 15, 0);
  }
  return new Date();
}

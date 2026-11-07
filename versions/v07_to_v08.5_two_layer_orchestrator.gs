/**
 * ============================================================================
 * VERSION ARCHIVE: v7.0 -> v8.5 (Two-Layer Intelligence & Unified 1m Orchestrator)
 * Date: November 2, 2026
 * ============================================================================
 * What Changed in v7.0 -> v8.5:
 * 1. v7.0: Introduced the Two-Layer Intelligence Architecture:
 *    - Layer 1 (Apps Script Flash Position Manager): Runs inside Google Sheets
 *      to actively manage open tickets and scan live Yahoo + TradingView feeds.
 *    - Layer 2 (External Gemini Argon Scheduled Waves): Runs 4 times daily
 *      (08:30, 10:00, 13:15, 15:45 IST) for deep web search catalyst discovery.
 * 2. v8.0 / v8.5: Unified separate clock triggers into a single 1-minute
 *    `runAutonomousCycle()` master loop to prevent concurrent LockService
 *    collisions, and added Section 3 Telemetry Panel (`Portfolio_Dashboard!A23:I30`).
 * ============================================================================
 */

function runAutonomousCycleV85_(forceAiScan) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(25000)) return;
  try {
    var now = new Date();
    var istTime = Number(Utilities.formatDate(now, "Asia/Kolkata", "HHmm"));
    var dayOfWeek = Number(Utilities.formatDate(now, "Asia/Kolkata", "u"));

    // 1. Always update 1-minute live prices & evaluate Stop-Loss / Target triggers
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && istTime >= 907 && istTime <= 1545) {
      update1mPricesAndTriggersV85_(istTime);
    }

    // 2. Mandatory 3:15 PM IST MIS Auto-Square-Off
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && istTime >= 1515 && istTime <= 1530) {
      squareOffAllMisPositionsAt315_();
    }

    // 3. Every 15 minutes (or when forced), invoke Tactical Flash Brain
    if (forceAiScan || (istTime >= 915 && istTime <= 1510 && (istTime % 15 === 0))) {
      invokeTacticalFlashBrainV85_();
    }

    // 4. At 15:34 IST, run stateless post-market audit
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && istTime >= 1534 && istTime <= 1545) {
      runPostMarketAuditOnceDailyV85_();
    }
  } finally {
    lock.releaseLock();
  }
}

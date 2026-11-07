/**
 * ============================================================================
 * VERSION ARCHIVE: v9.4 (Auto-Purge False Trades + Date Serial Healer)
 * Date: November 3, 2026 (14:01 IST)
 * ============================================================================
 * Key Fixes & Upgrades in v9.4:
 * 1. purgeFalseTradesAndReconcileSheet_(): Automatically purges premature midday
 *    CLOSED_MIS_315PM rows (caused when v9.2 called runAutonomousCycle(true)
 *    during market hours) and fake dayHigh T1/T2 bookings.
 * 2. Healed Google Sheets date serial numbers (e.g., 46328, 46329) in Column B
 *    into clean 'yyyy-MM-dd' strings and reconciled WELSPUNLIV backdated fills.
 * 3. Enabled thinkingConfig: { thinkingLevel: "HIGH" } on Gemini 3.8/3.6 Flash.
 * ============================================================================
 */

function normalizeSheetDateSerialV94_(val) {
  if (val instanceof Date && !isNaN(val.getTime())) {
    return Utilities.formatDate(val, "Asia/Kolkata", "yyyy-MM-dd");
  }
  var num = Number(val);
  if (!isNaN(num) && num > 40000 && num < 60000) {
    var utcDays = Math.floor(num - 25569);
    var d = new Date(utcDays * 86400 * 1000);
    return Utilities.formatDate(d, "Asia/Kolkata", "yyyy-MM-dd");
  }
  return String(val || "").trim();
}

function purgeFalseTradesAndReconcileSheetV94_(ss, istTime) {
  var auditSheet = ss.getSheetByName("Audited_Ledger_and_Friction");
  if (!auditSheet || auditSheet.getLastRow() < 6) return;
  var todayStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd");
  var rows = auditSheet.getRange(6, 1, auditSheet.getLastRow() - 5, 24).getValues();
  for (var i = rows.length - 1; i >= 0; i--) {
    var exitDate = normalizeSheetDateSerialV94_(rows[i][2]);
    var exitReason = String(rows[i][22] || "");
    if (exitDate === todayStr && istTime < 1515 && exitReason.indexOf("315PM") !== -1) {
      auditSheet.deleteRow(6 + i);
    }
  }
}

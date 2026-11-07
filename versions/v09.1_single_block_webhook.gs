/**
 * ============================================================================
 * VERSION ARCHIVE: v9.1 (Single-Block Zero-Crash JSON + Tampermonkey Bridge)
 * Date: November 3, 2026 (10:20 IST)
 * ============================================================================
 * Key Upgrades in v9.1:
 * 1. Hex escape \x60 in extractAndParseJson_ so markdown code fences never split.
 * 2. Bidirectional doGet(e) and doPost(e) webhooks for Tampermonkey Bridge v9.3
 *    plus Cell M2 manual JSON dropzone in Opportunity_Rotation_Matrix.
 * 3. Wall-clock 3:15 PM IST MIS square-off decoupled from Yahoo candle timestamps.
 * 4. [PULLBACK_BUY] morning dip logic (fills when low <= entry && close >= entry).
 * ============================================================================
 */

function extractAndParseJsonV91_(rawText) {
  if (!rawText) return null;
  var bt = "\x60";
  var fenceRegex = new RegExp(bt + bt + bt + "(?:json)?([\\s\\S]*?)" + bt + bt + bt, "i");
  var match = String(rawText).match(fenceRegex);
  var candidate = match ? match[1].trim() : String(rawText).trim();
  var firstBrace = candidate.indexOf("{");
  var lastBrace = candidate.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    candidate = candidate.substring(firstBrace, lastBrace + 1);
  }
  try {
    return JSON.parse(candidate);
  } catch (e) {
    var cleaned = candidate.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(cleaned);
  }
}

function doGetV91_(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dash = ss.getSheetByName("Portfolio_Dashboard");
  var payload = {
    engineVersion: "v9.1-SINGLE-BLOCK",
    timestampIst: Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss"),
    equity: dash ? dash.getRange("B5").getValue() : 100000,
    realizedPnl: dash ? dash.getRange("C5").getValue() : 0,
    unrealizedMtm: dash ? dash.getRange("D5").getValue() : 0
  };
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function doPostV91_(e) {
  var raw = e && e.postData && e.postData.contents ? e.postData.contents : "";
  var parsed = extractAndParseJsonV91_(raw);
  if (!parsed) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", reason: "Invalid JSON" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  ingestArgonJsonPacketV91_(parsed, "WEBHOOK_DOPOST");
  return ContentService.createTextOutput(JSON.stringify({ status: "ok", wave: parsed.waveName || "ARGON" }))
    .setMimeType(ContentService.MimeType.JSON);
}

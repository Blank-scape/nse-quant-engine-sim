/**
 * ============================================================================
 * VERSION ARCHIVE: v6.8 (Calibrated 5-Key AI Studio Router & Omni-Audited Master)
 * Date: November 1, 2026 (22:31 IST)
 * ============================================================================
 * What Changed in v6.5/v6.6 -> v6.8:
 * 1. Calibrated DEEP_THINK_MODELS and FAST_SNIPER_MODELS to the exact models
 *    active on your 5 Google AI Studio keys:
 *    - DEEP_THINK_MODELS: ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3-flash", "gemini-3.5-flash-lite"]
 *    - FAST_SNIPER_MODELS: ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-3.8-flash"]
 *    Eliminated HTTP 404 errors from unprovisioned 2.0/2.5 endpoints.
 * 2. Fixed 'BreakApart is not a function' in cleanDuplicateMemoryRows by removing
 *    invalid Range.breakApart() calls on unmerged rows.
 * 3. Synchronized all 5 tab banners to v6.8 and harmonized Opportunity_Rotation_Matrix
 *    so DEEPAKNTR, TCS, and BEL appear as ACTIVE MIS #1-#3 alongside BOROLTD, DIXON, and HAL.
 * ============================================================================
 */

var CONFIG_V68 = {
  VERSION: "v6.8-OMNI-AUDITED-MASTER",
  TIMEZONE: "Asia/Kolkata",
  STARTING_CAPITAL: 100000,
  MTF_CAP_PCT: 0.65,
  MIS_CAP_PCT: 0.35,
  MTF_LEVERAGE: 4.0,
  MIS_LEVERAGE: 5.0,
  DEEP_THINK_MODELS: [
    "gemini-3.8-flash",
    "gemini-3.6-flash",
    "gemini-3-flash",
    "gemini-3.5-flash-lite"
  ],
  FAST_SNIPER_MODELS: [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.8-flash"
  ],
  INITIAL_6_TICKETS_NOV2026: [
    ["20261102-MTF-01", "2026-11-02", "LAURUSLABS", "MTF_SWING (4x)", "LONG", 2398.00, 2412.00, 2398.00, 2285.00, 2580.00, 2740.00, 35, 84420.00, 21105.00, 63315.00, "Pharma CDMO Q2 margin expansion + cup-and-handle breakout", "PENDING_OPEN", 0.00],
    ["20261102-MTF-02", "2026-11-02", "TRENT", "MTF_SWING (4x)", "LONG", 3015.00, 3030.00, 3015.00, 2915.00, 3220.00, 3440.00, 28, 84840.00, 21210.00, 63630.00, "Retail LFL growth leader reclaiming 20-DMA on institutional accumulation", "PENDING_OPEN", 0.00],
    ["20261102-MTF-03", "2026-11-02", "NTPC", "MTF_SWING (4x)", "LONG", 315.50, 318.00, 315.50, 306.00, 334.00, 348.00, 260, 82680.00, 20670.00, 62010.00, "PSU Power defensive leader holding above 50-DMA with DII buying", "PENDING_OPEN", 0.00],
    ["20261102-MIS-01", "2026-11-02", "DEEPAKNTR", "INTRADAY_MIS (5x)", "LONG", 1522.00, 1535.00, 1522.00, 1504.00, 1575.00, 1612.00, 40, 61400.00, 12280.00, 0.00, "Specialty chemical volume surge + ORB 15m breakout setup", "PENDING_OPEN", 0.00],
    ["20261102-MIS-02", "2026-11-02", "TCS", "INTRADAY_MIS (5x)", "LONG", 2498.00, 2512.00, 2498.00, 2478.00, 2565.00, 2610.00, 22, 55264.00, 11052.80, 0.00, "IT Large-cap VWAP defense + USD/INR tailwind", "PENDING_OPEN", 0.00],
    ["20261102-MIS-03", "2026-11-02", "BEL", "INTRADAY_MIS (5x)", "LONG", 370.00, 372.50, 370.00, 364.00, 384.00, 395.00, 150, 55875.00, 11175.00, 0.00, "Defense order-book momentum + tight consolidation above VWAP", "PENDING_OPEN", 0.00]
  ]
};

function callGemini5KeyRouterV68_(promptText, useDeepThink) {
  var rawKeys = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY") || "";
  var keys = rawKeys.split(",").map(function(k) { return k.trim(); }).filter(Boolean);
  if (!keys.length) throw new Error("No GEMINI_API_KEY found in ScriptProperties.");

  var models = useDeepThink ? CONFIG_V68.DEEP_THINK_MODELS : CONFIG_V68.FAST_SNIPER_MODELS;
  for (var m = 0; m < models.length; m++) {
    var modelName = models[m];
    for (var k = 0; k < keys.length; k++) {
      var apiKey = keys[k];
      var url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey;
      var payload = {
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
      };
      var res = UrlFetchApp.fetch(url, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      });
      if (res.getResponseCode() === 200) {
        return JSON.parse(res.getContentText());
      }
    }
  }
  return null;
}

function cleanDuplicateMemoryRowsV68_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("Evolutionary_Rulebook_Memory");
  if (!sh) return;
  var lastRow = sh.getLastRow();
  if (lastRow < 12) return;
  var data = sh.getRange(12, 1, lastRow - 11, 6).getValues();
  var seen = {};
  for (var i = data.length - 1; i >= 0; i--) {
    var key = String(data[i][1] || "").trim() + "|" + String(data[i][4] || "").trim();
    if (key !== "|" && seen[key]) {
      sh.deleteRow(12 + i);
    } else {
      seen[key] = true;
    }
  }
}

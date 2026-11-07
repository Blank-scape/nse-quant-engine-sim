/**
 * ============================================================================
 * VERSION ARCHIVE: v10.0 & v10.5 (Institutional Gatekeeper & Dual-Tier Master)
 * Date: November 3, 2026 Evening (20:11 IST)
 * ============================================================================
 * What Changed in v10.0 & v10.5:
 * 1. Added 1-click factoryResetMasterEngine() (resets simulation to ₹1,00,000.00
 *    while preserving GEMINI_API_KEY in ScriptProperties).
 * 2. Added per-key 19-RPD enforcer (inspectAllKeyQuotas) across all 5 AI Studio keys.
 * 3. Added FLASH_LITE_MODELS (5,000 RPD parachute) in v10.5 to prevent HTTP 429 lockouts.
 * 4. NOTE ON v10.5 REGRESSIONS (Fixed in v11.0):
 *    - v10.5 scaled down share quantities on ACTIVE_LIVE trades (Phantom Share Deletion).
 *    - v10.5 parsed '03/11/2026' as March 11 (237 days of false MTF interest = ₹5,688 penalty).
 *    - v10.5 placed gemini-2.5-flash at index 0 ahead of gemini-3.8-flash.
 *    - v10.5 used 0.003 (0.3%) instead of 0.0003 (0.03%) for MTF brokerage.
 * ============================================================================
 */

function factoryResetMasterEngineV10_() {
  var props = PropertiesService.getScriptProperties();
  var savedApiKeys = props.getProperty("GEMINI_API_KEY") || "";
  props.deleteAllProperties();
  if (savedApiKeys) {
    props.setProperty("GEMINI_API_KEY", savedApiKeys);
  }
  CacheService.getScriptCache().removeAll(["YAHOO_BATCH_CACHE"]);
  return "Factory Reset Complete. GEMINI_API_KEY preserved.";
}

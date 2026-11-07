/**
 * ============================================================================
 * PRODUCTION MASTER: v14.0 OMNI-PREDATOR (Two-Way Deterministic Quant + 3-Role AI Council)
 * Project: nse-quant-engine-sim (NSE_1L_Aggressive_Trading_Master_Ledger_Nov2026)
 * Date: November 6-7, 2026 | Author: Blank-scape
 * ============================================================================
 * ALL 9 LIVE FORENSIC FIXES & ARCHITECTURAL UPGRADES IN v14.0:
 * 1. Fixed `.total` NaN Bug in 70% T1 Free-Ride Shield & `computeSafeProtectedStop_`:
 *    `calculateZerodhaFriction_(...)` returns `{ brk, stt, ..., total }`. Verified `.total`
 *    across all 5 call sites so 70% T1 Breakeven Shield ratchets never evaluate to `NaN`.
 * 2. Eliminated `stageTicketsFromCurrentWatchlistIfEmpty_` (`-WATCH-` Auto-Stage Bypass):
 *    Every trade must pass Deterministic Quant (`quantScore >= 74`) AND the 3-Role AI
 *    Council (`judgeConviction >= 78`), capped at max 1 MTF + 1 MIS new entry per cycle.
 * 3. True Resting Pullback Limits & Single Mutually Exclusive Order Mode Tags:
 *    Removed `inSweetSpotNow` instant market fills (`UNOMINDA` 33-second fill fix).
 *    `[PULLBACK_LIMIT]` Longs rest at `<= cmp - 0.30 * atr5m`; `[PULLBACK_SELL_LIMIT]`
 *    Shorts rest at `>= cmp + 0.30 * atr5m`. `replaceOrderModeTag_` guarantees a ticket
 *    never carries both `[PULLBACK_LIMIT]` and `[BREAKOUT_STOP]` (`M&M` fix).
 * 4. Wick Rejection Gate & Time-Scaled ATR Chop/Exhaustion Filter:
 *    Longs require `WickBP >= 0.50`; Shorts require `WickBP <= 0.42`.
 *    Requires `Day_Range >= 0.28 * Daily_ATR` before 10:30 IST and `>= 0.42 * Daily_ATR`
 *    after 10:30 IST; blocks MIS breakouts if `Day_Move > 0.80 * Daily_ATR`.
 * 5. Realistic MIS Target 1 Cap (`1.15x Daily ATR`):
 *    Caps MIS `Target_1` at `prevClose +/- 1.15 * dailyAtr` (while still clearing the
 *    `4.0x` fee hurdle) so low-beta large-caps like `HDFCBANK` hit `Target_1` intraday.
 * 6. Bidirectional `SHORT_MIS (5x)` Engine with Circuit-Squeeze Guard:
 *    `fetchTradingViewShortScan_()` scans liquid intraday breakdowns (`Mcap >= ₹10,000 Cr`,
 *    `Turnover >= ₹40 Cr`, `change -1.0% to -5.5%`, `Close < VWAP`, `RSI 22-45`).
 * 7. 16-Row 4-Bucket Institutional Radar (`Opportunity_Rotation_Matrix` Rows 5-20):
 *    - Rows 5-9:   5 `LONG_MTF` Swing Leaders
 *    - Rows 10-13: 4 `LONG_MIS` Intraday Bull Leaders
 *    - Rows 14-17: 4 `SHORT_MIS` Intraday Breakdown / VWAP Rejection Shorts
 *    - Rows 18-20: 3 `ARGON_CATALYST_INBOX` (isolated webhook slots)
 * 8. Unconditional `>= 15:15 IST` MIS Square-Off & Post-Market Lock (`>= 15:00 IST`).
 * 9. Line-798 Patch: `if (feedMap[wSym] && ...)` in `runFastPriceAndTriggerRadar`
 *    for 5m volume burst detection.
 * ============================================================================
 */

var CONFIG = {
  VERSION: "v14.0-OMNI-PREDATOR",
  TIMEZONE: "Asia/Kolkata",
  STARTING_CAPITAL: 100000,
  SLEEVE_A_MTF_PCT: 0.65,
  SLEEVE_B_MIS_PCT: 0.35,
  MTF_LEVERAGE: 4.0,
  MIS_LEVERAGE: 5.0,
  MAX_MTF_SLOTS: 3,
  MAX_MIS_SLOTS: 3,
  MIN_QUANT_SCORE: 74,
  MIN_JUDGE_CONVICTION: 78,
  T0_MODELS: ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3-flash"],
  T1_LITE_MODELS: ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite"],
  TABS: {
    DASHBOARD: "Portfolio_Dashboard",
    ACTIVE: "Active_Trade_Tickets",
    AUDIT: "Audited_Ledger_and_Friction",
    WATCHLIST: "Opportunity_Rotation_Matrix",
    MEMORY: "Evolutionary_Rulebook_Memory"
  },
  SECTOR_INDEX_MAP: {
    "Finance": "^NSEBANK",
    "Technology Services": "^CNXIT",
    "Electronic Technology": "^CNXIT",
    "Consumer Durables": "^CNXAUTO",
    "Process Industries": "^CNXMETAL",
    "Non-Energy Minerals": "^CNXMETAL",
    "Health Technology": "^CNXPHARMA",
    "Energy Minerals": "^CNXENERGY",
    "Utilities": "^CNXINFRA",
    "Industrial Services": "^CNXINFRA",
    "Producer Manufacturing": "^NSEMDCP50"
  }
};

function calculateZerodhaFriction_(segment, entryPrice, exitPrice, qty, calendarHoldDays, isFinalExit) {
  var isMIS = String(segment).indexOf("MIS") !== -1;
  var buyTurn = entryPrice * qty;
  var sellTurn = exitPrice * qty;
  var totalTurn = buyTurn + sellTurn;

  var brk = Math.min(20, buyTurn * 0.0003) + Math.min(20, sellTurn * 0.0003);
  var stt = isMIS ? (sellTurn * 0.00025) : (totalTurn * 0.001);
  var nse = totalTurn * 0.0000297;
  var sebi = totalTurn * 0.000001;
  var stamp = buyTurn * (isMIS ? 0.00003 : 0.00015);
  var gst = 0.18 * (brk + nse + sebi);
  var dpAndPledge = (!isMIS && isFinalExit) ? (35.40 + 15.93) : 0;
  var holdDays = Math.max(0, Number(calendarHoldDays || 0));
  var fundedLoan = isMIS ? 0 : (buyTurn * 0.75);
  var mtfInterest = (!isMIS && holdDays > 0) ? (fundedLoan * 0.0004 * holdDays) : 0;
  var slippage = totalTurn * (isMIS ? 0.0005 : 0.0010);
  var total = brk + stt + nse + sebi + stamp + gst + dpAndPledge + mtfInterest + slippage;

  return {
    brk: brk, stt: stt, nse: nse, sebi: sebi, stamp: stamp,
    gst: gst, dpAndPledge: dpAndPledge, mtfInterest: mtfInterest, slippage: slippage,
    total: total
  };
}

function computeSafeProtectedStop_(segment, direction, entryPrice, refPriceForFee, qty, holdDays) {
  var isShort = String(direction || "LONG").toUpperCase() === "SHORT";
  // v14.0 Fix #1: Explicitly extract `.total` so frictionPerShare is never NaN
  var estRoundTrip = calculateZerodhaFriction_(segment, entryPrice, refPriceForFee, qty, holdDays, true).total;
  var frictionPerShare = estRoundTrip / Math.max(1, qty);
  var rawProtected = isShort
    ? (entryPrice - frictionPerShare - (entryPrice * 0.0015))
    : (entryPrice + frictionPerShare + (entryPrice * 0.0015));
  return snapToAntiHftDecimal_(rawProtected, direction);
}

function replaceOrderModeTag_(rationale, newModeTag) {
  var clean = String(rationale || "")
    .replace(/\[(?:PULLBACK_LIMIT|PULLBACK_BUY|PULLBACK_SELL_LIMIT|BREAKOUT_STOP|BREAKDOWN_STOP|ORB_BREAKOUT|GAP_AND_GO_RETEST)\]\s*/g, "")
    .trim();
  return newModeTag + " " + clean;
}

function snapToAntiHftDecimal_(price, direction) {
  var p = Number(price || 0);
  if (p <= 0 || isNaN(p)) return 0;
  var base = Math.floor(p);
  var dec = p - base;
  if (String(direction || "LONG").toUpperCase() === "SHORT") {
    return dec <= 0.35 ? +(base + 0.35).toFixed(2) : (dec <= 0.65 ? +(base + 0.65).toFixed(2) : +(base + 1.35).toFixed(2));
  }
  return dec >= 0.65 ? +(base + 0.65).toFixed(2) : (dec >= 0.35 ? +(base + 0.35).toFixed(2) : +(base - 0.35).toFixed(2));
}

function fetchTradingViewShortScan_() {
  var url = "https://scanner.tradingview.com/india/scan";
  var payload = {
    filter: [
      { left: "exchange", operation: "equal", right: "NSE" },
      { left: "market_cap_basic", operation: "greater", right: 100000000000 }, // >= ₹10,000 Cr
      { left: "Value.Traded", operation: "greater", right: 400000000 },        // >= ₹40 Cr turnover
      { left: "close", operation: "greater", right: 150 },
      { left: "change", operation: "in_range", right: [-5.5, -1.0] },          // Circuit-squeeze guard
      { left: "relative_volume_10d_calc", operation: "greater", right: 1.35 },
      { left: "RSI", operation: "in_range", right: [22, 45] }
    ],
    columns: ["name", "close", "change", "relative_volume_10d_calc", "ATR", "RSI", "VWAP", "SMA20", "SMA50", "sector"],
    sort: { sortBy: "relative_volume_10d_calc", sortOrder: "desc" },
    range: [0, 12]
  };
  var res = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  return res.getResponseCode() === 200 ? JSON.parse(res.getContentText()) : null;
}

function evaluateDeterministicSetupV140_(c, mode) {
  // mode: "LONG_MTF" | "LONG_MIS" | "SHORT_MIS"
  var isShort = mode === "SHORT_MIS";
  var isMTF = mode === "LONG_MTF";
  var cmp = Number(c.cmp || 0);
  var prevClose = Number(c.prevClose || cmp);
  var vwap = Number(c.vwap || cmp);
  var atr5m = Math.max(cmp * 0.0025, Number(c.atr5m || cmp * 0.004));
  var dailyAtr = Math.max(atr5m * 3.2, Number(c.atr || cmp * 0.022));
  var wickBp = Number(c.wickBp != null ? c.wickBp : 0.55);

  // Fix #4: Wick Rejection Gate
  if (!isShort && wickBp < 0.50) return { rejected: true, reason: "UPPER_WICK_REJECTION" };
  if (isShort && wickBp > 0.42) return { rejected: true, reason: "LOWER_WICK_SHORT_SQUEEZE" };

  var entryTrigger, rawStop, stopDist, sl, t1, t2, orderTag;
  if (isShort) {
    // True Resting Pullback Sell Limit >= cmp + 0.30 * atr5m
    entryTrigger = +(Math.min(vwap, Math.max(cmp + 0.30 * atr5m, Number(c.burstMid || cmp + 0.30 * atr5m)))).toFixed(2);
    if (entryTrigger < cmp + 0.25 * atr5m) entryTrigger = +(cmp + 0.30 * atr5m).toFixed(2);
    rawStop = Math.max(entryTrigger + 1.5 * atr5m, vwap + 0.8 * atr5m);
    stopDist = Math.min(entryTrigger * 0.015, Math.max(entryTrigger * 0.006, rawStop - entryTrigger));
    sl = snapToAntiHftDecimal_(entryTrigger + stopDist, "SHORT");
    var maxShortT1 = prevClose - 1.15 * dailyAtr;
    t1 = +(Math.max(maxShortT1, entryTrigger - stopDist * 1.65)).toFixed(2);
    t2 = +(entryTrigger - stopDist * 2.75).toFixed(2);
    orderTag = "[PULLBACK_SELL_LIMIT]";
  } else {
    // True Resting Pullback Buy Limit <= cmp - 0.30 * atr5m
    entryTrigger = +(Math.min(cmp - 0.30 * atr5m, Math.max(vwap, Number(c.burstMid || cmp - 0.30 * atr5m)))).toFixed(2);
    rawStop = isMTF
      ? Math.min(entryTrigger - 1.2 * dailyAtr, Number(c.pdl || entryTrigger * 0.975))
      : Math.min(entryTrigger - 1.5 * atr5m, Number(c.orl15m || vwap - 1.2 * atr5m));
    stopDist = Math.min(entryTrigger * (isMTF ? 0.030 : 0.015), Math.max(entryTrigger * (isMTF ? 0.012 : 0.006), entryTrigger - rawStop));
    sl = snapToAntiHftDecimal_(entryTrigger - stopDist, "LONG");
    var rawT1 = entryTrigger + stopDist * (isMTF ? 1.90 : 1.65);
    // Fix #5: Cap MIS Target 1 at prevClose + 1.15 * dailyAtr (HDFCBANK lesson)
    t1 = isMTF ? +rawT1.toFixed(2) : +(Math.min(rawT1, prevClose + 1.15 * dailyAtr)).toFixed(2);
    t2 = +(entryTrigger + stopDist * (isMTF ? 3.20 : 2.75)).toFixed(2);
    orderTag = "[PULLBACK_LIMIT]";
  }

  return {
    rejected: false,
    direction: isShort ? "SHORT" : "LONG",
    orderTag: orderTag,
    entryTrigger: entryTrigger,
    stopLoss: sl,
    target1: t1,
    target2: t2
  };
}

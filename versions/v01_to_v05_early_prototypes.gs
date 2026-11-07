/**
 * ============================================================================
 * VERSION ARCHIVE: v1.0 -> v5.0 (Early Prototypes — Nov 1, 2026 Morning/Afternoon)
 * Project: nse-quant-engine-sim (NSE_1L_Aggressive_Trading_Master_Ledger_Nov2026)
 * ============================================================================
 * Historical Progression:
 * - v1.0 ("fin simulation"): Initial ₹1,00,000 paper-trading ledger (65% 4x MTF / 35% 5x MIS)
 *   using single GEMINI_API_KEY and GOOGLEFINANCE / basic Yahoo Finance v8 polling.
 * - v2.0: 5-Tab Master Ledger architecture (Portfolio_Dashboard, Active_Trade_Tickets,
 *   Audited_Ledger_and_Friction, Opportunity_Rotation_Matrix, Evolutionary_Rulebook_Memory)
 *   + Zerodha 2026 Statutory Tax & Friction calculator.
 * - v3.0: 1-Minute Yahoo Finance OHLCV candle fetcher + PENDING_OPEN -> ACTIVE_LIVE fills.
 * - v4.0: Split AI prompts into nse-alpha-predator (Watchlist Discovery) and
 *   nse-ruthless-auditor (Post-Market Statutory P&L Audit & Rulebook Writer).
 * - v5.0: Added live TradingView India Scanner HTTP POST (scanner.tradingview.com/india/scan)
 *   and multi-key rotation across ScriptProperties GEMINI_API_KEY.
 * ============================================================================
 */

var CONFIG_V1_V5 = {
  ENGINE_VERSION: "v5.0-PROTOTYPE",
  STARTING_CAPITAL: 100000,
  SLEEVE_A_MTF_PCT: 0.65,
  SLEEVE_B_MIS_PCT: 0.35,
  MTF_LEVERAGE: 4.0,
  MIS_LEVERAGE: 5.0,
  TABS: {
    DASHBOARD: "Portfolio_Dashboard",
    ACTIVE: "Active_Trade_Tickets",
    AUDIT: "Audited_Ledger_and_Friction",
    WATCHLIST: "Opportunity_Rotation_Matrix",
    MEMORY: "Evolutionary_Rulebook_Memory"
  }
};

function calculateZerodhaFrictionV2_(segment, entryPrice, exitPrice, qty, holdDays) {
  var isMIS = String(segment).indexOf("MIS") !== -1;
  var buyTurn = entryPrice * qty;
  var sellTurn = exitPrice * qty;
  var totalTurn = buyTurn + sellTurn;

  var brk = Math.min(20, buyTurn * 0.0003) + Math.min(20, sellTurn * 0.0003);
  var stt = isMIS ? (sellTurn * 0.00025) : (totalTurn * 0.001);
  var nse = totalTurn * 0.0000297;
  var sebi = totalTurn * 0.000001;
  var stamp = buyTurn * (isMIS ? 0.00003 : 0.00015);
  var gst = (brk + nse + sebi) * 0.18;
  var dpAndPledge = isMIS ? 0 : (15.93 + 35.40);
  var fundedLoan = isMIS ? 0 : (buyTurn * 0.75);
  var mtfInterest = isMIS ? 0 : (fundedLoan * 0.0004 * Math.max(1, holdDays || 1));
  var slippage = totalTurn * (isMIS ? 0.0005 : 0.0010);

  return {
    brk: brk, stt: stt, nse: nse, sebi: sebi, stamp: stamp,
    gst: gst, dpAndPledge: dpAndPledge, mtfInterest: mtfInterest, slippage: slippage,
    total: brk + stt + nse + sebi + stamp + gst + dpAndPledge + mtfInterest + slippage
  };
}

function fetchYahoo1mQuoteV3_(symbol) {
  var url = "https://query1.finance.yahoo.com/v8/finance/chart/" + encodeURIComponent(symbol) + ".NS?interval=1m&range=1d";
  var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) return null;
  var data = JSON.parse(res.getContentText());
  var result = data.chart.result[0];
  var meta = result.meta;
  var q = result.indicators.quote[0];
  var closes = q.close || [];
  var lastClose = meta.regularMarketPrice || closes[closes.length - 1] || 0;
  return {
    symbol: symbol,
    cmp: Number(lastClose),
    prevClose: Number(meta.chartPreviousClose || lastClose),
    dayHigh: Number(meta.regularMarketDayHigh || lastClose),
    dayLow: Number(meta.regularMarketDayLow || lastClose)
  };
}

function fetchTradingViewMoversV5_() {
  var url = "https://scanner.tradingview.com/india/scan";
  var payload = {
    filter: [
      { left: "exchange", operation: "equal", right: "NSE" },
      { left: "close", operation: "greater", right: 100 },
      { left: "relative_volume_10d_calc", operation: "greater", right: 1.5 }
    ],
    columns: ["name", "close", "change", "relative_volume_10d_calc", "ATR", "RSI"],
    sort: { sortBy: "relative_volume_10d_calc", sortOrder: "desc" },
    range: [0, 15]
  };
  var res = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  return res.getResponseCode() === 200 ? JSON.parse(res.getContentText()) : null;
}

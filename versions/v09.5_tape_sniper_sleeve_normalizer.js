/**
 * ============================================================================
 * VERSION ARCHIVE: v9.5 (Sleeve Cap Normalizer + 5m OHLCV Tape + 1m Tape Sniper)
 * Date: November 3, 2026 Afternoon
 * ============================================================================
 * Key Upgrades in v9.5:
 * 1. reconcileAndNormalizePortfolioCaps_(): Healed 126.9% margin over-allocation
 *    by enforcing max 3 MTF slots (<= 65% cap) and max 3 MIS slots (<= 35% cap).
 * 2. buildCandleTapeSummary_(): Synthesizes last six 5-minute OHLCV candles,
 *    structure (HIGHER_LOWS_BULLISH vs LOWER_HIGHS_BEARISH), and Volume POC.
 * 3. consultFlashTapeSniper_(): Event-driven 1-minute Flash check at Entry
 *    (blocks falling-knife fills) and at Target 1 (HOLD_FULL_AND_TRAIL 100%
 *    runner when relV >= 1.35x vs BOOK_50PCT_T1).
 * ============================================================================
 */

function buildCandleTapeSummaryV95_(bars) {
  if (!bars || bars.length < 5) return { structure: "INSUFFICIENT_BARS", pocPrice: 0 };
  var buckets = [];
  for (var i = Math.max(0, bars.length - 30); i < bars.length; i += 5) {
    var slice = bars.slice(i, i + 5);
    if (!slice.length) continue;
    var o = slice[0].open;
    var c = slice[slice.length - 1].close;
    var h = slice[0].high, l = slice[0].low, v = 0;
    for (var j = 0; j < slice.length; j++) {
      if (slice[j].high > h) h = slice[j].high;
      if (slice[j].low < l) l = slice[j].low;
      v += Number(slice[j].volume || 0);
    }
    buckets.push({ o: o, h: h, l: l, c: c, v: v });
  }
  var pocPrice = buckets[0].c, maxVol = -1;
  for (var k = 0; k < buckets.length; k++) {
    if (buckets[k].v > maxVol) {
      maxVol = buckets[k].v;
      pocPrice = +((buckets[k].h + buckets[k].l + buckets[k].c) / 3).toFixed(2);
    }
  }
  var n = buckets.length;
  var higherLows = n >= 3 && buckets[n - 1].l >= buckets[n - 2].l && buckets[n - 2].l >= buckets[n - 3].l;
  var lowerHighs = n >= 3 && buckets[n - 1].h <= buckets[n - 2].h && buckets[n - 2].h <= buckets[n - 3].h;
  return {
    structure: higherLows ? "HIGHER_LOWS_BULLISH" : (lowerHighs ? "LOWER_HIGHS_BEARISH" : "CONSOLIDATING"),
    pocPrice: pocPrice,
    recent5mBars: buckets
  };
}

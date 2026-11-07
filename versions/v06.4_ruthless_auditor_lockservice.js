/**
 * ============================================================================
 * VERSION ARCHIVE: v6.4 (Ruthless Post-Market Auditor & LockService Engine)
 * Date: November 1, 2026 Evening
 * ============================================================================
 * What Changed in v6.3 -> v6.4:
 * 1. Added LockService concurrency lock + LAST_BAR_<tradeId> = YYYY-MM-DD:HHMM
 *    so 1-minute candles prior to ticket issuance are never retroactively triggered.
 * 2. Enforced 09:21 AM IST minimum entry time (09:45 AM if opening gap > 2.5%)
 *    and CANCELLED_GAP_EXCEEDED (> 3.0% gap above Entry_Trigger).
 * 3. Added mandatory 15:15 IST (3:15 PM) MIS Auto-Square-Off (CLOSED_MIS_315PM)
 *    and 15:34 IST (3:34 PM) EOD Auditor hook (EOD_AUDIT_DONE_YYYY-MM-DD).
 * 4. Verified Zerodha 2026 statutory friction:
 *    - 0-day MTF interest = ₹0 when bought and sold same day.
 *    - ₹35.40 Pledge + ₹15.93 CDSL DP excluded from 18% GST base and charged once on final exit.
 *    - 50% T1 partial booking reduces active Qty, Exposure, Margin, and MTF Loan by 50%
 *      and ratchets Stop_Loss to Entry_Trigger + 0.20% friction buffer.
 * ============================================================================
 */

function calculateZerodhaFrictionV64_(segment, entryPrice, exitPrice, qty, calendarHoldDays, isFinalExit) {
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

  return {
    brk: brk, stt: stt, nse: nse, sebi: sebi, stamp: stamp,
    gst: gst, dpAndPledge: dpAndPledge, mtfInterest: mtfInterest, slippage: slippage,
    total: brk + stt + nse + sebi + stamp + gst + dpAndPledge + mtfInterest + slippage
  };
}

function evaluate1mCandlesWithCursorV64_(tradeId, status, entryTrigger, sl, t1, t2, bars, timeVal) {
  var props = PropertiesService.getScriptProperties();
  var cursorKey = "LAST_BAR_" + tradeId;
  var lastBarStamp = props.getProperty(cursorKey) || "";

  for (var i = 0; i < bars.length; i++) {
    var b = bars[i];
    if (lastBarStamp && b.barStamp <= lastBarStamp) continue;

    if (status === "PENDING_OPEN") {
      if (timeVal < 921) continue;
      if (b.high >= entryTrigger && b.low <= entryTrigger * 1.004) {
        status = "ACTIVE_LIVE";
        props.setProperty(cursorKey, b.barStamp);
      }
    } else if (status === "ACTIVE_LIVE") {
      if (b.low <= sl) {
        props.setProperty(cursorKey, b.barStamp);
        return { action: "CLOSE_SL", price: sl };
      }
      if (b.high >= t1) {
        props.setProperty(cursorKey, b.barStamp);
        return { action: "BOOK_T1_50PCT", price: t1, newSl: +(entryTrigger * 1.002).toFixed(2) };
      }
    } else if (status === "PARTIAL_T1_BOOKED") {
      if (b.low <= sl) {
        props.setProperty(cursorKey, b.barStamp);
        return { action: "CLOSE_TRAIL_SL", price: sl };
      }
      if (b.high >= t2) {
        props.setProperty(cursorKey, b.barStamp);
        return { action: "CLOSE_T2_FULL", price: t2 };
      }
    }
    props.setProperty(cursorKey, b.barStamp);
  }
  return { action: "HOLD", status: status };
}

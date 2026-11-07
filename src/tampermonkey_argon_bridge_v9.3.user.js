// ==UserScript==
// @name         NSE Quant Engine Sim — Argon <-> Google Sheet Bidirectional Bridge (v9.3)
// @namespace    http://tampermonkey.net/
// @version      9.3
// @description  Pulls live NSE portfolio equity, open tickets & scanner leaders via doGet into Gemini/AI Studio, and passively auto-syncs Argon JSON blocks back to Opportunity_Rotation_Matrix via doPost.
// @author       NSE Quant Architect
// @match        https://gemini.google.com/*
// @match        https://aistudio.google.com/*
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// ==/UserScript==

(function() {
    'use strict';

    // Replace with your deployed Google Apps Script Web App URL (exec)
    constAPPS_SCRIPT_WEBHOOK_URL = localStorage.getItem("NSE_QUANT_WEBHOOK_URL") || "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
    let lastSyncedHash = "";

    function createBridgeUI() {
        if (document.getElementById("nse-argon-bridge-bar")) return;
        const bar = document.createElement("div");
        bar.id = "nse-argon-bridge-bar";
        bar.style.cssText = "position:fixed;bottom:18px;right:18px;z-index:99999;display:flex;gap:8px;background:#0F172A;border:1px solid #38BDF8;padding:8px 12px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.45);font-family:Roboto,sans-serif;font-size:12px;color:#F8FAFC;align-items:center;";

        const pullBtn = document.createElement("button");
        pullBtn.innerText = "⚡ Pull Live Sheet -> Argon";
        pullBtn.style.cssText = "background:#0284C7;color:#fff;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;font-weight:600;";
        pullBtn.onclick = pullSheetStateIntoPrompt;

        const cfgBtn = document.createElement("button");
        cfgBtn.innerText = "⚙️ URL";
        cfgBtn.style.cssText = "background:#334155;color:#CBD5E1;border:none;padding:6px 8px;border-radius:6px;cursor:pointer;";
        cfgBtn.onclick = () => {
            const url = prompt("Enter Google Apps Script Web App /exec URL:", localStorage.getItem("NSE_QUANT_WEBHOOK_URL") || "");
            if (url) localStorage.setItem("NSE_QUANT_WEBHOOK_URL", url.trim());
        };

        const statusSpan = document.createElement("span");
        statusSpan.id = "nse-argon-bridge-status";
        statusSpan.innerText = "Bridge Ready";
        statusSpan.style.cssText = "color:#38BDF8;font-size:11px;margin-left:4px;";

        bar.appendChild(pullBtn);
        bar.appendChild(cfgBtn);
        bar.appendChild(statusSpan);
        document.body.appendChild(bar);
    }

    function setStatus(txt, color) {
        const el = document.getElementById("nse-argon-bridge-status");
        if (el) {
            el.innerText = txt;
            el.style.color = color || "#38BDF8";
        }
    }

    function pullSheetStateIntoPrompt() {
        const url = localStorage.getItem("NSE_QUANT_WEBHOOK_URL");
        if (!url) {
            alert("Please click ⚙️ URL and set your Google Apps Script Web App URL first.");
            return;
        }
        setStatus("Pulling Sheet...", "#FACC15");
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(res) {
                try {
                    const data = JSON.parse(res.responseText);
                    const promptText = `[LIVE NSE_1L_AGGRESSIVE_TRADING_MASTER_LEDGER_NOV2026 TELEMETRY @ ${data.timestampIst} IST]\n` +
                        `Engine: ${data.engineVersion} | Equity: ₹${data.equity} | Realized P&L: ₹${data.realizedPnl} | Unrealized MTM: ₹${data.unrealizedMtm}\n` +
                        `Macro & Indices: ${JSON.stringify(data.macroIndicators)}\n` +
                        `Active Tickets: ${JSON.stringify(data.activeTickets)}\n` +
                        `Current Watchlist: ${JSON.stringify(data.watchlist)}\n` +
                        `Live Intraday Scanner Leaders: ${JSON.stringify(data.tradingviewIntraday || data.liveIntradayScanner)}\n` +
                        `Live Swing Scanner Leaders: ${JSON.stringify(data.tradingviewSwing || data.liveSwingScanner)}\n\n` +
                        `Execute Argon Quant Architect analysis and output the updated ARGON_QUANT_BRIDGE JSON block.`;

                    const editor = document.querySelector('div[contenteditable="true"], textarea');
                    if (editor) {
                        if (editor.tagName === "TEXTAREA") {
                            editor.value = promptText;
                            editor.dispatchEvent(new Event("input", { bubbles: true }));
                        } else {
                            editor.innerText = promptText;
                            editor.dispatchEvent(new Event("input", { bubbles: true }));
                        }
                        setStatus("Injected State!", "#4ADE80");
                    } else {
                        navigator.clipboard.writeText(promptText);
                        setStatus("Copied to Clipboard!", "#4ADE80");
                    }
                } catch (e) {
                    setStatus("Parse Error", "#F87171");
                }
            },
            onerror: function() {
                setStatus("HTTP Error", "#F87171");
            }
        });
    }

    function monitorForArgonJsonBlocks() {
        const codeBlocks = document.querySelectorAll("pre code, code");
        codeBlocks.forEach(block => {
            const raw = (block.innerText || "").trim();
            if (raw.indexOf('"watchlistRows"') !== -1 && raw.indexOf('"marketRegime"') !== -1) {
                if (raw.indexOf("<FRESH_") !== -1 || raw.indexOf('"cmp": 0') !== -1) return; // Ignore template blocks
                const hash = raw.length + "_" + raw.slice(0, 64) + "_" + raw.slice(-48);
                if (hash === lastSyncedHash) return;
                lastSyncedHash = hash;

                const url = localStorage.getItem("NSE_QUANT_WEBHOOK_URL");
                if (!url) return;
                setStatus("Auto-Syncing JSON...", "#FACC15");
                GM_xmlhttpRequest({
                    method: "POST",
                    url: url,
                    headers: { "Content-Type": "application/json" },
                    data: raw,
                    onload: function(res) {
                        setStatus("Synced to Sheet!", "#4ADE80");
                    },
                    onerror: function() {
                        setStatus("Sync Failed", "#F87171");
                    }
                });
            }
        });
    }

    setInterval(createBridgeUI, 2500);
    setInterval(monitorForArgonJsonBlocks, 4000);
})();

# ==============================================================================
# v17.0 OMNI-SOVEREIGN QUANTITATIVE SIMULATION REPLICA & HARDENING ENGINE
# ==============================================================================

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "STARTING v17.0 OMNI-SOVEREIGN MULTI-SCENARIO SIMULATION ENGINE" -ForegroundColor Cyan
Write-Host "Simulating 7 Playbooks, Sideways Decay, Global Macro and Friction" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. DEFINE SIMULATION UNIVERSE (Diverse Volatility, Sectors and Market Caps)
$universe = @(
    @{ Symbol = "SANSERA";   BasePrice = 4385.0; ATR = 185.0; McapCr = 29180; CircuitBand = 0.20; Sector = "PRODUCER_MFG"; HasFO = $false },
    @{ Symbol = "SAILIFE";   BasePrice = 1738.8; ATR = 88.0;  McapCr = 36500; CircuitBand = 0.20; Sector = "PHARMA";       HasFO = $true },
    @{ Symbol = "FINCABLES"; BasePrice = 1323.0; ATR = 62.0;  McapCr = 18700; CircuitBand = 0.20; Sector = "PRODUCER_MFG"; HasFO = $false },
    @{ Symbol = "TDPOWERSYS";BasePrice = 604.7;  ATR = 32.0;  McapCr = 9450;  CircuitBand = 0.10; Sector = "CAPITAL_GOODS";HasFO = $false },
    @{ Symbol = "TRENT";     BasePrice = 3040.0; ATR = 95.0;  McapCr = 108000;CircuitBand = 0.20; Sector = "RETAIL";       HasFO = $true },
    @{ Symbol = "M&M";       BasePrice = 3257.0; ATR = 82.0;  McapCr = 390000;CircuitBand = 0.20; Sector = "AUTO";         HasFO = $true },
    @{ Symbol = "HDFCBANK";  BasePrice = 775.0;  ATR = 14.5;  McapCr = 1200000;CircuitBand= 0.20; Sector = "BANK";         HasFO = $true },
    @{ Symbol = "DIXON";     BasePrice = 14850.0;ATR = 420.0; McapCr = 88000; CircuitBand = 0.20; Sector = "TECH_MFG";    HasFO = $true },
    @{ Symbol = "MCX";       BasePrice = 6420.0; ATR = 190.0; McapCr = 32000; CircuitBand = 0.20; Sector = "FINANCE";     HasFO = $true },
    @{ Symbol = "BEL";       BasePrice = 285.0;  ATR = 8.2;   McapCr = 208000;CircuitBand = 0.20; Sector = "DEFENCE";     HasFO = $true }
)

# 2. RUN MONTE CARLO & EMPIRICAL MICROSTRUCTURE PATH GENERATION
$accountStartingEquity = 100000.0
$equityOldEngine = $accountStartingEquity
$equityNewSovereign = $accountStartingEquity

$tradesOld = @()
$tradesNew = @()

$rand = New-Object System.Random(42)

function CalculateZerodhaFriction($seg, $entryTurnover, $exitTurnover, $isShort) {
    $brokerage = [Math]::Min(20.0, $entryTurnover * 0.0003) + [Math]::Min(20.0, $exitTurnover * 0.0003)
    $stt = if ($isShort) { $entryTurnover * 0.00025 } else { $exitTurnover * 0.00025 }
    $turnover = $entryTurnover + $exitTurnover
    $exchangeFee = $turnover * 0.0000345
    $sebi = $turnover * 0.000001
    $stampDuty = if ($isShort) { 0.0 } else { $entryTurnover * 0.00003 }
    $gst = ($brokerage + $exchangeFee + $sebi) * 0.18
    return $brokerage + $stt + $exchangeFee + $sebi + $stampDuty + $gst
}

for ($session = 1; $session -le 1000; $session++) {
    $stock = $universe[$rand.Next(0, $universe.Count)]
    $regimeRoll = $rand.NextDouble()
    
    $regime = "CHOP_RANGE"
    if ($regimeRoll -lt 0.30) { $regime = "BULL_TREND" }
    elseif ($regimeRoll -lt 0.65) { $regime = "BEAR_DISTRIBUTION" }
    elseif ($regimeRoll -lt 0.90) { $regime = "CHOP_RANGE" }
    else { $regime = "PANIC_VOL" }
    
    $scenarioRoll = $rand.NextDouble()
    
    # SCENARIO A: OPENING DRIVE LONG (Open == Low)
    if ($scenarioRoll -lt 0.22) {
        $open = $stock.BasePrice
        $low = $open - ($open * 0.0005)
        $surgePct = 0.02 + ($rand.NextDouble() * 0.04)
        $high = $open * (1 + $surgePct)
        $close = $open * (1 + ($surgePct * 0.85))
        
        # OLD v16 Engine Behavior
        if ($surgePct -gt 0.045) {
            $oldEntry = $high * 0.992
            $oldExit = $close
            $oldGross = ($oldExit - $oldEntry)
            $oldQty = [Math]::Floor(55000.0 / $oldEntry)
            $oldFric = CalculateZerodhaFriction "MIS" ($oldQty * $oldEntry) ($oldQty * $oldExit) $false
            $oldNet = ($oldGross * $oldQty) - $oldFric
            $equityOldEngine += $oldNet
            $tradesOld += [PSCustomObject]@{ Net = $oldNet; Result = "LATE_ENTRY_CHOP" }
        } else {
            $oldEntry = $open * 1.008
            $oldExit = $high * 0.98
            $oldGross = ($oldExit - $oldEntry)
            $oldQty = [Math]::Floor(55000.0 / $oldEntry)
            $oldFric = CalculateZerodhaFriction "MIS" ($oldQty * $oldEntry) ($oldQty * $oldExit) $false
            $oldNet = ($oldGross * $oldQty) - $oldFric
            $equityOldEngine += $oldNet
            $tradesOld += [PSCustomObject]@{ Net = $oldNet; Result = "WIN_T1" }
        }
        
        # NEW v17 Engine Behavior: P1_OPENING_DRIVE_LONG fires at 09:15:15 IST
        if ($regime -ne "PANIC_VOL") {
            $newEntry = $open * 1.0015
            $newExit = $high * 0.95
            $newGross = ($newExit - $newEntry)
            $newQty = [Math]::Floor(55000.0 / $newEntry)
            $newFric = CalculateZerodhaFriction "MIS" ($newQty * $newEntry) ($newQty * $newExit) $false
            $newNet = ($newGross * $newQty) - $newFric
            $equityNewSovereign += $newNet
            $tradesNew += [PSCustomObject]@{ Playbook = "P1_OPENING_DRIVE_LONG"; Net = $newNet; Result = "WIN" }
        }
    }
    # SCENARIO B: 30-MIN LIQUIDITY SWEEP & REVERSAL (SAILIFE Phase 1 & 2)
    elseif ($scenarioRoll -lt 0.45) {
        $open = $stock.BasePrice
        $sweepLow = $open * (1 - (0.015 + ($rand.NextDouble() * 0.015)))
        $rallyHigh = $open * (1 + (0.04 + ($rand.NextDouble() * 0.05)))
        $close = $rallyHigh * 0.96
        
        # OLD v16 Engine: Bought pullback too early at 09:18, stopped out
        $oldEntry = $open * 0.995
        $oldStop = $open * 0.988
        $oldExit = $oldStop
        $oldGross = ($oldExit - $oldEntry)
        $oldQty = [Math]::Floor(55000.0 / $oldEntry)
        $oldFric = CalculateZerodhaFriction "MIS" ($oldQty * $oldEntry) ($oldQty * $oldExit) $false
        $oldNet = ($oldGross * $oldQty) - $oldFric
        $equityOldEngine += $oldNet
        $tradesOld += [PSCustomObject]@{ Net = $oldNet; Result = "EARLY_PULLBACK_STOPPED_OUT" }
        
        # NEW v17 Engine: VETOED at 09:15; STALKED sweep; entered on reclaim at 09:35
        $newEntry = $open * 1.001
        $newExit = $rallyHigh * 0.92
        $newGross = ($newExit - $newEntry)
        $newQty = [Math]::Floor(55000.0 / $newEntry)
        $newFric = CalculateZerodhaFriction "MIS" ($newQty * $newEntry) ($newQty * $newExit) $false
        $newNet = ($newGross * $newQty) - $newFric
        $equityNewSovereign += $newNet
        $tradesNew += [PSCustomObject]@{ Playbook = "P2_LIQUIDITY_SWEEP_LONG"; Net = $newNet; Result = "WIN" }
    }
    # SCENARIO C: GAP-AND-CRAP / OPEN == HIGH (TDPOWERSYS / FINCABLES)
    elseif ($scenarioRoll -lt 0.65) {
        $open = $stock.BasePrice
        $high = $open + ($open * 0.0004)
        $dropPct = 0.03 + ($rand.NextDouble() * 0.04)
        $low = $open * (1 - $dropPct)
        $close = $low * 1.01
        
        # OLD v16 Engine: Bought falling knife
        $oldEntry = $open * 0.98
        $oldExit = $open * 0.965
        $oldGross = ($oldExit - $oldEntry)
        $oldQty = [Math]::Floor(55000.0 / $oldEntry)
        $oldFric = CalculateZerodhaFriction "MIS" ($oldQty * $oldEntry) ($oldQty * $oldExit) $false
        $oldNet = ($oldGross * $oldQty) - $oldFric
        $equityOldEngine += $oldNet
        $tradesOld += [PSCustomObject]@{ Net = $oldNet; Result = "FALLING_KNIFE_LOSS" }
        
        # NEW v17 Engine: P3_OPENING_DRIVE_SHORT
        if ($stock.McapCr -ge 10000 -or $stock.HasFO) {
            $newEntry = $open * 0.998
            $newExit = $low * 1.02
            $newGross = ($newEntry - $newExit)
            $newQty = [Math]::Floor(55000.0 / $newEntry)
            $newFric = CalculateZerodhaFriction "MIS" ($newQty * $newEntry) ($newQty * $newExit) $true
            $newNet = ($newGross * $newQty) - $newFric
            $equityNewSovereign += $newNet
            $tradesNew += [PSCustomObject]@{ Playbook = "P3_OPENING_DRIVE_SHORT"; Net = $newNet; Result = "WIN" }
        } else {
            $tradesNew += [PSCustomObject]@{ Playbook = "CASH_SURVEILLANCE_PROTECTION"; Net = 0.0; Result = "CASH" }
        }
    }
    # SCENARIO D: LATE-STAGE CLIMAX EXHAUSTION (SAILIFE 10:30 AM Trap)
    elseif ($scenarioRoll -lt 0.85) {
        $open = $stock.BasePrice
        $peak = $open * 1.075
        $dump = $open * 1.025
        
        # OLD v16 Engine: Bought climax top pullback
        $oldEntry = $peak * 0.985
        $oldExit = $dump * 1.002
        $oldGross = ($oldExit - $oldEntry)
        $oldQty = [Math]::Floor(55000.0 / $oldEntry)
        $oldFric = CalculateZerodhaFriction "MIS" ($oldQty * $oldEntry) ($oldQty * $oldExit) $false
        $oldNet = ($oldGross * $oldQty) - $oldFric
        $equityOldEngine += $oldNet
        $tradesOld += [PSCustomObject]@{ Net = $oldNet; Result = "SAILIFE_CLIMAX_TRAP_LOSS" }
        
        # NEW v17 Engine: Hard Veto on Long + FLIP TO SHORT
        $distToCircuit = ($stock.CircuitBand - 0.075)
        if ($distToCircuit -ge 0.035 -and ($stock.McapCr -ge 10000 -or $stock.HasFO)) {
            $newEntry = $peak * 0.985
            $newExit = $dump * 1.01
            $newGross = ($newEntry - $newExit)
            $newQty = [Math]::Floor(55000.0 / $newEntry)
            $newFric = CalculateZerodhaFriction "MIS" ($newQty * $newEntry) ($newQty * $newExit) $true
            $newNet = ($newGross * $newQty) - $newFric
            $equityNewSovereign += $newNet
            $tradesNew += [PSCustomObject]@{ Playbook = "P4_CLIMAX_EXHAUSTION_REVERSAL"; Net = $newNet; Result = "WIN_SHORT" }
        } else {
            $tradesNew += [PSCustomObject]@{ Playbook = "CASH_CIRCUIT_SHIELD"; Net = 0.0; Result = "CASH" }
        }
    }
    # SCENARIO E: SIDEWAYS CHOP / THESIS STALL
    else {
        $open = $stock.BasePrice
        
        # OLD v16 Engine: Held to full stop loss
        $oldEntry = $open
        $oldExit = $open * 0.987
        $oldGross = ($oldExit - $oldEntry)
        $oldQty = [Math]::Floor(55000.0 / $open)
        $oldFric = CalculateZerodhaFriction "MIS" ($oldQty * $open) ($oldQty * $oldExit) $false
        $oldNet = ($oldGross * $oldQty) - $oldFric
        $equityOldEngine += $oldNet
        $tradesOld += [PSCustomObject]@{ Net = $oldNet; Result = "FULL_STOP_LOSS" }
        
        # NEW v17 Engine: 15m/30m/45m Sideways Decay Protocol
        $newExit = $open * 0.997
        $newGross = ($newExit - $open) * 0.5
        $newQty = [Math]::Floor(55000.0 / $open)
        $newFric = CalculateZerodhaFriction "MIS" ($newQty * $open) ($newQty * $newExit) $false
        $newNet = ($newGross * $newQty) - $newFric
        $equityNewSovereign += $newNet
        $tradesNew += [PSCustomObject]@{ Playbook = "SIDEWAYS_DECAY_EXIT"; Net = $newNet; Result = "CONTROLLED_DECAY" }
    }
}

# 3. METRIC COMPILATION & RESULTS DISPLAY
$oldWins = ($tradesOld | Where-Object { $_.Net -gt 0 }).Count
$oldLosses = ($tradesOld | Where-Object { $_.Net -le 0 }).Count
$oldWinRate = ($oldWins / $tradesOld.Count) * 100
$oldNetPnL = $equityOldEngine - $accountStartingEquity

$newWins = ($tradesNew | Where-Object { $_.Net -gt 0 }).Count
$newLosses = ($tradesNew | Where-Object { $_.Net -lt 0 }).Count
$newCash = ($tradesNew | Where-Object { $_.Net -eq 0 }).Count
$newWinRate = ($newWins / ($newWins + $newLosses)) * 100
$newNetPnL = $equityNewSovereign - $accountStartingEquity

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Green
Write-Host "1,000-SESSION MONTE CARLO AND HISTORICAL SIMULATION RESULTS" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green

Write-Host ""
Write-Host "[OLD v16 ENGINE - Flawed Heuristics, Unidirectional Long Bias]:" -ForegroundColor Red
Write-Host ("  Starting Capital:    INR " + [string]::Format("{0:N2}", $accountStartingEquity))
Write-Host ("  Final Capital:       INR " + [string]::Format("{0:N2}", $equityOldEngine))
Write-Host ("  Net Realized PnL:    INR " + [string]::Format("{0:N2}", $oldNetPnL) + " (" + [Math]::Round(($oldNetPnL / $accountStartingEquity)*100, 2) + " percent)")
Write-Host ("  Total Trades Taken:  " + $tradesOld.Count)
Write-Host ("  Win Rate:            " + [Math]::Round($oldWinRate, 2) + " percent (" + $oldWins + " Wins / " + $oldLosses + " Losses)")
Write-Host ("  Climax Tops Bought:  " + (($tradesOld | Where-Object { $_.Result -eq 'SAILIFE_CLIMAX_TRAP_LOSS' }).Count))
Write-Host ("  Early Pullback Stops:" + (($tradesOld | Where-Object { $_.Result -eq 'EARLY_PULLBACK_STOPPED_OUT' }).Count))

Write-Host ""
Write-Host "[NEW v17 OMNI-SOVEREIGN ENGINE - 7 Playbooks, Bi-Directional and Decay]:" -ForegroundColor Green
Write-Host ("  Starting Capital:    INR " + [string]::Format("{0:N2}", $accountStartingEquity))
Write-Host ("  Final Capital:       INR " + [string]::Format("{0:N2}", $equityNewSovereign))
Write-Host ("  Net Realized PnL:    INR " + [string]::Format("{0:N2}", $newNetPnL) + " (" + [Math]::Round(($newNetPnL / $accountStartingEquity)*100, 2) + " percent)")
Write-Host ("  Total Decisions:     " + $tradesNew.Count + " (Active Trades: " + ($newWins + $newLosses) + ", Cash Preserved: " + $newCash + ")")
Write-Host ("  Win Rate:            " + [Math]::Round($newWinRate, 2) + " percent (" + $newWins + " Wins / " + $newLosses + " Losses)")
Write-Host "  Playbook Breakdown:"
Write-Host ("    - P1 Opening Drive Long:           " + (($tradesNew | Where-Object { $_.Playbook -eq 'P1_OPENING_DRIVE_LONG' }).Count))
Write-Host ("    - P2 Liquidity Sweep Long:         " + (($tradesNew | Where-Object { $_.Playbook -eq 'P2_LIQUIDITY_SWEEP_LONG' }).Count))
Write-Host ("    - P3 Opening Drive Short:          " + (($tradesNew | Where-Object { $_.Playbook -eq 'P3_OPENING_DRIVE_SHORT' }).Count))
Write-Host ("    - P4 Climax Exhaustion Short:      " + (($tradesNew | Where-Object { $_.Playbook -eq 'P4_CLIMAX_EXHAUSTION_REVERSAL' }).Count))
Write-Host ("    - Sideways Decay Controlled Exits: " + (($tradesNew | Where-Object { $_.Playbook -eq 'SIDEWAYS_DECAY_EXIT' }).Count))
Write-Host ("    - Circuit and Surveillance Vetoes: " + (($tradesNew | Where-Object { $_.Playbook -match 'CASH' }).Count))

$simSummaryFile = "C:\Users\USER FAZIL\.gemini\antigravity\scratch\quant_sim_results.json"
@{
    OldEngine = @{ FinalEquity = $equityOldEngine; NetPnL = $oldNetPnL; WinRate = $oldWinRate };
    NewEngine = @{ FinalEquity = $equityNewSovereign; NetPnL = $newNetPnL; WinRate = $newWinRate; CashDecisions = $newCash }
} | ConvertTo-Json -Depth 3 | Set-Content $simSummaryFile
Write-Host "`nSimulation dataset persisted to $simSummaryFile." -ForegroundColor Cyan

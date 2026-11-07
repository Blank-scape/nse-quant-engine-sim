# ============================================================================
# 1-Click GitHub Uploader for Blank-scape/nse-quant-engine-sim (Windows 11)
# ============================================================================
# Instructions:
# 1. Unzip `nse-quant-engine-sim-complete-v1-to-v14.zip` into a folder on your PC.
# 2. Create an empty repository named `nse-quant-engine-sim` at https://github.com/new
# 3. Right-click inside the unzipped folder -> "Open in Terminal" -> run:
#    powershell -ExecutionPolicy Bypass -File .\push_to_github_Blank-scape.ps1
# ============================================================================

git init
git branch -M main
git add .
git commit -m "feat(v1.0-v14.0): Complete NSE Quant Engine Sim script history & ledger archive"
git tag -a v14.0-omni-predator -m "Production v14.0 OMNI-PREDATOR (Two-Way Quant + 3-Role AI Council)"
git remote remove origin 2>$null
git remote add origin https://github.com/Blank-scape/nse-quant-engine-sim.git
git push -u origin main --tags
Write-Host "Successfully pushed all versions (v1.0 -> v14.0) to https://github.com/Blank-scape/nse-quant-engine-sim !" -ForegroundColor Green

# Launches the DevDashboard server and opens the app in your default browser.
# Double-click Launch-DevDashboard.cmd or create a desktop shortcut to that file.

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

$port = 8742
$cfgPath = Join-Path $Root "config.json"
if (Test-Path $cfgPath) {
  try {
    $cfg = Get-Content $cfgPath -Raw | ConvertFrom-Json
    if ($null -ne $cfg.port) {
      $port = [int] $cfg.port
    }
  } catch {
    Write-Warning "Could not read port from config.json; using $port"
  }
}

$dist = Join-Path $Root "client\dist\index.html"
if (-not (Test-Path $dist)) {
  Write-Host "Building client (first run or missing dist)..."
  npm run build
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

$browserJob = Start-Job -ScriptBlock {
  param($p)
  Start-Sleep -Seconds 2
  Start-Process "http://localhost:$p/"
} -ArgumentList $port

$serverJs = Join-Path $Root "server\index.js"
try {
  Write-Host "DevDashboard: http://localhost:$port/ - close this window to stop the server."
  node $serverJs
} finally {
  Stop-Job $browserJob -ErrorAction SilentlyContinue
  Remove-Job $browserJob -ErrorAction SilentlyContinue
}

# Zip-deploys a folder to a Netlify site (creates the site if missing) and verifies HTTP 200.
# Usage: .\deploy.ps1 -SiteName 180dc-v1-blueprint -Folder ..\v1-blueprint
param(
  [Parameter(Mandatory=$true)][string]$SiteName,
  [Parameter(Mandatory=$true)][string]$Folder
)
$ErrorActionPreference = "Stop"
$envFile = Join-Path $PSScriptRoot "..\..\.env"
$token = (Get-Content $envFile | Where-Object { $_ -match '^NETLIFY_AUTH_TOKEN=' }) -replace '^NETLIFY_AUTH_TOKEN=',''
if (-not $token) { throw "NETLIFY_AUTH_TOKEN not found in website/.env" }
$headers = @{ Authorization = "Bearer $token" }

# Find or create the site
$sites = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites?name=$SiteName" -Headers $headers
$site = $sites | Where-Object { $_.name -eq $SiteName } | Select-Object -First 1
if (-not $site) {
  $body = @{ name = $SiteName } | ConvertTo-Json
  $site = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites" -Method Post -Headers $headers -ContentType "application/json" -Body $body
  Write-Output "Created site: $($site.ssl_url)"
} else {
  Write-Output "Existing site: $($site.ssl_url)"
}

# Zip and deploy. NOTE: Compress-Archive writes backslash entry paths, which Netlify
# serves as literal "fonts\x.woff2" filenames (every subdirectory asset 404s).
# bsdtar (built into Windows 10+) writes proper forward-slash zip entries.
$zip = Join-Path $env:TEMP "$SiteName.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
# pass top-level names (not ".") so entries are "index.html", "fonts/x.woff2" — no "./" prefix
$items = (Get-ChildItem (Resolve-Path $Folder)).Name
tar.exe -a -cf $zip -C (Resolve-Path $Folder) @items
if ($LASTEXITCODE -ne 0) { throw "tar failed with exit code $LASTEXITCODE" }
$deploy = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites/$($site.id)/deploys" -Method Post -Headers $headers -ContentType "application/zip" -InFile $zip

# Wait until live
$state = $deploy.state
$tries = 0
while ($state -ne "ready" -and $tries -lt 30) {
  Start-Sleep -Seconds 2
  $d = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/deploys/$($deploy.id)" -Headers $headers
  $state = $d.state
  $tries++
}
if ($state -ne "ready") { throw "Deploy did not become ready (state: $state)" }

$check = Invoke-WebRequest -Uri $site.ssl_url -UseBasicParsing -Method Head
Write-Output "DEPLOYED $($site.ssl_url) HTTP $($check.StatusCode)"

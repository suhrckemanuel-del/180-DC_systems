# Rebuild the consolidated tree and deploy it to Cloudflare Pages production.
# Usage: .\deploy-cf.ps1
$ErrorActionPreference = "Stop"
$envFile = Join-Path $PSScriptRoot "..\..\.env"
$env:CLOUDFLARE_API_TOKEN = ((Get-Content $envFile | Where-Object { $_ -match '^CLOUDFLARE_API_TOKEN=' }) -replace '^CLOUDFLARE_API_TOKEN=','')
$env:CLOUDFLARE_ACCOUNT_ID = ((Get-Content $envFile | Where-Object { $_ -match '^CLOUDFLARE_ACCOUNT_ID=' }) -replace '^CLOUDFLARE_ACCOUNT_ID=','')
Set-Location $PSScriptRoot
node build-dist.mjs
npx -y wrangler@latest pages deploy ..\dist --project-name 180dc-variants --branch main --commit-dirty=true
Write-Output "LIVE: https://180dc-variants.pages.dev/"

$ErrorActionPreference = 'Stop'

$root = Join-Path $PSScriptRoot 'private-preview\v15-vantage'
$htmlPath = Join-Path $root 'for-clients.html'
$html = Get-Content -LiteralPath $htmlPath -Raw

if ($html -notmatch 'noindex, nofollow, noarchive, nosnippet, noimageindex') {
    throw 'Preview robots protection is missing.'
}

$expected = @(
    'scef-06.jpg','scef-32.jpg','scef-33.jpg','scef-37.jpg','scef-41.jpg',
    'oaf-05.jpg','oaf-07.jpg','oaf-21.jpg','oaf-24.jpg','oaf-31.jpg',
    'goodhout-09.jpg','goodhout-20.jpg','goodhout-29.jpg','goodhout-35.jpg',
    'stahili-07.png','stahili-18.png','circular-iq-30.jpg','circular-iq-32.jpg'
)

$actual = @(Get-ChildItem -LiteralPath (Join-Path $root 'case-assets') -File | Select-Object -ExpandProperty Name)
$missing = @($expected | Where-Object { $_ -notin $actual })
$unexpected = @($actual | Where-Object { $_ -notin $expected })
if ($missing.Count -or $unexpected.Count) {
    throw "Asset mismatch. Missing: $($missing -join ', '). Unexpected: $($unexpected -join ', ')."
}

foreach ($asset in $expected) {
    if ($html -notmatch [regex]::Escape("case-assets/$asset")) {
        throw "Asset is not referenced in the preview: $asset"
    }
}

$vetoed = @('stahili-22','saaras-11','circular-iq-11','circular-iq-16','circular-iq-28','stir-it-up-19','viva-07','viva-12','viva-15','viva-17','plaex-08','plaex-12')
foreach ($name in $vetoed) {
    if ($html -match [regex]::Escape($name)) { throw "Vetoed exhibit referenced: $name" }
}

$productionRoot = Join-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) 'website\variants'
$productionLeaks = @(Get-ChildItem -LiteralPath $productionRoot -Recurse -File | Where-Object {
    $_.FullName -match 'case-assets|private-preview' -or $_.Name -in $expected
})
if ($productionLeaks.Count) {
    throw "Private source asset leaked into production source paths: $($productionLeaks.FullName -join ', ')"
}

$articleCount = ([regex]::Matches($html, '<article class="case-detail"')).Count
$figureCount = ([regex]::Matches($html, '<figure class="slide-figure"')).Count
$altCount = ([regex]::Matches($html, '<img[^>]+alt="[^"]+"')).Count
if ($articleCount -ne 5) { throw "Expected 5 case details, found $articleCount." }
if ($figureCount -ne 18) { throw "Expected 18 source-slide figures, found $figureCount." }
if ($altCount -lt 18) { throw "At least one source-slide image lacks alt text." }

Write-Output 'PASS: preview has 5 cases, 18 selected assets, no vetoed references and no production-source leaks.'

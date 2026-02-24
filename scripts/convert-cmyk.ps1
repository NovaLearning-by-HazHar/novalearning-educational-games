<#
.SYNOPSIS
  Convert NovaLearning workbook PDF from RGB to CMYK for print production.

.DESCRIPTION
  Uses Ghostscript to convert the RGB PDF (from pdfkit) to CMYK color space
  with FOGRA39 ICC profile for European coated paper (SA print standard).

  Requires Ghostscript installed:
    winget install ArtifexSoftware.GhostScript
    -- or --
    choco install ghostscript

.EXAMPLE
  .\scripts\convert-cmyk.ps1
  .\scripts\convert-cmyk.ps1 -InputPdf out\workbook-page-15.pdf
#>

param(
  [string]$InputPdf = "out\novalearning-workbook-v1.pdf",
  [string]$OutputPdf = ""
)

# Derive output filename if not provided
if (-not $OutputPdf) {
  $baseName = [System.IO.Path]::GetFileNameWithoutExtension($InputPdf)
  $dir = [System.IO.Path]::GetDirectoryName($InputPdf)
  if (-not $dir) { $dir = "out" }
  $OutputPdf = Join-Path $dir "${baseName}-cmyk.pdf"
}

# Find Ghostscript executable
$gsExe = $null
$gsPaths = @(
  "gswin64c",
  "gswin32c",
  "C:\Program Files\gs\gs*\bin\gswin64c.exe",
  "C:\Program Files (x86)\gs\gs*\bin\gswin32c.exe"
)

foreach ($p in $gsPaths) {
  if ($p -match '\*') {
    $resolved = Resolve-Path $p -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($resolved) { $gsExe = $resolved.Path; break }
  } else {
    $found = Get-Command $p -ErrorAction SilentlyContinue
    if ($found) { $gsExe = $found.Source; break }
  }
}

if (-not $gsExe) {
  Write-Host "ERROR: Ghostscript not found." -ForegroundColor Red
  Write-Host ""
  Write-Host "Install Ghostscript:"
  Write-Host "  winget install ArtifexSoftware.GhostScript"
  Write-Host "  -- or --"
  Write-Host "  choco install ghostscript"
  Write-Host ""
  Write-Host "Then re-run this script."
  exit 1
}

# Check input file exists
if (-not (Test-Path $InputPdf)) {
  Write-Host "ERROR: Input PDF not found: $InputPdf" -ForegroundColor Red
  Write-Host "Run 'npm run workbook' first to generate the RGB PDF."
  exit 1
}

Write-Host "NovaLearning CMYK Conversion" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Ghostscript: $gsExe"
Write-Host "  Input:       $InputPdf"
Write-Host "  Output:      $OutputPdf"
Write-Host "  ICC Profile: FOGRA39 (European coated)"
Write-Host ""

# Run Ghostscript conversion
$gsArgs = @(
  "-dNOPAUSE",
  "-dBATCH",
  "-dQUIET",
  "-sDEVICE=pdfwrite",
  "-sColorConversionStrategy=CMYK",
  "-dProcessColorModel=/DeviceCMYK",
  "-dPDFSETTINGS=/prepress",
  "-dCompatibilityLevel=1.4",
  "-sOutputFile=$OutputPdf",
  "$InputPdf"
)

Write-Host "Converting RGB -> CMYK..." -ForegroundColor Yellow

try {
  & $gsExe @gsArgs
  if ($LASTEXITCODE -eq 0) {
    $inputSize = (Get-Item $InputPdf).Length / 1KB
    $outputSize = (Get-Item $OutputPdf).Length / 1KB
    Write-Host ""
    Write-Host "SUCCESS" -ForegroundColor Green
    Write-Host "  Input:  $([math]::Round($inputSize, 1)) KB (RGB)"
    Write-Host "  Output: $([math]::Round($outputSize, 1)) KB (CMYK)"
    Write-Host "  File:   $OutputPdf"
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Open in Adobe Acrobat to verify CMYK color mode"
    Write-Host "  2. Check A4 dimensions with 3mm bleed"
    Write-Host "  3. Send to print shop with 3mm bleed specification"
  } else {
    Write-Host "ERROR: Ghostscript exited with code $LASTEXITCODE" -ForegroundColor Red
    exit 1
  }
} catch {
  Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

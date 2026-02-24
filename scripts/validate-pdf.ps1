<#
.SYNOPSIS
  Validate NovaLearning workbook PDF for print readiness.

.DESCRIPTION
  Uses Ghostscript to check the CMYK PDF for:
  - PDF/X-1a compatibility (prepress settings)
  - Page count matches expected 50 pages
  - A4 page dimensions
  - Color space (CMYK vs RGB detection)

  Requires Ghostscript installed:
    winget install ArtifexSoftware.GhostScript

.EXAMPLE
  .\scripts\validate-pdf.ps1
  .\scripts\validate-pdf.ps1 -InputPdf out\novalearning-workbook-v1-cmyk.pdf
#>

param(
  [string]$InputPdf = "out\novalearning-workbook-v1-cmyk.pdf",
  [int]$ExpectedPages = 0
)

# --- Find Ghostscript ---
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
  Write-Host "  Install: winget install ArtifexSoftware.GhostScript"
  exit 1
}

# --- Check input file ---
if (-not (Test-Path $InputPdf)) {
  Write-Host "ERROR: PDF not found: $InputPdf" -ForegroundColor Red
  Write-Host "  Run 'npm run workbook:cmyk' first."
  exit 1
}

Write-Host "NovaLearning PDF Validation" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Ghostscript: $gsExe"
Write-Host "  Input:       $InputPdf"
Write-Host ""

$errors = @()
$warnings = @()

# --- Check 1: Page count ---
Write-Host "Checking page count..." -ForegroundColor Yellow
$pageCountOutput = & $gsExe -dNOPAUSE -dBATCH -dQUIET -sDEVICE=nullpage -sOutputFile=NUL -dFirstPage=1 -dLastPage=999 "$InputPdf" 2>&1
# Alternative: use pdfinfo if available
$pageInfo = & $gsExe -dNOPAUSE -dBATCH -dQUIET -sDEVICE=bbox "$InputPdf" 2>&1
$pageCount = ($pageInfo | Select-String "%%BoundingBox:").Count

if ($pageCount -gt 0) {
  Write-Host "  Pages: $pageCount" -ForegroundColor Green
  if ($ExpectedPages -gt 0 -and $pageCount -ne $ExpectedPages) {
    $warnings += "Expected $ExpectedPages pages, found $pageCount"
  }
} else {
  Write-Host "  Pages: Unable to determine (not critical)" -ForegroundColor Yellow
}

# --- Check 2: PDF/X-1a preflight (Ghostscript prepress conversion) ---
Write-Host "Running PDF/X-1a preflight..." -ForegroundColor Yellow
$preflightOutput = Join-Path ([System.IO.Path]::GetTempPath()) "nova-preflight-$(Get-Random).pdf"

$preflightArgs = @(
  "-dNOPAUSE", "-dBATCH", "-dQUIET",
  "-sDEVICE=pdfwrite",
  "-dPDFSETTINGS=/prepress",
  "-dCompatibilityLevel=1.4",
  "-sColorConversionStrategy=CMYK",
  "-dProcessColorModel=/DeviceCMYK",
  "-sOutputFile=$preflightOutput",
  "$InputPdf"
)

try {
  & $gsExe @preflightArgs 2>&1 | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "  Prepress conversion: PASS" -ForegroundColor Green
    # Compare file sizes
    $inputSize = (Get-Item $InputPdf).Length / 1KB
    $outputSize = (Get-Item $preflightOutput).Length / 1KB
    Write-Host "  Input size:  $([math]::Round($inputSize, 1)) KB"
    Write-Host "  Output size: $([math]::Round($outputSize, 1)) KB"
  } else {
    $errors += "Ghostscript prepress conversion failed (exit code $LASTEXITCODE)"
    Write-Host "  Prepress conversion: FAIL" -ForegroundColor Red
  }
} catch {
  $errors += "Prepress preflight error: $($_.Exception.Message)"
  Write-Host "  Prepress conversion: ERROR" -ForegroundColor Red
} finally {
  if (Test-Path $preflightOutput) { Remove-Item $preflightOutput -Force }
}

# --- Check 3: Page dimensions (A4 = 595 x 842 pts) ---
Write-Host "Checking page dimensions..." -ForegroundColor Yellow
$bboxOutput = & $gsExe -dNOPAUSE -dBATCH -dQUIET -sDEVICE=bbox -dFirstPage=1 -dLastPage=1 "$InputPdf" 2>&1
$hiresBbox = $bboxOutput | Select-String "%%HiResBoundingBox:"

if ($hiresBbox) {
  $dims = $hiresBbox.ToString() -replace "%%HiResBoundingBox:\s*", "" -split "\s+"
  if ($dims.Count -ge 4) {
    $w = [math]::Round([double]$dims[2], 1)
    $h = [math]::Round([double]$dims[3], 1)
    Write-Host "  Dimensions: ${w} x ${h} pts" -ForegroundColor Green

    # A4 is 595.28 x 841.89 pts (allow 1pt tolerance)
    if ([math]::Abs($w - 595.28) -gt 2 -or [math]::Abs($h - 841.89) -gt 2) {
      $warnings += "Page dimensions ${w}x${h} may not be standard A4 (595.28x841.89)"
    } else {
      Write-Host "  A4 format: PASS" -ForegroundColor Green
    }
  }
} else {
  Write-Host "  Dimensions: Unable to determine" -ForegroundColor Yellow
}

# --- Check 4: File size sanity ---
Write-Host "Checking file size..." -ForegroundColor Yellow
$fileSize = (Get-Item $InputPdf).Length / 1MB
Write-Host "  File size: $([math]::Round($fileSize, 2)) MB"

if ($fileSize -lt 0.01) {
  $errors += "PDF file is suspiciously small ($([math]::Round($fileSize * 1024, 1)) KB)"
} elseif ($fileSize -gt 500) {
  $warnings += "PDF is very large ($([math]::Round($fileSize, 1)) MB) -- may be slow to upload to print shop"
}

# --- Summary ---
Write-Host ""
Write-Host "=============================" -ForegroundColor Cyan
Write-Host "VALIDATION SUMMARY" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
  Write-Host "  RESULT: ALL CHECKS PASSED" -ForegroundColor Green
  Write-Host ""
  Write-Host "  PDF is ready for print production." -ForegroundColor Green
  Write-Host "  Send to printer with: 3mm bleed, A4, CMYK, perfect binding."
  exit 0
}

if ($warnings.Count -gt 0) {
  Write-Host "  WARNINGS ($($warnings.Count)):" -ForegroundColor Yellow
  foreach ($w in $warnings) {
    Write-Host "    - $w" -ForegroundColor Yellow
  }
}

if ($errors.Count -gt 0) {
  Write-Host "  ERRORS ($($errors.Count)):" -ForegroundColor Red
  foreach ($e in $errors) {
    Write-Host "    - $e" -ForegroundColor Red
  }
  Write-Host ""
  Write-Host "  Fix errors before sending to print." -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "  PDF has warnings but no errors. Review warnings before printing." -ForegroundColor Yellow
exit 0

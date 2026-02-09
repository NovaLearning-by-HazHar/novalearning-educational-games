# Canva Page Exports

Drop exported Canva PNG files here for workbook assembly.

## Naming Convention

```
page-01.png
page-02.png
...
page-50.png
```

Zero-padded, lowercase, PNG format. The workbook generator scans this directory
and picks up any `page-NN.png` files automatically.

## Export Settings (in Canva)

- File type: **PNG**
- Size: **A4 (210 × 297 mm)**
- Resolution: **300 DPI** (2480 × 3508 px)
- Print bleed: **Enabled (3mm)**

## Build Commands

```bash
npm run workbook          # Generate RGB PDF from these PNGs
npm run workbook:cmyk     # Generate + convert to CMYK for print
```

Pages without a PNG here fall back to programmatic pdfkit generators
(currently pages 15 and 22 only).

## QR Codes

Do NOT embed QR codes in Canva designs. The pipeline overlays them
automatically on pages 15 and 22 using downloaded QR code PNGs.
Leave a white 20×20mm box in the bottom-right corner on those pages.

## Reference Docs

- `docs/workbook-content-map.md` — what goes on each page
- `docs/canva-template-specs.md` — exact design specs for Canva templates

# ZPL II Quick Reference for Ohanafy Field

## Hardware targets
| Printer | dpmm | Dots per inch | Common label widths |
|---|---|---|---|
| ZQ520 | 8 | 203 | 2", 2.5", 4" |
| ZQ630 | 12 | 300 | 4" |

## Dot conversion
dots = inches × dpmm × 25.4
- 2.5" @ 8dpmm = 2.5 × 8 × 25.4 = ~508 dots (use ^PW400 for safe margin)
- 4" @ 8dpmm = 4 × 8 × 25.4 = ~812 dots (use ^PW640 for safe margin)

## Essential commands
| Command | Purpose | Example |
|---|---|---|
| ^XA | Label start | ^XA |
| ^XZ | Label end | ^XZ |
| ^CI28 | UTF-8 charset | ^CI28 |
| ^PW n | Print width (dots) | ^PW640 |
| ^LL n | Label length (dots) | ^LL480 |
| ^FO x,y | Field origin | ^FO30,25 |
| ^A0N,h,w | Scalable font | ^A0N,36,36 |
| ^FD text ^FS | Field data | ^FDYellowhammer Pale Ale^FS |
| ^GB w,h,t | Graphic box (line) | ^GB580,2,2 |

## Font size guide (at 8dpmm)
| ^A0N height | Approx pt | Use for |
|---|---|---|
| 18 | ~7pt | Footer, secondary info |
| 22 | ~9pt | Body, SKU codes |
| 28 | ~11pt | Subheadings |
| 36 | ~14pt | Product names |
| 48 | ~19pt | Section headers |
| 54+ | ~21pt+ | Price (most prominent) |

## Labelary preview API
POST http://api.labelary.com/v1/printers/{dpmm}dpmm/labels/{W}x{H}/{idx}/
Content-Type: application/x-www-form-urlencoded
Body: [ZPL string URL-encoded]
Returns: PNG image

## Safety rules
1. Truncate all text inputs — never trust external strings
2. Verify ^FO x coordinates: max x = ^PW value - 20 (margin)
3. Always include ^CI28 for UTF-8 (special chars in product names)
4. Test every new template against Labelary before printing on hardware

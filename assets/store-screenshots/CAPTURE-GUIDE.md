# Screenshot capture guide

15 total: 9 iOS + 6 Android. Save each one with a numeric prefix matching the order below — store consoles preserve upload order.

## How to capture

**iOS simulator** — Xcode → Window → Devices and Simulators → Simulators tab. Boot the device. Run `npx expo run:ios --device "<device name>"`. With the simulator focused: `Cmd-S` saves to ~/Desktop. Move into the directories below.

**Android emulator** — Android Studio → Tools → Device Manager → boot AVD. Run `npx expo run:android`. Click the camera icon in the AVD toolbar to capture. Saves to ~/Desktop.

## Required dimensions (exact)

| Device | Pixel size |
|---|---|
| iPhone 15 Pro Max (6.7") | 1290 × 2796 |
| iPhone 15 (6.1") | 1179 × 2556 |
| iPad Pro 12.9" | 2048 × 2732 |
| Pixel 7 (Android phone) | 1080 × 2400 |
| Nexus 7 (7" tablet) | 1024 × 600 |
| Pixel Tablet (10" tablet) | 2560 × 1600 |

If a captured image is the wrong dimensions, **do not** rescale — re-capture from a simulator at the right size. Stores reject upscaled or letterboxed shots.

## Shot list — same flow for every device

Login as `appreview@ohanafy.field.test` first. Shot order is identical across all six device sets.

### Shot 1 — Account list with Needs-Attention filter active
- From the Accounts tab, tap the filter icon → enable "Needs Attention"
- Frame: filter chip visible at top, 4-5 account rows visible
- Save as: `01-account-list.png`

### Shot 2 — Account detail with InsightBanner
- Tap any account from the list (Joe's Tap House works well — has 2 prior orders for richer banner)
- Wait 1 second for the InsightBanner to populate
- Frame: InsightBanner at top, account header, last visit summary visible
- Save as: `02-account-detail-insight.png`

### Shot 3 — Voice modal mid-dictation
- From an account detail, tap the mic button (bottom right)
- Speak a partial command: "Add four cases of"
- Capture while the live transcript is visible and the waveform is animating
- Save as: `03-voice-active.png`

### iOS extras (3 shots only on the phone sets, optional)

If time permits, also capture for the **6.7" set** only:
- `04-order-stepper.png` — Order entry stepper with 3-4 line items
- `05-label-preview.png` — Label preview screen showing rendered shelf talker
- `06-sync-complete.png` — Sync notification banner after queue drains

These are nice-to-have. Two stores require **at least 2 phone shots and 2 tablet shots**, so the 3-shot baseline is sufficient.

## Directory layout

```
assets/store-screenshots/
├── ios/
│   ├── 6.7/                    # iPhone 15 Pro Max
│   │   ├── 01-account-list.png
│   │   ├── 02-account-detail-insight.png
│   │   └── 03-voice-active.png
│   ├── 6.1/                    # iPhone 15
│   │   └── (same 3 files)
│   └── ipad-12.9/              # iPad Pro 12.9 — split-pane layout!
│       ├── 01-split-pane-list.png       # left: list, right: detail
│       ├── 02-split-pane-with-banner.png
│       └── 03-voice-active.png
├── android/
│   ├── phone/                  # Pixel 7
│   │   ├── 01-account-list.png
│   │   └── 02-account-detail-insight.png
│   ├── tablet-7/               # Nexus 7 — split-pane
│   │   ├── 01-split-pane-list.png
│   │   └── 02-split-pane-detail.png
│   └── tablet-10/              # Pixel Tablet — split-pane
│       ├── 01-split-pane-list.png
│       └── 02-split-pane-detail.png
```

## Verification before submit

```
# Run from repo root
for f in assets/store-screenshots/ios/6.7/*.png; do sips -g pixelWidth -g pixelHeight "$f" | head -3; done
```

Every iOS 6.7 file should report 1290×2796. Repeat for each device folder, swapping the path and expected size.

## Tips

- **Status bar** matters. iOS simulator shows correct fake values (9:41 AM, full battery, full signal) automatically. On Android AVD use Settings → System UI demo mode if the bar looks wrong.
- **Dark mode not required** for v1.0 submission. Stick to light mode for consistency.
- **No annotations needed** for the first submission — saves hours. Add captioned versions in a v1.1 marketing pass.
- **No mockup frames** — Apple specifically rejects screenshots that include rendered phone/tablet bezels. Use the raw simulator output.

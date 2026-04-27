# NativeWind v4 Patterns for Ohanafy Field

## Brand token usage
Always use semantic tokens from tailwind.config.js, never raw colors:
- `bg-ohanafy-primary` not `bg-blue-600`
- `text-ohanafy-ink` not `text-gray-900`
- `dark:bg-ohanafy-dark-surface` for dark mode surfaces

## Platform-specific classes
- `ios:pt-safe` — iOS safe area top
- `android:pt-4` — Android has no notch
- `ios:rounded-xl android:rounded-lg` — platform-native feel

## Component patterns
Sheet bottom: `rounded-t-3xl bg-white dark:bg-ohanafy-dark-surface`
Card: `bg-white dark:bg-ohanafy-dark-surface rounded-2xl shadow-sm p-4`
Badge: `rounded-full px-2 py-0.5 text-xs font-semibold`
Section header: `text-xs font-semibold uppercase tracking-wider text-gray-500`

## Responsive (tablet split pane)
Width check via `useTabletLayout()` hook — NOT via NativeWind breakpoints
(RN doesn't have CSS media queries; use the custom hook instead)

## Forbidden patterns
- No `style={{}}` inline styles (exception: StyleSheet.hairlineWidth for borders)
- No `text-black` or `text-white` (use theme tokens)
- No fixed pixel dimensions for text containers (use min-height or flex)

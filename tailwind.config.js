/** @type {import('tailwindcss').Config} */
// Ohanafy 2025 brand tokens — see ~/.claude/commands/references/brand.md
// Hex values are locked. Use semantic names below; never hardcode hex in components.
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Light mode (default surfaces)
        ohanafy: {
          ink: '#000000',           // True Black — primary text on light surfaces
          paper: '#FFFFFF',         // True White — base background
          cork: '#F4F2F0',          // Cork — neutral surface, dividers
          mellow: '#E4F223',        // Mellow — accent only, never bg fill
          denim: '#4A5F80',         // Dark Denim — secondary UI, headers
          'denim-light': '#B1C7EB', // Light Denim — hover, subtle
          muted: '#545454',         // Dark Grey — secondary text
          // Dark mode surfaces
          'dark-surface': '#0a0a0a',
          'dark-elevated': '#1a1a1a',
          'dark-text': '#FFFFFF',
          'dark-muted': '#9a9a9a',
        },
      },
      fontFamily: {
        // Geist family per brand guide; fall back to system sans-serif
        sans: ['Geist', 'System'],
        bold: ['Geist-Bold', 'System'],
        thin: ['Geist-Thin', 'System'],
      },
      fontSize: {
        // Map brand type scale (54/36/24/18/16) to Tailwind tokens
        'brand-title': ['54px', { lineHeight: '60px', fontWeight: '700' }],
        'brand-st1': ['36px', { lineHeight: '44px', fontWeight: '300' }],
        'brand-h1': ['24px', { lineHeight: '32px', fontWeight: '400' }],
        'brand-h2': ['18px', { lineHeight: '24px', fontWeight: '700' }],
        'brand-body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};

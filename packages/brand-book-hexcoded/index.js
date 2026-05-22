/**
 * @amplify-ai/brand-book-hexcoded
 * Asset path exports — resolve from package root.
 *
 * Locked to Brand Book v1.0 Final (24 of 25 decisions · 1 parked).
 */

export const book = {
  html: 'index.html',
  decisions: 'BRAND-DECISIONS.md',
};

export const wordmark = {
  default:    'assets/logo/wordmark-default.svg',
  onLight:    'assets/logo/wordmark-on-light.svg',
  onDark:     'assets/logo/wordmark-on-dark.svg',
  onGreen:    'assets/logo/wordmark-on-green.svg',
  monochrome: 'assets/logo/wordmark-monochrome.svg',
  static:     'assets/logo/wordmark-static.svg',   // no animation, for print
};

export const monogram = {
  default:    'assets/icons/monogram-hex.svg',
  inverse:    'assets/icons/monogram-hex-inverse.svg',   // white tile, dark HEX
};

export const appIcon = {
  light1024: 'assets/icons/app-icon-1024.svg',
  light180:  'assets/icons/app-icon-180.svg',
  light120:  'assets/icons/app-icon-120.svg',
  android512:'assets/icons/android-512.svg',
};

export const favicon = {
  light:           'assets/favicons/favicon.svg',
  size16:          'assets/favicons/favicon-16.png',     // "H" fallback
  size32:          'assets/favicons/favicon-32.png',
  size48:          'assets/favicons/favicon-48.png',
  appleTouch180:   'assets/favicons/apple-touch-icon.png',
  ico:             'assets/favicons/favicon.ico',
  webmanifest:     'assets/favicons/site.webmanifest',
};

export const social = {
  ogImage:       'assets/social/og-image-1200x630.svg',
  twitterCard:   'assets/social/twitter-card-1600x900.svg',
  linkedinPost:  'assets/social/linkedin-post-1200x627.svg',
  igPost:        'assets/social/ig-post-1080x1080.svg',
};

export const guidelines = {
  voiceAndTone:  'guidelines/voice-and-tone.md',
  bannedWords:   'guidelines/banned-words.md',
  verbUsage:     'guidelines/verb-usage.md',
  errorVoice:    'guidelines/error-voice.md',
  photography:   'guidelines/photography.md',
  coBranding:    'guidelines/co-branding.md',
  accessibility: 'guidelines/accessibility.md',
};

// L02 · Tech Green · Tailwind green-500 · RGB 34 197 94 · PANTONE 354 C
export const brandColors = {
  accent:        '#22C55E',
  accentDeep:    '#16A34A',
  accentLight:   '#86EFAC',
  accentWhisper: '#DCFCE7',
  ink:           '#0B0B0F',
};

// L19 · UI state colours
export const stateColors = {
  success: '#22C55E',
  warning: '#FBBF24',
  danger:  '#EF4444',
  info:    '#0EA5E9',
};

export default {
  book,
  wordmark,
  monogram,
  appIcon,
  favicon,
  social,
  guidelines,
  brandColors,
  stateColors,
};

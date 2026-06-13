/**
 * Country reference data for the phone-number country-code picker.
 *
 * This is STATIC REFERENCE DATA owned by the runtime — not page content — so it
 * lives here rather than being shipped in the wire on every form (sending ~195
 * countries in each page's JSON would be wasteful), the same way icon glyphs are
 * runtime-owned. Swap this sample (~12 countries) for the full dataset later.
 */
export interface Country {
  /** ISO 3166-1 alpha-2 code. */
  iso: string;
  /** Display name. */
  name: string;
  /** E.164 dial code, e.g. "+91" — this is the value stored on the form. */
  dialCode: string;
  /** Emoji flag (zero assets, renders natively). */
  flag: string;
}

export const COUNTRIES: Country[] = [
  { iso: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { iso: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { iso: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { iso: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
  { iso: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { iso: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { iso: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { iso: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { iso: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { iso: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { iso: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { iso: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩" },
];

/** The default selection when none is set. */
export const DEFAULT_COUNTRY = COUNTRIES[0]; // India (+91)

/** First country matching a dial code (for rendering the chip from the value). */
export function countryForDialCode(dialCode: string | undefined): Country {
  return COUNTRIES.find((c) => c.dialCode === dialCode) ?? DEFAULT_COUNTRY;
}

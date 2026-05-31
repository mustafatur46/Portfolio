// Muted, cohesive "vintage terminal" palette used for tech-stack chips,
// language dots and other small accents. Deterministic per key → stable colors.
export const PALETTE = [
  '#e3a857', // gold
  '#6f8cae', // dusty blue
  '#88a36b', // sage
  '#cf7257', // terracotta
  '#5fa3a0', // teal
  '#c2a878', // sand
  '#c98a76', // clay
  '#7f93a8', // steel
];

/** Stable color for a string key (e.g. a tech name) from the palette. */
export function toneFor(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

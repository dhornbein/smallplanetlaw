/**
 * Minimum image sizes for every image slot the editor can upload to. Used by the image
 * field in `fields.ts` to warn (not block) when an upload is too small. Adjust the numbers
 * here; widths are in pixels of the original file.
 */
export const imageSizes = {
  heroWide: {
    name: 'a wide hero background',
    minWidth: 1500, // full-bleed on desktop, shown up to ~1600px wide
    orientation: 'landscape',
  },
  heroTall: {
    name: 'a phone hero background',
    minWidth: 480, // phones are ~400px wide; larger is sharper on high-density screens
    orientation: 'portrait',
  },
  portrait: {
    name: 'a portrait',
    minWidth: 800, // shown up to ~670px wide, doubled for high-density screens
  },
  signature: {
    name: 'a signature',
    minWidth: 400,
  },
  cover: {
    name: 'a guide cover',
    minWidth: 500,
  },
  blog: {
    name: 'a blog post image',
    minWidth: 1200,
  },
} as const satisfies Record<string, { name: string; minWidth: number; orientation?: 'landscape' | 'portrait' }>;

export type ImageSize = keyof typeof imageSizes;

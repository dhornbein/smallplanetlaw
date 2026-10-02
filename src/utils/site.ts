/**
 * Site-wide constants and integration IDs that are not editable in Keystatic. Editable defaults (page title
 * suffix, default meta description, contact details) live in src/content/settings.yaml and
 * come from `getSettings()`.
 */
export const SITE = {
  name: "Small Planet Law LLC",
  /** Fallback social-sharing image, relative to the site root (file in /public). */
  defaultOgImage: "/og-image.jpg",
  logo: "/logo.png",
  /** Google Analytics measurement ID. */
  analyticsId: "G-F3T143T823",
  /** Used in the LegalService structured data (JSON-LD) in the layout. */
  schema: {
    description: "Wills, Trusts & Green Estate Planning in Colorado",
    priceRange: "$$",
    addressRegion: "CO",
    addressCountry: "US",
    areaServed: "Colorado",
  },
} as const;

/** Mailchimp account details, from environment variables (see .env). */
export const MAILCHIMP = {
  archiveUrl: `https://us15.campaign-archive.com/home/?u=${import.meta.env.MAILCHIMP_USER_ID}&id=${import.meta.env.MAILCHIMP_LIST_ID}`,
  userId: import.meta.env.MAILCHIMP_USER_ID,
  listId: import.meta.env.MAILCHIMP_LIST_ID,
};

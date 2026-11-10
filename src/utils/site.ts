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

/**
 * Lawmatics custom forms. See "Lawmatics" in AGENTS.md.
 * Field keys come from each form's "API Details" in the Lawmatics form builder.
 */
export const LAWMATICS = {
  /** Form visitors use to register for events. Events attached to it appear on /events. */
  eventRegistrationForm: {
    id: "4ef00b99-129a-44d6-b43b-9b14ddd7b36e",
    shareUrl: "https://app.lawmatics.com/forms/share/4ef00b99-129a-44d6-b43b-9b14ddd7b36e",
  },
  /** Form that newsletter and guide signups are submitted to by /api/newsletter. */
  newsletterForm: {
    id: "a41f0bf1-cd05-4f89-b262-55dbecbc171b",
    /**
     * Inputs we forward, keyed by the input's `name` in our forms. Anything not
     * listed here is ignored, so a visitor can't set other Lawmatics fields.
     * To collect another field (e.g. last name), add it here and add a matching
     * input to the forms. `required` should match the Lawmatics form.
     */
    fields: {
      firstName: { key: "first_name", required: true },
      email: { key: "email", required: true, type: "email" },
    },
    /** Sent with every signup: ticks "Subscribed to Newsletter" */
    fixedValues: {
      custom_field_935354: true,
    },
  },
} satisfies {
  eventRegistrationForm: { id: string; shareUrl: string };
  newsletterForm: {
    id: string;
    fields: Record<string, { key: string; required?: boolean; type?: "email" }>;
    fixedValues: Record<string, string | boolean>;
  };
};

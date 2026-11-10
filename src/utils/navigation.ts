// Navigation item types
export interface NavItem {
  name: string;
  href: string;
  target?: "_blank";
}

// Global navigation configuration
export const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Services", href: "/services" },
  { name: "Blog", href: "/blog" },
  { name: "Events", href: "/events" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact Us", href: "/contact" },
];

export const callToAction: NavItem = {
  name: "Book A Call",
  href: "https://app.lawmatics.com/forms/share/87520261-e73c-4bc1-927d-dbc8dee65af8",
  target: "_blank",
};

// Lawmatics custom form that visitors use to register for events
export const eventRegistrationForm = {
  id: "4ef00b99-129a-44d6-b43b-9b14ddd7b36e",
  shareUrl:
    "https://app.lawmatics.com/forms/share/4ef00b99-129a-44d6-b43b-9b14ddd7b36e",
};

// Lawmatics custom form that newsletter signups are submitted to.
// Field keys come from the form's "API Details" in the Lawmatics form builder.
export const newsletterForm = {
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
} satisfies {
  id: string;
  fields: Record<string, { key: string; required?: boolean; type?: "email" }>;
  fixedValues: Record<string, string | boolean>;
};

// Combined quick links for footer
export const quickLinks: NavItem[] = [...navItems, callToAction];

// Export base path from astro config for use in scripts
export const base = import.meta.env.BASE_URL;

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

// Combined quick links for footer
export const quickLinks: NavItem[] = [...navItems, callToAction];

// Export base path from astro config for use in scripts
export const base = import.meta.env.BASE_URL;

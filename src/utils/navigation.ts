// Navigation item types
export interface NavItem {
  name: string;
  href: string;
  target?: "_blank";
}

// Global navigation configuration
export const navItems: NavItem[] = [
  { name: "Home", href: "./" },
  { name: "About Us", href: "./about" },
  { name: "Our Services", href: "./services" },
  { name: "Blog", href: "./blog" },
  { name: "FAQ", href: "./faq" },
  { name: "Contact Us", href: "./contact" },
];

export const callToAction: NavItem = {
  name: "Book A Call",
  href: "https://smallplanetlaw.cliogrow.com/book/173de2aea8b3decac6684b3d007f2d15",
  target: "_blank",
};

// Combined quick links for footer
export const quickLinks: NavItem[] = [...navItems, callToAction];

// Export base path from astro config for use in scripts
export const base = import.meta.env.BASE_URL;

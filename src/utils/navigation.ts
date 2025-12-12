// Global navigation configuration
export const navItems = [
  { name: "Home", href: "./" },
  { name: "About Us", href: "./about" },
  { name: "Our Services", href: "./services" },
  { name: "Contact Us", href: "./contact" },
];

export const callToAction = {
  name: "Book A Call",
  href: "./book",
};

// Combined quick links for footer
export const quickLinks = [...navItems, callToAction];

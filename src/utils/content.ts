import { getEntry, type CollectionEntry, type CollectionKey } from "astro:content";

type SingletonName =
  | "homePage"
  | "aboutPage"
  | "servicesPage"
  | "greenPlanningPage"
  | "faqPage"
  | "eventsPage"
  | "resourcesPage"
  | "blogPage"
  | "contactPage"
  | "settings";

/** Read a Keystatic singleton (see `singleton()` in src/content.config.ts). */
export async function getSingleton<C extends SingletonName & CollectionKey>(
  name: C,
): Promise<CollectionEntry<C>["data"]> {
  const entry = await getEntry(name, name);
  if (!entry) throw new Error(`Missing content for singleton "${name}"`);
  return entry.data as CollectionEntry<C>["data"];
}

export const TITLE_SEPARATOR = " | ";

/** Full <title>: the page's own title plus the site-wide suffix from settings. */
export function formatTitle(title: string | undefined, suffix: string) {
  return title ? `${title}${TITLE_SEPARATOR}${suffix}` : suffix;
}

/** Public URL for a resource PDF. Served by src/pages/resources/[slug].pdf.ts so the download keeps a real name. */
export const resourcePdfPath = (id: string) => `/resources/${id}.pdf`;

export interface NavItem {
  name: string;
  href: string;
  target?: "_blank";
}

/** Site-wide contact details, navigation and booking CTA from src/content/settings.yaml. */
export async function getSettings() {
  const settings = await getSingleton("settings");
  const callToAction: NavItem = {
    name: settings.bookingCta.label,
    href: settings.bookingCta.url,
    target: "_blank",
  };
  const navItems: NavItem[] = settings.navigation.map(({ label, href }) => ({ name: label, href }));

  return {
    phone: { display: settings.phone.display, href: `tel:${settings.phone.number}` },
    email: { display: settings.email, href: `mailto:${settings.email}` },
    address: settings.address,
    titleSuffix: settings.seo.titleSuffix,
    defaultDescription: settings.seo.defaultDescription,
    tagline: settings.tagline,
    footerAffiliations: settings.footerAffiliations,
    footerDisclaimer: settings.footerDisclaimer,
    callToAction,
    navItems,
    // Combined quick links for footer
    quickLinks: [...navItems, callToAction],
  };
}

/** Style for the `.bg-var` responsive background helper; the tall image falls back to the wide one. */
export function bgVarStyle(image?: ImageMetadata | null, imageTall?: ImageMetadata | null) {
  if (!image) return undefined;
  return `--bg-img: url(${(imageTall ?? image).src}); --bg-img-md: url(${image.src});`;
}

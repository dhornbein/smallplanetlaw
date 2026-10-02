import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z, type ZodType } from "astro/zod";
import { iconNames } from "./components/ui/icons";

// These schemas mirror keystatic.config.ts — keep the two in sync.

type ImageFn = SchemaContext["image"];

/**
 * A Keystatic singleton: one yaml file loaded as a single entry whose id is the
 * collection name, so it can be read with `getEntry(name, name)`.
 */
function singleton<S extends ZodType>(
  name: string,
  file: string,
  schema: (ctx: SchemaContext) => S,
) {
  return defineCollection({
    loader: glob({ pattern: `${file}.yaml`, base: "./src/content", generateId: () => name }),
    schema,
  });
}

const seo = z.object({ title: z.string().default(""), description: z.string().default("") });

const hero = z.object({ heading: z.string(), intro: z.string().default("") });

const heroWithImage = (image: ImageFn) =>
  hero.extend({ image: image().nullish(), imageTall: image().nullish() });

const section = z.object({ heading: z.string(), body: z.string().default("") });

const card = z.object({ title: z.string(), description: z.string().default("") });

const iconCard = card.extend({ icon: z.enum(iconNames) });

const link = z.object({ label: z.string(), href: z.string() });

const homePage = singleton("homePage", "pages/home", ({ image }) =>
  z.object({
    seo,
    hero: heroWithImage(image),
    difference: z.object({
      heading: z.string(),
      subheading: z.string(),
      body: z.string(),
      features: z.array(iconCard),
    }),
    services: z.object({
      heading: z.string(),
      cards: z.array(card),
      buttonLabel: z.string(),
    }),
    green: z.object({
      heading: z.string(),
      body: z.string(),
      buttonLabel: z.string(),
      checklist: z.array(card),
    }),
    testimonial: z.object({ quote: z.string(), name: z.string(), role: z.string() }),
  }),
);

const aboutPage = singleton("aboutPage", "pages/about", ({ image }) =>
  z.object({
    seo,
    hero: heroWithImage(image),
    story: z.object({ heading: z.string(), body: z.string(), faqLinkText: z.string() }),
    bio: z.object({
      heading: z.string(),
      body: z.string(),
      portrait: image().nullish(),
      signature: image().nullish(),
    }),
  }),
);

const servicesPage = singleton("servicesPage", "pages/services", ({ image }) =>
  z.object({
    seo,
    hero: heroWithImage(image),
    approach: z.object({
      heading: z.string(),
      body: z.string(),
      features: z.array(card),
      link,
    }),
    offer: z.object({
      heading: z.string(),
      body: z.string(),
      services: z.array(card),
      link,
    }),
    green: z.object({
      heading: z.string(),
      body: z.string(),
      features: z.array(card),
      closing: z.string(),
      link,
    }),
    closingHeading: z.string(),
  }),
);

const greenPlanningPage = singleton("greenPlanningPage", "pages/green-planning", () =>
  z.object({
    seo,
    intro: section,
    callout: section,
    leadIn: z.string(),
    faqLink: link,
    features: z.array(iconCard),
    buttonLabel: z.string(),
  }),
);

const faqPage = singleton("faqPage", "pages/faq", () =>
  z.object({ seo, hero, closingText: z.string(), buttonLabel: z.string() }),
);

const eventsPage = singleton("eventsPage", "pages/events", () =>
  z.object({ seo, hero, comingSoon: section }),
);

const resourcesPage = singleton("resourcesPage", "pages/resources", () => z.object({ seo, hero }));

const contactPage = singleton("contactPage", "pages/contact", () =>
  z.object({
    seo,
    hero,
    buttonLabel: z.string(),
    infoHeading: z.string(),
    serviceArea: z.string(),
    faqPrompt: z.string(),
    faqLink: link,
  }),
);

const blogPage = singleton("blogPage", "pages/blog", () => z.object({ seo, hero }));

const settings = singleton("settings", "settings", () =>
  z.object({
    phone: z.object({ display: z.string(), number: z.string() }),
    email: z.string(),
    tagline: z.string().default(""),
    footerAffiliations: z.string().default(""),
    footerDisclaimer: z.string().default(""),
    seo: z.object({ titleSuffix: z.string(), defaultDescription: z.string() }),
    address: z.object({ line1: z.string(), line2: z.string() }),
    bookingCta: z.object({ label: z.string(), url: z.url() }),
    navigation: z.array(z.object({ label: z.string(), href: z.string() })),
  }),
);

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().nullish(),
      pinned: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      image: image().nullish(),
      imageAlt: z.string().nullish(),
      cta: z.string().nullish(),
    }),
});

const faq = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/faq" }),
  schema: z.object({
    question: z.string(),
    order: z.number().int().default(0),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string(),
    // Keystatic datetimes have no timezone ("2026-10-01T18:00"). Read them as UTC
    // and format them in UTC so the build machine's timezone doesn't shift them.
    date: z
      .union([z.string(), z.date()])
      .transform((value) =>
        typeof value === "string" && !/(Z|[+-]\d\d:?\d\d)$/i.test(value)
          ? new Date(`${value}Z`)
          : new Date(value),
      ),
    location: z.string().nullish(),
    registrationUrl: z.url().nullish(),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/resources" }),
  schema: z.object({
    title: z.string(),
    file: z.string(),
  }),
});

const leadMagnets = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/lead-magnets" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tag: z.string(),
      teaser: z.string(),
      bullets: z.array(z.string()).default([]),
      downloadUrl: z.string().nullish(),
      buttonText: z.string(),
      cover: image().nullish(),
    }),
});

const signupLinks = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/signup-links" }),
  schema: z.object({
    label: z.string(),
    href: z.url(),
  }),
});

export const collections = {
  homePage,
  aboutPage,
  servicesPage,
  greenPlanningPage,
  faqPage,
  eventsPage,
  resourcesPage,
  blogPage,
  contactPage,
  settings,
  blog,
  faq,
  events,
  resources,
  leadMagnets,
  signupLinks,
};

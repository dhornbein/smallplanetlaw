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
  z.object({
    seo,
    hero: z.object({
      heading: z.string(),
      intro: z.string(),
      discoveryCall: z.string(),
      discoveryCallLink: z.string(),
    }),
    status: z.object({
      unknown: z.string(),
      oneEvent: z.string(),
      manyEvents: z.string(),
      noEvents: z.string(),
      allFull: z.string(),
      today: z.string(),
      tomorrow: z.string(),
      onDate: z.string(),
    }),
    card: z.object({
      hostedBy: z.string(),
      registerButton: z.string(),
      registerButtonLabel: z.string(),
      full: z.string(),
    }),
    registration: z.object({
      heading: z.string(),
      body: z.string(),
      formFallback: z.string(),
      formFallbackLink: z.string(),
      noScriptLink: z.string(),
    }),
  }),
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

const newsletter = singleton("newsletter", "newsletter", () =>
  z.object({
    page: z.object({ seo }),
    signup: z.object({
      heading: z.string(),
      intro: z.string(),
      submitButton: z.string(),
      successHeading: z.string(),
      successBody: z.string(),
      resetButton: z.string(),
    }),
    guide: z.object({
      eyebrow: z.string(),
      successHeading: z.string(),
      successBody: z.string(),
      downloadButton: z.string(),
    }),
    fields: z.object({
      emailLabel: z.string(),
      emailPlaceholder: z.string(),
      firstNameLabel: z.string(),
      firstNamePlaceholder: z.string(),
      sending: z.string(),
      privacy: z.string(),
    }),
    emailCheck: z.object({
      suggestion: z.string(),
      missingEnding: z.string(),
      submitAgain: z.string(),
    }),
    messages: z.object({
      missingField: z.string(),
      invalidEmail: z.string(),
      rejected: z.string(),
      failed: z.string(),
    }),
  }),
);

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
  newsletter,
  blog,
  faq,
  resources,
  leadMagnets,
};

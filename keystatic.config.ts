import { collection, config, fields, singleton } from '@keystatic/core';
import { faqList } from './src/keystatic/faqList';
import { BrandMark } from './src/keystatic/BrandMark';
import { body, cards, hero, link, pageImage, pdfFile, richText, section, seo, sizedImage } from './src/keystatic/fields';

// Page singletons live in src/content/pages/<file>.yaml. The keys here are also
// the Astro collection names (see src/content.config.ts).
const page = (label: string, file: string, schema: Parameters<typeof singleton>[0]['schema']) =>
  singleton({ label, path: `src/content/pages/${file}`, schema });

export default config({
  // Edit files on disk while developing; commit through Keystatic Cloud in production.
  storage: import.meta.env.DEV ? { kind: 'local' } : { kind: 'cloud' },
  cloud: {
    project: 'small-planet-law/small-planet-law',
  },
  ui: {
    brand: { name: 'Small Planet Law', mark: BrandMark },
    navigation: {
      Pages: ['homePage', 'aboutPage', 'servicesPage', 'greenPlanningPage', 'faqPage', 'eventsPage', 'resourcesPage', 'blogPage', 'contactPage'],
      Content: ['blog', 'faq', 'events', 'resources', 'leadMagnets'],
      Settings: ['settings', 'signupLinks'],
    },
  },

  singletons: {
    homePage: page('Home', 'home', {
      seo: seo(),
      hero: hero('home'),
      difference: fields.object(
        {
          heading: fields.text({ label: 'Heading' }),
          subheading: fields.text({ label: 'Subheading' }),
          body: body(),
          features: cards('Features', { icon: true }),
        },
        { label: 'The Small Planet Difference' }
      ),
      services: fields.object(
        {
          heading: fields.text({ label: 'Heading' }),
          cards: cards('Services'),
          buttonLabel: fields.text({ label: 'Button text' }),
        },
        { label: 'What We Offer' }
      ),
      green: fields.object(
        {
          heading: fields.text({ label: 'Heading' }),
          body: body(),
          buttonLabel: fields.text({ label: 'Button text' }),
          checklist: cards('Checklist'),
        },
        { label: 'Green approach' }
      ),
      testimonial: fields.object(
        {
          quote: fields.text({ label: 'Quote', multiline: true }),
          name: fields.text({ label: 'Name' }),
          role: fields.text({ label: 'Role' }),
        },
        { label: 'Testimonial' }
      ),
    }),

    aboutPage: page('About', 'about', {
      seo: seo(),
      hero: hero('about'),
      story: fields.object(
        {
          heading: fields.text({ label: 'Heading' }),
          body: body(),
          faqLinkText: fields.text({ label: 'FAQ link text' }),
        },
        { label: 'Our Story' }
      ),
      bio: fields.object(
        {
          heading: fields.text({ label: 'Heading' }),
          body: body(),
          portrait: pageImage('about', 'portrait', 'Portrait'),
          signature: pageImage('about', 'signature', 'Signature'),
        },
        { label: 'Bio' }
      ),
    }),

    servicesPage: page('Services', 'services', {
      seo: seo(),
      hero: hero('services'),
      approach: fields.object(
        {
          heading: fields.text({ label: 'Heading' }),
          body: body(),
          features: cards('Client-centered features'),
          link: link('Link below button'),
        },
        { label: 'Our Approach' }
      ),
      offer: fields.object(
        {
          heading: fields.text({ label: 'Heading' }),
          body: body(),
          services: cards('Services'),
          link: link('Link below button'),
        },
        { label: 'What We Offer' }
      ),
      green: fields.object(
        {
          heading: fields.text({ label: 'Heading' }),
          body: body(),
          features: cards('Green features'),
          closing: body('Closing text'),
          link: link('Link'),
        },
        { label: 'Green Estate Planning' }
      ),
      closingHeading: fields.text({ label: 'Closing call-to-action heading' }),
    }),

    greenPlanningPage: page('Green Planning', 'green-planning', {
      seo: seo(),
      intro: section('Intro'),
      callout: section('Callout box'),
      leadIn: fields.text({ label: 'Lead-in text above the features' }),
      faqLink: link('FAQ link'),
      features: cards('Features', { icon: true }),
      buttonLabel: fields.text({ label: 'Button text' }),
    }),

    faqPage: page('FAQ', 'faq', {
      seo: seo(),
      hero: hero(),
      questions: faqList(),
      closingText: fields.text({ label: 'Closing text' }),
      buttonLabel: fields.text({ label: 'Button text' }),
    }),

    eventsPage: page('Events', 'events', {
      seo: seo(),
      hero: hero(),
      comingSoon: section('Shown when there are no upcoming events'),
    }),

    resourcesPage: page('Resources', 'resources', {
      seo: seo(),
      hero: hero(),
    }),

    contactPage: page('Contact', 'contact', {
      seo: seo(),
      hero: hero(),
      buttonLabel: fields.text({ label: 'Button text', description: 'The booking button in the hero. It links to the booking URL in Site settings.' }),
      infoHeading: fields.text({ label: 'Contact details heading', description: 'Phone, email and address come from Site settings.' }),
      serviceArea: fields.text({ label: 'Service area line' }),
      faqPrompt: fields.text({ label: 'Text above the FAQ link' }),
      faqLink: link('FAQ link'),
    }),

    blogPage: page('Blog', 'blog', {
      seo: seo(),
      hero: hero(),
    }),

    settings: singleton({
      label: 'Site settings',
      path: 'src/content/settings',
      schema: {
        phone: fields.object(
          {
            display: fields.text({ label: 'Display', description: 'e.g. (303) 535-4311' }),
            number: fields.text({ label: 'Dial number', description: 'Used for tap-to-call links, e.g. +13035354311' }),
          },
          { label: 'Phone' }
        ),
        email: fields.text({ label: 'Email' }),
        tagline: fields.text({
          label: 'Tagline',
          description: 'Short slogan shown under the firm name in the footer.',
        }),
        footerAffiliations: richText(
          'Footer affiliations & tagline',
          'Memberships, certifications and tagline shown under the logo in the footer. One paragraph per line of text.'
        ),
        footerDisclaimer: fields.text({
          label: 'Footer legal disclaimer',
          multiline: true,
          description: 'Small print at the bottom of every page.',
        }),
        seo: fields.object(
          {
            defaultDescription: fields.text({
              label: 'Default meta description',
              multiline: true,
              description: 'Used in search results and link previews for any page that has no description of its own.',
            }),
            titleSuffix: fields.text({
              label: 'Page title suffix',
              description: 'Added after every page title in browser tabs and search results, e.g. "Events | Small Planet Law, Denver CO".',
              validation: { isRequired: true },
            }),
          },
          { label: 'SEO' }
        ),
        address: fields.object(
          {
            line1: fields.text({ label: 'Line 1' }),
            line2: fields.text({ label: 'Line 2' }),
          },
          { label: 'Address' }
        ),
        bookingCta: fields.object(
          {
            label: fields.text({ label: 'Button text' }),
            url: fields.url({ label: 'Booking URL', validation: { isRequired: true } }),
          },
          { label: 'Booking button', description: 'The "Book A Call" button in the header, heroes and page footers.' }
        ),
        navigation: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'Link', description: 'e.g. /about' }),
          }),
          { label: 'Main navigation', itemLabel: (props) => props.fields.label.value }
        ),
      },
    }),
  },

  collections: {
    blog: collection({
      label: 'Blog posts',
      path: 'src/content/blog/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true, validation: { isRequired: true } }),
        date: fields.date({ label: 'Published', validation: { isRequired: true } }),
        updated: fields.date({ label: 'Updated' }),
        pinned: fields.checkbox({ label: 'Pinned', description: 'Show at the top of the blog.' }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (props) => props.value }),
        image: sizedImage('blog', {
          label: 'Image',
          directory: 'src/assets/content/blog',
          publicPath: '../../assets/content/blog/',
        }),
        imageAlt: fields.text({ label: 'Image alt text' }),
        cta: fields.relationship({
          label: 'Lead magnet',
          description: 'Show this guide at the end of the post. Leave empty to rotate between guides.',
          collection: 'leadMagnets',
        }),
        content: fields.markdoc({ label: 'Content', extension: 'md' }),
      },
    }),

    faq: collection({
      label: 'FAQ',
      path: 'src/content/faq/*',
      slugField: 'question',
      format: { contentField: 'answer' },
      columns: ['question', 'order'],
      schema: {
        question: fields.slug({
          name: { label: 'Question' },
          slug: { label: 'Anchor', description: 'Used in links like /faq#planning-process. Changing it breaks existing links.' },
        }),
        order: fields.integer({ label: 'Order', description: 'Lower numbers appear first.', defaultValue: 0 }),
        answer: fields.markdoc({ label: 'Answer', extension: 'md' }),
      },
    }),

    events: collection({
      label: 'Events',
      path: 'src/content/events/*',
      slugField: 'title',
      format: { contentField: 'content' },
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.datetime({ label: 'Date & time', validation: { isRequired: true } }),
        location: fields.text({ label: 'Location' }),
        registrationUrl: fields.url({ label: 'Registration URL' }),
        content: fields.markdoc({ label: 'Description', extension: 'md' }),
      },
    }),

    resources: collection({
      label: 'Resources',
      path: 'src/content/resources/*',
      slugField: 'title',
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
          slug: { label: 'File name', description: 'The PDF is downloaded as /resources/<file name>.pdf. Changing it breaks existing links.' },
        }),
        file: pdfFile('PDF'),
      },
    }),

    leadMagnets: collection({
      label: 'Lead magnets',
      path: 'src/content/lead-magnets/*',
      slugField: 'title',
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
          slug: { label: 'ID', description: 'Referenced by blog posts. Changing it breaks those links.' },
        }),
        tag: fields.text({ label: 'Mailchimp tag', validation: { isRequired: true } }),
        teaser: fields.text({ label: 'Teaser', multiline: true }),
        bullets: fields.array(fields.text({ label: 'Bullet' }), { label: 'Bullets', itemLabel: (props) => props.value }),
        downloadUrl: fields.text({ label: 'Download URL' }),
        buttonText: fields.text({ label: 'Button text' }),
        cover: sizedImage('cover', {
          label: 'Cover image',
          directory: 'src/assets/content/lead-magnets',
          publicPath: '../../assets/content/lead-magnets/',
        }),
      },
    }),

    signupLinks: collection({
      label: 'Signup links',
      path: 'src/content/signup-links/*',
      slugField: 'label',
      schema: {
        label: fields.slug({
          name: { label: 'Label' },
          slug: { label: 'Path', description: 'The short link is /signup/<path>.' },
        }),
        href: fields.url({ label: 'Mailchimp URL', validation: { isRequired: true } }),
      },
    }),
  },
});

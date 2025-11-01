# AGENTS.md - Small Planet Law LLC Website

## Project Overview

**Small Planet Law LLC** is a holistic estate planning law firm in Denver, CO that integrates environmental consciousness into both operations and client services. This Astro-based website serves conscientious families (30-70 years old, middle class to mass affluent) who care deeply about their loved ones, legacy, and environmental stewardship.

**Brand Promise**: Estate planning that feels human, meaningful, and good for the Earth.

## Key Features

### Core Pages (Phase 1 - Launch)
- **Home**: Hero section, firm differentiators, services preview, green approach, testimonials, newsletter signup
- **About**: Firm story, Bobbie's bio, contact form
- **Services**: Values/approach, planning features, green estate planning options
- **Blog**: Content management with categories/tags for estate planning and sustainability topics
- **Contact**: Contact info, forms, scheduling integration

### Technical Features
- Astro static site generator with component-based architecture
- Tailwind CSS v4 for modern, utility-first styling
- Responsive design optimized for families and professionals
- Newsletter signup integration
- Contact forms throughout site
- Content collections for blog/content management
- Built-in SEO optimization for Denver estate planning market
- Scheduling system integration with cal.com
- View transitions for smooth page navigation
- Optimized image handling with Astro's built-in `<Image />` component

### Brand Elements
- **Colors**: Earth greens, warm neutrals, deep blue/slate
- **Tone**: Warm, conversational, reassuring, values-driven
- **Visual Style**: Natural imagery, Colorado landscapes, family-focused
- **Logo**: Circular mark suggesting planet/continuity with leaf motif
- **Typography**: Lora for headings; Source Sans Pro for body text

## Astro Best Practices

### Project Structure
```
src/
├── components/          # Reusable Astro/framework components
│   ├── layout/         # Header, Footer, Navigation
│   ├── ui/             # Buttons, Cards, Forms
│   └── sections/       # Hero, Testimonials, etc.
├── layouts/            # Page layouts
│   └── Layout.astro    # Base layout with SEO
├── pages/              # File-based routing
│   ├── index.astro     # Home page
│   ├── about.astro     # About page
│   ├── services.astro  # Services page
│   ├── contact.astro   # Contact page
│   └── blog/           # Blog pages
│       ├── index.astro
│       └── [slug].astro
├── content/            # Content collections
│   ├── config.ts       # Collection schemas
│   └── blog/           # Markdown/MDX blog posts
├── styles/             # Global styles
│   └── global.css      # Tailwind imports
└── assets/             # Images, icons, etc.
```

### Content Collections
- Use Astro's Content Collections API for type-safe content management
- Define schemas in `src/content/config.ts` for blog posts and services
- Leverage Zod validation for content frontmatter
- Use `.md` or `.mdx` files for rich content with component support

### Performance Optimization
- Zero JavaScript by default (Astro Islands architecture)
- Use `client:*` directives strategically for interactive components:
  - `client:load` - hydrate immediately
  - `client:idle` - hydrate when browser idle
  - `client:visible` - hydrate when in viewport
- Implement Astro's built-in image optimization with `<Image />` and `<Picture />`
- Use View Transitions API for smooth navigation without full page reloads
- Leverage partial hydration to ship minimal JavaScript

### SEO & Meta Tags
- Create reusable SEO component for consistent meta tags
- Use Astro's built-in `<SEO>` component or custom implementation
- Implement JSON-LD structured data for local business
- Add Open Graph and Twitter Card meta tags
- Generate sitemap and robots.txt automatically

### Component Strategy
- Prefer `.astro` components for static content (zero runtime overhead)
- Use framework components (React, Vue, Svelte) only when interactivity needed
- Create layout components for consistent page structure
- Build reusable UI components for buttons, cards, forms
- Use slots for flexible component composition

## Tailwind CSS v4 Best Practices

### CSS-First Configuration (v4)
- Use the new `@theme` directive in your CSS for customization:
  ```css
  @import "tailwindcss";
  
  @theme {
    --font-family-display: "Satoshi", sans-serif;
    --color-earth-green: oklch(45% 0.08 145);
    --color-warm-neutral: oklch(97% 0.01 85);
    --color-deep-slate: oklch(25% 0.02 210);
    --breakpoint-3xl: 1920px;
  }
  ```
- Use modern CSS features like `oklch()` for wide-gamut colors
- All theme values automatically available as CSS variables
- No JavaScript configuration file needed for most projects

### Modern CSS Features (v4)
- **Native cascade layers**: Proper `@layer` rules for better specificity control
- **Container queries**: Built-in support with `@min-*` and `@max-*` variants
- **Composable variants**: Combine variants like `group-has-focus:opacity-100`
- **Color-mix for opacity**: Easier opacity modifiers with CSS variables
- **Built-in nesting**: No plugins needed for nested CSS
- **Zero-config content detection**: Automatic template file discovery

### Component & Utility Strategy
- Embrace utility-first approach in Astro components
- Use arbitrary values with CSS variables: `p-[calc(var(--spacing-6)-1px)]`
- Create component classes only for truly repeated patterns
- Leverage Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Use new `not-*` variant for negative conditions
- Compose complex variants: `group-not-has-peer-data-active:underline`

### Responsive Design
- Mobile-first approach using Tailwind's responsive prefixes
- Container queries for component-level responsive design
- Ensure proper color contrast for accessibility (WCAG AA minimum)
- Touch-friendly interaction areas (min 44x44px)

## Development Notes

### Target Audience Considerations
- Optimize for users 30-70 years old (consider font sizes, contrast)
- Ensure professional appearance for legal services
- Balance environmental messaging without being preachy
- Clear navigation and calls-to-action for conversion

### SEO Strategy
- Target keywords: "Denver estate planning", "green estate planning", "holistic estate planning Colorado"
- Implement local SEO for Denver market
- Create valuable content around estate planning education
- Optimize for "People also ask" queries related to estate planning

### Integration Requirements
- Newsletter signup (platform TBD)
- Contact forms with proper validation
- Scheduling system integration
- Analytics implementation
- Social media integration (minimal, professional focus)
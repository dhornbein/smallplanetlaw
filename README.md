# Small Planet Law Website

Holistic estate planning website for Small Planet Law LLC, built with Astro and Tailwind CSS v4.

## Tech Stack

- **[Astro 5.x](https://astro.build)** - Static site generator with zero-JS by default
- **[Tailwind CSS v4](https://tailwindcss.com)** - Utility-first CSS framework via Vite plugin
- **TypeScript** - Type safety throughout the project
- **Variable Fonts** - Lora (headings) and Source Sans 3 (body)

## Project Structure

```
/
├── public/             # Static assets served as-is
│   └── favicon.svg     # Site favicon
├── src/
│   ├── assets/         # Optimized images (Astro processes these)
│   │   ├── logo*.{svg,png}          # Logo variations
│   │   ├── hero-*.jpg               # Hero section images
│   ├── components/
│   │   ├── layout/                  # Site-wide layout components
│   │   │   ├── Header.astro        # Navigation header
│   │   │   └── Footer.astro        # Site footer
│   │   ├── sections/               # Page section components
│   │   └── ui/                     # Reusable UI components
│   │       └── CurvedEdge.astro    # Curved SVG divider
│   ├── layouts/
│   │   └── Layout.astro             # Base page layout with SEO meta tags
│   ├── pages/                       # File-based routing (each .astro = route)
│   │   ├── index.astro             # Homepage (/)
│   │   ├── about.astro             # About page (/about)
│   │   ├── services.astro          # Services page (/services)
│   │   ├── green-planning.astro    # Green planning (/green-planning)
│   │   ├── faq.astro               # FAQ page (/faq)
│   │   ├── contact.astro           # Contact page (/contact)
│   │   └── brand.astro             # Brand guidelines (/brand)
│   ├── styles/
│   │   └── global.css              # Global styles & Tailwind config
│   └── utils/                       # Utility functions & data
│       ├── navigation.ts           # Navigation menu configuration
│       ├── faq.ts                  # FAQ data and types
│       └── global.ts               # Global utilities
├── astro.config.mjs     # Astro configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies & scripts
└── AGENTS.md            # AI agent instructions & brand guidelines
```

## Key Files

### Configuration

- **`astro.config.mjs`** - Astro config with Tailwind Vite plugin, sets site URL
- **`tsconfig.json`** - TypeScript config (extends Astro's strict preset)
- **`src/styles/global.css`** - Tailwind v4 CSS-first configuration with custom theme

### Layouts & Components

- **`src/layouts/Layout.astro`** - Base layout with SEO meta tags, Open Graph, Twitter cards
- **`src/components/layout/`** - Header/Footer used across all pages
- **`src/components/sections/`** - Composable page sections (hero, services, etc.)
- **`src/components/ui/`** - Reusable UI primitives (buttons, icons, etc.)

### Pages

All `.astro` files in `src/pages/` become routes automatically (file-based routing).

### Data & Utils

- **`src/utils/navigation.ts`** - Site navigation menu, CTA buttons, quick links
- **`src/utils/faq.ts`** - FAQ content with TypeScript types
- **`src/utils/global.ts`** - Shared utility functions

## Styling with Tailwind v4

This project uses **Tailwind CSS v4** with the new CSS-first configuration approach:

- **Theme configuration** is in `src/styles/global.css` using `@theme` directive
- **Brand colors** defined as CSS custom properties (hunter-green, olivine, etc.)
- **Typography** uses variable fonts via `@fontsource-variable` packages
- All Tailwind utilities available in `.astro` components
- Use native CSS nesting in `<style>` blocks within components

### Brand Colors

- `hunter-green` (primary) - #386641
- `olivine` (secondary) - #90ba78
- `outer-space` (dark text) - #49575b
- `celadon` (accent) - #B1CFA0
- `dutch-white` (light) - #ede0bf
- `redwood` (accent) - #b44143

Access via Tailwind classes: `text-hunter-green`, `bg-olivine-300`, etc.

## Commands

| Command            | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm install`      | Install dependencies                        |
| `npm run dev`      | Start dev server at `localhost:4321`        |
| `npm run build`    | Build production site to `./dist/`          |
| `npm run preview`  | Preview production build locally            |
| `npm run deploy`   | Build and deploy to GitHub Pages            |
| `npm run astro`    | Run Astro CLI commands                      |

## Development Notes

- **Zero JavaScript by default** - Astro ships no JS unless you use `client:*` directives
- **TypeScript strict mode** - All code is type-checked
- **Variable fonts** - No FOUT, fonts load immediately
- **SEO optimized** - Every page has proper meta tags via Layout component
- **Responsive images** - Use Astro's `<Image />` for automatic optimization

## Deployment

Site deploys to GitHub Pages via `gh-pages` package:

```sh
npm run deploy
```

This builds the site and pushes `./dist/` to the `gh-pages` branch. Custom domain configured via `CNAME` files.

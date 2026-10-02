# Small Planet Law Website

Holistic estate planning website for Small Planet Law LLC, built with Astro and Tailwind CSS v4.

## Tech Stack

- **[Astro 6.x](https://astro.build)** - Static site generator with zero-JS by default
- **[Keystatic](https://keystatic.com)** - Git-based CMS for editing content (`/keystatic`)
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
│   ├── content/                     # Editable content (managed with Keystatic)
│   │   ├── pages/*.yaml            # One file per page (hero, sections, cards…)
│   │   ├── settings.yaml           # Phone, email, address, booking link, nav
│   │   ├── blog/ faq/ events/      # Markdown collections
│   │   └── resources/ lead-magnets/ signup-links/  # YAML collections
│   ├── keystatic/fields.ts          # Shared Keystatic field groups
│   ├── content.config.ts            # Astro collections (mirror keystatic.config.ts)
│   └── utils/                       # Utility functions & data
│       ├── content.ts              # getSingleton() / getSettings() helpers
│       └── site.ts                 # Site constants + Mailchimp config
├── keystatic.config.ts  # Keystatic admin schema (/keystatic)
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

### Content & Utils

- **`src/content/`** - All editable copy. Page layout and design stay in the `.astro` files; the words, images and links come from these files.
- **`src/utils/content.ts`** - `getSingleton("homePage")` reads a page file; `getSettings()` returns contact details, navigation and the booking CTA
- **`src/utils/site.ts`** - Site constants (name, analytics ID, structured data) and Mailchimp config (from env vars)

## Editing Content (Keystatic)

The site owner edits content at **`/keystatic`**. Each page is a guided form ("Pages"), with blog posts, FAQs, events, resources and lead magnets under "Content", and contact details / navigation / signup short links under "Settings".

- **Locally** (`npm run dev`), Keystatic reads and writes the files in `src/content/` directly — edit at `http://localhost:4321/keystatic` and commit as usual.
- **In production**, Keystatic Cloud commits to GitHub; Netlify rebuilds the (static) site on every commit. Editors don't need GitHub accounts.
- **Schema changes** go in two places: `keystatic.config.ts` (the editor form) and `src/content.config.ts` (the Zod schema Astro validates against).
- **Images** uploaded in Keystatic land in `src/assets/content/…` so Astro still optimises them. Resource PDFs land in `public/resources/<slug>/file.pdf` and are served to visitors at `/resources/<slug>.pdf` (`src/pages/resources/[slug].pdf.ts`) so downloads keep a real file name.
- FAQ file names are the `/faq#anchor` ids — renaming one breaks links to it.

### Keystatic Cloud setup

1. Create a team + project at [keystatic.cloud](https://keystatic.cloud) and connect the GitHub repo.
2. Put the `<team>/<project>` value in `cloud.project` in `keystatic.config.ts`.
3. Invite editors (free tier: 3 users).
4. Make sure Netlify builds the branch Keystatic commits to.

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

## Deployment to Netlify

**⚠️ Important**: Pages are prerendered, but the newsletter API, `/signup/*` short links and the Keystatic admin run as Netlify functions, so the site **cannot be deployed to GitHub Pages**. Use Netlify instead.

### Initial Setup

1. **Create Netlify account** at [netlify.com](https://netlify.com)

2. **Import repository**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select this repository
   - Netlify auto-detects Astro settings ✅

3. **Add Environment Variables**
   
   In Netlify: Site settings → Environment variables → Add variable
   
   ```
   MAILCHIMP_API_KEY=your_api_key
   MAILCHIMP_SERVER_PREFIX=us21
   MAILCHIMP_LIST_ID=your_list_id  
   MAILCHIMP_USER_ID=your_user_id
   ```
   
   **Get credentials:**
   - API Key: Mailchimp → Account → Extras → API keys
   - Server Prefix: Part after dash in API key (e.g., "us21")
   - List ID: Audience → Settings → Audience ID
   - User ID: In Mailchimp account URL or archive links

4. **Deploy**
   - Push to `main` branch = automatic deployment
   - Set custom domain in Netlify: Domain management → `smallplanetlaw.com`

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

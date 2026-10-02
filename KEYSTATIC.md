# Keystatic review notes (temporary)

Working notes from the page-by-page walkthrough. Delete when done.

## Home page

- [ ] Hero has no phone image (`imageTall` missing in `home.yaml`); phones get the wide crop.
- [ ] `GreenApproach.astro` hardcodes `hero-family-leaf-wide/tall.jpg`; not editable.
- [ ] `Services.astro` hardcodes `leaf.jpg`; not editable.
- [ ] Button targets hardcoded: services button -> `/services`, green button -> `/services#green-planning`.
- [ ] Content typo: "Sustainable Fairwells" (Farewells?).
- [ ] Content: double space in testimonial quote ("who they are,  their love").

## Done

- [x] Rich text: `richText()` (`fields.markdoc.inline`, limited toolbar) in `src/keystatic/fields.ts` now backs `body()`, hero `intro` and card `description` on every page. Renderers switched to `<Markdown />` (hero intro on all pages, card descriptions in Services/Difference/GreenApproach/services/green-planning).
- [x] `CLAUDE.md` pointed at `@agent.md`; now `@AGENTS.md`.

## Research

### Rich text (WYSIWYG)
- Blog/FAQ/events already use `fields.markdoc` (a real rich editor). Only the page `body()` helper is a plain Markdown textarea.
- `fields.markdoc.inline()` is the nestable version (usable inside `fields.object`/`array`, stored as a string in the YAML). Candidate to replace `body()` in `src/keystatic/fields.ts`.
- Needs a trial: the stored value is Markdoc syntax, and `Markdown.astro` currently uses `@astropub/md`. Plain paragraphs/bold/links should be identical, but verify.
- `fields.document` is deprecated; `fields.mdx` disallows HTML and imports. Stay on markdoc.

### Live preview / preview before save
- The official real-time-previews recipe needs Next.js (draft mode) + GitHub/Cloud storage. Not applicable to Astro as-is.
- No built-in preview of unsaved edits on Astro.
- Option A (local dev): the admin and the site run on the same dev server, so edit/save/refresh in another tab; Astro HMR updates on save.
- Option B (production): `previewUrl` on singletons/collections + Keystatic Cloud branches -> Netlify branch deploys. Edit on a branch, preview the deploy, merge to publish.

- [x] SEO: title suffix moved to Site settings; per-page title is the first part only, with a live "Full title" line under the field.
- [x] PDFs: visitors now get `/resources/<slug>.pdf` (route `src/pages/resources/[slug].pdf.ts`) instead of `.../file.pdf`; admin shows an inline PDF preview. Not yet checked: `npm run build` output, and the admin preview in the browser.
- [ ] Lead magnet `downloadUrl` is still a free-text path (now `/resources/<slug>.pdf`); could become a relationship to a resource.

## Left plain on purpose

- SEO meta description, blog `summary`, lead-magnet `teaser` (used in meta tags/cards), testimonial `quote` (wrapped in quote marks).
- Not run: `astro check`; no browser check of the new editor toolbar yet.

## Not yet reviewed

About, Services, Green Planning, FAQ, Events, Resources, Blog, Settings, collections.

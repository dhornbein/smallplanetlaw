// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import { findAndReplace } from 'hast-util-find-and-replace';
import { h } from 'hastscript';

/**
 * Rehype plugin that wraps all ® characters in <sup> tags.
 * Runs at build time — no client JS needed and no markdown clutter.
 * @type {import('unified').Plugin<[], import('hast').Root>}
 */
function rehypeRegisteredTrademark() {
  return (tree) => {
    findAndReplace(tree, [
      [/®/g, () => h('sup', '®')],
    ]);
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://smallplanetlaw.com",
  redirects: {
    '/admin': '/keystatic',
    '/admin/*': '/keystatic/*',
  },
  // Pages are prerendered and rebuilt on every Keystatic commit. Keystatic's own
  // routes and /api/newsletter opt out with `prerender = false`.
  output: 'static',
  adapter: netlify({
    // Use Astro's own image service under `astro dev`. The Netlify one races on a
    // cold start ("reading 'validateOptions'", withastro/astro#16309). Production
    // builds still use the Netlify Image CDN.
    devFeatures: { images: false, environmentVariables: false },
  }),
  integrations: [react(), keystatic()],
  vite: {
    plugins: [tailwindcss()],
    // Pre-bundle the Keystatic admin UI up front. Otherwise Vite discovers it on
    // the first /keystatic request, re-optimizes, and the page loads blank
    // ("504 Outdated Optimize Dep").
    optimizeDeps: {
      include: ['@keystatic/core', '@keystatic/core/ui', '@keystatic/astro/ui', 'pdfjs-dist'],
    },
  },
  markdown: {
    rehypePlugins: [rehypeRegisteredTrademark],
  },
});

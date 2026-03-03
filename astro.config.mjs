// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import netlify from '@astrojs/netlify';
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
  output: 'server',
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    rehypePlugins: [rehypeRegisteredTrademark],
  },
});
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://smallplanetlaw.com",
  // output: 'static' is the default
  // Individual routes can opt into SSR with: export const prerender = false
  vite: {
    plugins: [tailwindcss()],
  },
});
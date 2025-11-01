// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://dhornbein.github.io/",
  base: "/smallplanetlaw/",
  vite: {
    plugins: [tailwindcss()],
  },
});
// @ts-check
import { defineConfig } from 'astro/config';

// Import site configuration
const SITE_URL = 'https://ccc333bbb.github.io';
const BASE_PATH = '/memo';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: 'static',
  // Enable TypeScript checking
  integrations: [],
  // Optimize build
  build: {
    assets: 'assets',
  },
  // Development server configuration
  server: {
    port: 4321,
    host: true,
  },
});
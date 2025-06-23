// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://ccc333bbb.github.io',
  base: '/memo',
  output: 'static',
  i18n: {
    defaultLocale: 'en-US',
    locales: ['en-US', 'zh-CN', 'zh-TW'],
    routing: {
      prefixDefaultLocale: true,
    },
  }
});

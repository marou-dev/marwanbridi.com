// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://marwanbridi.com',
  integrations: [sitemap(), tailwind()],
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});

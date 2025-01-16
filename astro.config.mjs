// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import tailwind from '@astrojs/tailwind';

import vercel from '@astrojs/vercel';

import react from '@astrojs/react';

import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap(), tailwind(), react(), db()],
  adapter: vercel(),
  output: 'server'
});
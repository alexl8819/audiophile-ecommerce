// @ts-check
import { defineConfig } from 'astro/config';

// import sitemap from '@astrojs/sitemap';

import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

import db from '@astrojs/db';

import awsAmplify from '@alexl8819/astro-aws-amplify';

// https://astro.build/config
export default defineConfig({
  integrations: [/*sitemap(),*/ tailwind(), react(), db()],
  adapter: awsAmplify(),
  output: 'server',
  prefetch: true,
  security: {
      checkOrigin: false
  }
});
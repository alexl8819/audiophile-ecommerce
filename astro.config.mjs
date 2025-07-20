// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';

// import sitemap from '@astrojs/sitemap';

import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

import db from '@astrojs/db';

import awsAmplify from 'astro-aws-amplify';

// https://astro.build/config
export default defineConfig({
  integrations: [/*sitemap(),*/ tailwind(), react(), db()],
  adapter: awsAmplify(),
  output: 'server',
  prefetch: true,
  image: {
      service: passthroughImageService()
  },
  security: {
      checkOrigin: false
  }
});
import node from '@astrojs/node';
import react from '@astrojs/react';
import expressiveCode from 'astro-expressive-code';
import { defineConfig, envField } from 'astro/config';

import bundlesize from 'vite-plugin-bundlesize';

export default defineConfig({
  output: 'server',
  image: {
    domains: ['image.mux.com'],
  },
  experimental: {
    env: {
      schema: {
        DATOCMS_API_TOKEN: envField.string({
          context: 'server',
          access: 'secret',
        }),
        SECRET_API_TOKEN: envField.string({
          context: 'server',
          access: 'secret',
        }),
        FASTLY_KEY: envField.string({
          context: 'server',
          access: 'secret',
        }),
        FASTLY_SERVICE_ID: envField.string({
          context: 'server',
          access: 'secret',
        }),
        ROLLBAR_TOKEN: envField.string({
          context: 'server',
          access: 'secret',
        }),
        PIPEDRIVE_TOKEN: envField.string({
          context: 'server',
          access: 'secret',
        }),
        MAILERLITE_TOKEN: envField.string({
          context: 'server',
          access: 'secret',
        }),
        RECAPTCHA_SECRET_KEY: envField.string({
          context: 'server',
          access: 'secret',
        }),
        SLACK_TOKEN: envField.string({
          context: 'server',
          access: 'secret',
        }),
        RECAPTCHA_KEY: envField.string({
          context: 'client',
          access: 'public',
        }),
      },
      validateSecrets: true,
    },
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [react(), expressiveCode()],
  // This project does not use static markdown, only remote. See our <Markdown /> component
  markdown: {},
  vite: {
    plugins: [
      bundlesize({
        limits: [{ name: '**/*', limit: '500 kB' }],
        stats: 'summary',
      }),
    ],
    build: {
      sourcemap: 'hidden',
    },
  },
  adapter: node({
    mode: 'standalone',
  }),
});

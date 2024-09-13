import node from '@astrojs/node';
import react from '@astrojs/react';
import markdownIntegration from '@astropub/md';
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
        MAILERLITE_TOKEN: envField.string({
          context: 'server',
          access: 'secret',
        }),
      },
      validateSecrets: true,
    },
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [react(), markdownIntegration(), expressiveCode()],
  markdown: {
    shikiConfig: {
      theme: 'dracula',
    },
  },
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

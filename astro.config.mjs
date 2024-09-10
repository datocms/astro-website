import node from '@astrojs/node';
import react from '@astrojs/react';
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
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
  integrations: [react()],
  adapter: node({
    mode: 'standalone',
  }),
});

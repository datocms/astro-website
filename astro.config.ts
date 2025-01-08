import node from '@astrojs/node';
import react from '@astrojs/react';
import expressiveCode from 'astro-expressive-code';
import { defineConfig, envField } from 'astro/config';
import { writeFile } from 'fs/promises';

import bundlesize from 'vite-plugin-bundlesize';

export default defineConfig({
  output: 'server',
  image: {
    domains: ['image.mux.com'],
  },
  trailingSlash: 'never',
  env: {
    schema: {
      DEPLOYMENT_DESTINATION: envField.string({
        context: 'server',
        access: 'secret',
        default: 'development',
      }),
      DRAFT_MODE_HOSTNAME: envField.string({
        context: 'server',
        access: 'secret',
        default: 'localhost',
      }),
      PUBLIC_HOSTNAME: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
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
        optional: true,
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
      BASECAMP_ACCESS_TOKEN_PROVIDER_URL: envField.string({
        context: 'server',
        access: 'secret',
      }),
      RECAPTCHA_KEY: envField.string({
        context: 'client',
        access: 'public',
      }),
    },
    validateSecrets: false,
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [
    react(),
    expressiveCode(),
    {
      name: 'rollbar',
      hooks: {
        'astro:config:setup': async ({ injectScript }) => {
          injectScript(
            'page-ssr',
            `
              import Rollbar from 'rollbar';
              import { DEPLOYMENT_DESTINATION, ROLLBAR_TOKEN } from 'astro:env/server';

              new Rollbar({
                accessToken: ROLLBAR_TOKEN,
                captureUncaught: true,
                captureUnhandledRejections: true,
                environment: DEPLOYMENT_DESTINATION,
              });
            `,
          );
        },
      },
    },
    {
      name: 'routes',
      hooks: {
        'astro:routes:resolved': async ({ routes }) => {
          const routesWithParams = routes
            .filter(
              (r) =>
                r.origin === 'project' &&
                r.type === 'page' &&
                r.params.length > 0 &&
                !r.params.includes('pageIndex'),
            )
            .map(({ entrypoint, patternRegex, params }) => ({
              entrypoint:
                entrypoint
                  .replace('src/pages/', '../../../')
                  .replace('.astro', '')
                  .replace('/index', '') + '/_graphql.ts',
              pattern: patternRegex.toString(),
              params,
            }));

          const routesWithNoParams = routes
            .filter((r) => r.origin === 'project' && r.type === 'page' && r.params.length === 0)
            .map(({ pattern }) => pattern);

          await writeFile(
            './src/pages/api/normalize-structured-text/_utils/routes.json',
            JSON.stringify({ routesWithParams, routesWithNoParams }, null, 2),
          );
        },
      },
    },
  ],
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
  security: {
    checkOrigin: false,
  },
  redirects: {
    '/search': '/docs/site-search',
    '/blog/2': '/blog/p/2',
    '/changelog/2': '/product-updates/p/2',
    '/changelog/3': '/product-updates/p/3',
    '/changelog/4': '/product-updates/p/4',
    '/changelog/5': '/product-updates/p/5',
    '/changelog/6': '/product-updates/p/5',
    '/changelog/[...rest]': '/product-updates/[...rest]',
    '/marketplace/hosting/zeit': '/marketplace/hosting/vercel',
    '/cms/react': '/cms/react-cms',
    '/cms/hugo': '/',
    '/cms/nextjs': '/cms/nextjs-cms',
    '/cms/nuxt-js': '/cms/nuxtjs-cms',
    '/cms/jekyll': '/',
    '/cms/middleman': '/',
    '/cms/vue': '/cms/vue-js-cms',
    '/cms/gatsbyjs': '/',
    '/cms/gatsbyjs-cms': '/',
    '/legal/security': '/security',
    '/legal/privacy': '/legal/privacy-policy',
    '/pricing/compare': '/pricing',
    '/partners/harvey-cameron/showcase/jacuzzi ': '/partners',
    '/use-cases': '/',
    '/marketplace/plugins/i/datocms-plugin-gatsby-cloud': '/',
    '/partners/harvey-cameron': '/partners',
    '/partners/dev-kitchen': '/partners',
    '/cms/hugo-cms': '/',
    '/docs/gatsby': '/docs',
    '/docs/other-ssgs': '/docs',
    '/docs/hugo': '/docs',
    '/docs/guides': '/docs',
    '/docs/react/managing-images': '/docs',
    '/marketplace/plugins/i/git@github.com:voorhoede/datocms-plugin-editor-help.git':
      '/marketplace/plugins',
    '/marketplace/plugins/i/license': '/marketplace/plugins',
    '/docs/gatsby/gatsby-cloud': '/docs',
    '/docs/single-page-apps/react': '/docs',
    '/docs/static-generators/gatsbyjs': '/docs',
    '/docs/react/structured-text-fields': '/docs',
    '/marketplace/plugins/i/LICENSE.txt': '/docs/plugin-sdk/publishing-to-marketplace',
    '/docs/middleman': '/docs',
    '/docs/vue/rendering-structured-text-fields': '/docs/nuxt/rendering-structured-text-fields',
    '/product-updates/undefined': '/product-updates',
    '/docs/content-management-api/resources/item/instances/docs/content-management-api/resources/item/instances':
      '/docs/content-management-api',
    '/marketplace/starters/next-js-multilingual-blog': '/marketplace/starters',
    '/partners/tecnica': '/partners',
    '/docs/hugo/fields': '/docs',
    '/partners/harvey-cameron/showcase/jacuzzi': '/partners',
    '/docs/jekyll/fields': '/docs',
    '/docs/static-generators/middleman/image-manipulation': '/docs',
    '/docs/gatsby/examples': '/docs',
    '/docs/guides/custom-assets-domain/google-cloud-storage':
      '/marketplace/enterprise/google-cloud-storage',
    '/use-cases/docs': '/use-cases/headless-cms-knowledge-management',
    '/docs/guides/custom-assets-domain': '/docs',
    '/docs/deployments/zeit': '/docs',
    '/foo': '/docs',
    // 08.01.2025
    '/cda-explorer': '/features/headless-cms-graphql',
    '/docs/pro-tips/manage-draft-published-state-by-locale': '/docs/general-concepts/localization',
    '/docs/building-plugins/sdk-reference': '/docs/plugin-sdk/build-your-first-plugin',
    '/docs/general-concepts/environments': '/docs/content-management-api/setting-the-environment',
    '/docs/guides/building-plugins': '/docs/plugin-sdk/build-your-first-plugin',
    '/docs/general-concepts/images': '/docs/asset-api/images',
    '/docs/content-management-api/rate-limits': '/docs/content-delivery-api/technical-limits',
    '/marketplace/starters/next-13-company-landing-page-demo':
      '/marketplace/starters/next-js-starter-kit',
    '/docs/general-concepts/transfer': '/docs/plans-pricing-and-billing/transfer',
    '/marketplace/starters/nextjs-blog': '/marketplace/starters/next-js-starter-kit',
    '/plugins/i/datocms-plugin-conditional-fields':
      '/marketplace/plugins/i/datocms-plugin-conditional-fields',
    '/docs/other-ssgs/accessing-records': '/docs',
    '/docs/content-management-api/ruby-client': '/docs',
    '/marketplace/starters/react-js-lodging-spa': '/marketplace/starters',
    '/docs/jekyll/image-manipulation': '/docs',
    '/docs/guides/installing-site-search/widget': '/docs/site-search',
    '/features/structured-text': '/docs/content-modelling/structured-text',
    '/docs/react': '/docs',
    '/docs/jekyll': '/docs',
    '/docs/guides/building-plugins/creating-a-new-plugin':
      '/docs/plugin-sdk/build-your-first-plugin',
    '/docs/building-plugins/using-the-generator': '/docs/plugin-sdk/build-your-first-plugin',
    '/docs/guides/offline-backups': '/docs/import-and-export/export-data',
    '/docs/static-generators/hugo/localization': '/docs',
    '/marketplace/starters/next-js-multilingual-blog-per-local-publishing': '/marketplace/starters',
    '/docs/static-generators/metalsmith': '/docs',
    '/docs/building-plugins': '/docs/plugin-sdk/build-your-first-plugin',
    '/docs/content-delivery-api/endpoint': '/docs/content-delivery-api/api-endpoints',
    '/marketplace/starters/middleman-portfolio': '/marketplace/starters',
    '/docs/site-search/excluding-text': '/docs/site-search',
    '/docs/plugin-sdk/field-extension': '/docs/plugin-sdk/field-extensions',
    '/product-updates/p/1': '/product-updates',
    '/docs/guides/localizing-images': '/docs/general-concepts/media-area#localization',
    '/docs/content-delivery-api/modular-content': '/docs/content-modelling/modular-content',
    '/docs/static-generators/other-ssg/modular-content': '/docs',
    '/docs/content-delivery-api/rate-limiting': '/docs/content-delivery-api/technical-limits',
    '/docs/content-management-api/resources/upload/updatebut':
      '/docs/content-management-api/resources/item/update',
    '/docs/guides/single-sign-on': '/docs/content-management-api/resources/sso-settings',
    '/partners/locale': '/tech-partners/locale',
    '/features/graphql-content-api': '/features/headless-cms-graphql',
    '/docs/deployments/netlify': '/marketplace/hosting/netlify',
    '/docs/plugins/creating-a-new-plugin': '/docs/plugin-sdk/build-your-first-plugin',
  },
});

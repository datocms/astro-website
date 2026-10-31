import node from '@astrojs/node';
import react from '@astrojs/react';
import expressiveCode from 'astro-expressive-code';
import { defineConfig, envField } from 'astro/config';
import { writeFile } from 'fs/promises';
import type { Plugin } from 'vite';
import { redesignCssArea } from './redesign-css-scope.mjs';

const MAX_CLIENT_CHUNK_SIZE_IN_KB = 500;

/*
 * Cascade layers by role, for the CSS of the redesign only (the
 * prototype, see src/REDESIGN.md). Without layers, two rules with the
 * same specificity win or lose by the order of the CSS in the page, and
 * the dev server and the build give different orders. With layers, a
 * rule in a higher layer wins over a rule in a lower layer, in any order.
 *
 * The order of the layers is in src/layouts/Layout.astro (the first child
 * of <head>) and at the top of src/styles/global.css:
 * reset, tokens, base, vendor, blocks, sections, pages.
 *
 * This plugin puts a CSS module in a layer only when it is CSS of the
 * redesign (redesignCssArea() in redesign-css-scope.mjs):
 * - the modules of src/components/, except the old components in
 *   src/components/legacy/;
 * - the modules of src/scenes/;
 * - the modules of the ported pages in REDESIGN_PAGE_DIRS;
 * - the CSS of the scene kit (@datocms/product-scenes).
 * The old CSS modules get no layer. Thus the cascade of the old pages
 * does not change.
 *
 * It runs before the CSS plugin of Vite, thus CSS modules and minification
 * see the @layer block. The layer comes from:
 * 1. A marker on the first line of the file: "/* @layer <name> *\/".
 * 2. Else the path: the kit is "vendor", src/pages/ is "pages", all
 *    other modules are "sections".
 *
 * src/scenes/diagram/ stays in "sections", with the scenes. A scene puts
 * a class of the diagram and its own class on the same element. The
 * states of the diagram (`.change[data-changed]`) must win over the own
 * class of the scene, and only the specificity in one layer gives that.
 */
const LAYER_MARKER = /^\s*\/\*\s*@layer\s+([\w-]+)\s*\*\//;
// An @property rule has no nested braces.
const PROPERTY_RULE = /@property\s+[\w-]+\s*\{[^{}]*\}/g;

function cssLayers(): Plugin {
  return {
    name: 'css-layers',
    enforce: 'pre',
    transform(code, id) {
      const path = id.split('?')[0] ?? id;
      const isKit = path.endsWith('/product-scenes.css') && path.includes('product-scenes');
      if (!isKit && !path.endsWith('.module.css')) return null;

      const area = isKit ? 'vendor' : redesignCssArea(path);
      // Old CSS: no layer.
      if (!area) return null;

      // Do not wrap a file two times.
      if (/^\s*@layer\s+[\w-]+\s*\{/.test(code)) return null;

      const marker = code.match(LAYER_MARKER);
      let layer = 'sections';
      if (marker?.[1]) layer = marker[1];
      else if (isKit) layer = 'vendor';
      else if (area === 'pages') layer = 'pages';

      // Keep the @property rules out of the layer. A registered property
      // is global, and some tools do not accept @property in a block.
      // Each rule becomes empty lines, thus the line numbers stay the same.
      const properties: string[] = [];
      const body = code.replace(PROPERTY_RULE, (rule) => {
        properties.push(rule);
        return rule.replace(/[^\n]/g, '');
      });

      // The opening of the block is on line 1, and the hoisted rules come
      // after the end. Thus each line keeps its number, and the source map
      // of the file before this step is still correct (map: null).
      return {
        code: `@layer ${layer} {${body}\n}\n${properties.join('\n')}`,
        map: null,
      };
    },
  };
}

export default defineConfig({
  base: '/', // Can be any string, but MUST be set or component imports on astro build will fail.
  output: 'server',
  image: {
    domains: ['image.mux.com', 'www.datocms-assets.com'],
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
      DATOCMS_ENVIRONMENT: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
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
      // Cloudflare Turnstile secret for the forms. Unset → verification is skipped
      // for that environment (see `~/lib/turnstile`).
      TURNSTILE_SECRET_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      SLACK_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      BASECAMP_ACCOUNT_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
      BASECAMP_CLIENT_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
      BASECAMP_CLIENT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),
      BASECAMP_REFRESH_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      BASECAMP_USER_AGENT: envField.string({
        context: 'server',
        access: 'secret',
      }),
      FRONT_CHANNEL_URL_SALES: envField.string({
        context: 'server',
        access: 'secret',
      }),
      FRONT_CHANNEL_URL_PARTNER_PROGRAM: envField.string({
        context: 'server',
        access: 'secret',
      }),
      FRONT_CHANNEL_URL_SUPPORT: envField.string({
        context: 'server',
        access: 'secret',
      }),
      // Cloudflare Turnstile sitekey for the forms, baked at build time. Unset → no
      // widget is rendered (see `~/lib/loadTurnstile`).
      TURNSTILE_SITE_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      KNOWLEDGE_BASE_URL: envField.string({
        context: 'client',
        access: 'public',
      }),
      OPENAI_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      BASE64_SPAM_DETECTOR_PROMPT: envField.string({
        context: 'server',
        access: 'secret',
      }),
      LINKEDIN_ACCESS_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      LINKEDIN_PARTNER_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      // Base URL of the `llms-txt` Cloudflare Worker that serves the generated
      // llms.txt bundles out of R2. No trailing slash.
      //
      // `access: 'public'` means this is inlined at build time, so changing it
      // in the environment has no effect until the site is rebuilt.
      LLMS_BLOB_BASE_URL: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
      }),
      // Base URL of the `datocms-ui-fonts` Cloudflare Worker
      // (`workers/ui-fonts/`) that serves the UI fonts out of R2. No trailing
      // slash. Inlined at build time, like LLMS_BLOB_BASE_URL.
      UI_FONTS_BASE_URL: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
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
                (r.origin === 'project' && r.type === 'endpoint') ||
                (r.origin === 'project' &&
                  r.type === 'page' &&
                  r.params.length > 0 &&
                  !r.params.includes('pageIndex')),
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

          const routesWithNoParams = [
            ...routes
              .filter((r) => r.origin === 'project' && r.type === 'page' && r.params.length === 0)
              .map(({ pattern }) => pattern),
            ...routes
              .filter(
                (r) =>
                  r.origin === 'project' &&
                  r.type === 'endpoint' &&
                  r.params.length === 0 &&
                  !r.pattern.startsWith('/api/') &&
                  !r.pattern.endsWith('.js'),
              )
              .map(({ pattern }) => pattern),
          ];

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
      cssLayers(),
      // Stop the build when a client JS chunk that a page loads immediately is
      // larger than the limit. The plugin examines the entry chunks and the
      // chunks that they import statically. It ignores the chunks that load
      // only through a dynamic import (for example, Shiki grammars).
      // This replaces `vite-plugin-bundlesize`, which does not work with Vite 8.
      {
        name: 'client-chunk-size-limit',
        applyToEnvironment: (environment) => environment.name === 'client',
        generateBundle(_options, bundle) {
          const chunks = Object.values(bundle).filter((file) => file.type === 'chunk');
          const chunksToExamine = new Set(chunks.filter((chunk) => chunk.isEntry));

          for (const chunk of chunksToExamine) {
            for (const importedFileName of chunk.imports) {
              const importedChunk = bundle[importedFileName];
              if (importedChunk?.type === 'chunk') chunksToExamine.add(importedChunk);
            }
          }

          const chunksOverLimit = [...chunksToExamine].flatMap((file) => {
            const sizeInKb = Buffer.byteLength(file.code) / 1000;
            return sizeInKb > MAX_CLIENT_CHUNK_SIZE_IN_KB
              ? [`${file.fileName} (${sizeInKb.toFixed(1)} kB)`]
              : [];
          });

          if (chunksOverLimit.length > 0) {
            this.error(
              `These client chunks are larger than ${MAX_CLIENT_CHUNK_SIZE_IN_KB} kB:\n${chunksOverLimit.join('\n')}`,
            );
          }
        },
      },
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
    '/cma-ts-schema':
      '/docs/content-management-api/resources/item#type-safe-development-with-typescript',
    '/search': '/docs/site-search',
    // The feature pages of the Editing pillar redirect to chapters of /editor-experience.
    '/features/structured-content-cms': '/editor-experience#structured-content',
    '/features/visual-editing': '/editor-experience#visual-editing',
    '/features/dynamic-layouts': '/editor-experience#dynamic-layouts',
    '/features/headless-cms-multi-language': '/editor-experience#localization',
    '/features/workflow-cms': '/editor-experience#workflows',
    '/features/editor-experience': '/editor-experience',
    // The dark mode page is only an entry in the index of the features.
    '/features/dark-mode': '/features#editor-experience',
    // The feature pages of the Developers pillar redirect to chapters of /developers.
    '/features/schema-builder': '/developers#schema',
    '/features/headless-cms-graphql': '/developers#graphql',
    '/features/real-time-api': '/developers#real-time',
    '/features/cache-tags': '/developers#delivery',
    // The numbers section holds the claims of the CDN page.
    '/features/worldwide-cdn': '/developers#numbers',
    '/features/data-integrity': '/developers#environments',
    '/features/developer-experience': '/developers',
    '/features/plugins': '/developers#plugins',
    '/made-for/developers': '/developers',
    // The feature pages of the Media pillar redirect to chapters of /media.
    '/features/images-api': '/media#images',
    '/features/video-api': '/media#video',
    // The AI page redirects to the AI pillar.
    '/features/ai': '/ai',
    // The about page redirects to the philosophy page.
    '/company/about': '/philosophy',
    '/blog/2': '/blog/p/2',
    '/changelog/2': '/product-updates/p/2',
    '/changelog/3': '/product-updates/p/3',
    '/changelog/4': '/product-updates/p/4',
    '/changelog/5': '/product-updates/p/5',
    '/changelog/6': '/product-updates/p/5',
    '/changelog/[...rest]': '/product-updates/[...rest]',
    '/marketplace/hosting/zeit': '/docs/hosting-and-deployment/vercel',
    '/marketplace/hosting': '/docs/hosting-and-deployment',
    '/marketplace/hosting/netlify': '/docs/hosting-and-deployment/netlify',
    '/marketplace/hosting/vercel': '/docs/hosting-and-deployment/vercel',
    '/marketplace/hosting/gitlab': '/docs/hosting-and-deployment/gitlab',
    '/marketplace/hosting/custom-webhook': '/docs/hosting-and-deployment/custom-webhook',
    '/marketplace/enterprise': '/docs/enterprise-apps',
    '/marketplace/enterprise/aws-s3': '/docs/enterprise-apps/aws-s3',
    '/marketplace/enterprise/azure-blob-storage': '/docs/enterprise-apps/azure-blob-storage',
    '/marketplace/enterprise/google-cloud-storage': '/docs/enterprise-apps/google-cloud-storage',
    '/marketplace/enterprise/cloudflare-r2': '/docs/enterprise-apps/cloudflare-r2',
    '/marketplace/enterprise/okta-sso': '/docs/enterprise-apps/okta-sso',
    '/marketplace/enterprise/azure-active-directory': '/docs/enterprise-apps/microsoft-entra-id',
    '/marketplace/enterprise/onelogin-sso': '/docs/enterprise-apps/onelogin-sso',
    '/marketplace/enterprise/google-workspace': '/docs/enterprise-apps/google-workspace',
    // The marketplace has only plugins and starters left.
    '/marketplace': '/plugins',
    '/marketplace/plugins': '/plugins',
    '/marketplace/plugins/[...rest]': '/plugins/[...rest]',
    '/marketplace/starters': '/starters',
    '/marketplace/starters/[...rest]': '/starters/[...rest]',
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
    '/use-cases/knowledge-management': '/',
    '/use-cases/ecommerce': '/',
    '/use-cases/modern-websites': '/',
    '/use-cases/digital-publishing': '/',
    '/use-cases/headless-cms-travel': '/',
    '/lp/migcs': '/',
    '/lp/migcs/thanks': '/',
    '/lp/modernize-cms': '/partners/voorhoede',
    '/lp/modernize-cms/thanks': '/partners/voorhoede',
    '/lp/nuxt2eol': '/partners/voorhoede',
    '/lp/nuxt2eol/thanks': '/partners/voorhoede',
    '/marketplace/plugins/i/datocms-plugin-gatsby-cloud': '/',
    '/partners/harvey-cameron': '/partners',
    '/partners/dev-kitchen': '/partners',
    '/cms/hugo-cms': '/',
    '/docs/gatsby': '/docs',
    '/docs/other-ssgs': '/docs',
    '/docs/hugo': '/docs',
    '/docs/guides': '/docs',
    '/docs/react/managing-images': '/docs',
    '/marketplace/plugins/i/git@github.com:voorhoede/datocms-plugin-editor-help.git': '/plugins',
    '/marketplace/plugins/i/license': '/plugins',
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
    '/marketplace/starters/next-js-multilingual-blog': '/starters',
    '/partners/tecnica': '/partners',
    '/docs/hugo/fields': '/docs',
    '/partners/harvey-cameron/showcase/jacuzzi': '/partners',
    '/docs/jekyll/fields': '/docs',
    '/docs/static-generators/middleman/image-manipulation': '/docs',
    '/docs/gatsby/examples': '/docs',
    '/docs/guides/custom-assets-domain/google-cloud-storage':
      '/docs/enterprise-apps/google-cloud-storage',
    '/use-cases/docs': '/',
    '/docs/guides/custom-assets-domain': '/docs',
    '/docs/deployments/zeit': '/docs',
    '/foo': '/docs',
    // 08.01.2025
    '/cda-explorer': '/developers#graphql',
    '/docs/pro-tips/manage-draft-published-state-by-locale': '/docs/general-concepts/localization',
    '/docs/building-plugins/sdk-reference': '/docs/plugin-sdk/build-your-first-plugin',
    '/docs/general-concepts/environments': '/docs/content-management-api/setting-the-environment',
    '/docs/guides/building-plugins': '/docs/plugin-sdk/build-your-first-plugin',
    '/docs/general-concepts/images': '/docs/asset-api/images',
    '/docs/content-management-api/rate-limits': '/docs/content-delivery-api/technical-limits',
    '/marketplace/starters/next-13-company-landing-page-demo': '/starters/next-js-starter-kit',
    '/docs/general-concepts/transfer': '/docs/plans-pricing-and-billing/transfer',
    '/marketplace/starters/nextjs-blog': '/starters/next-js-starter-kit',
    '/docs/other-ssgs/accessing-records': '/docs',
    '/docs/content-management-api/ruby-client': '/docs',
    '/marketplace/starters/react-js-lodging-spa': '/starters',
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
    '/marketplace/starters/next-js-multilingual-blog-per-local-publishing': '/starters',
    '/docs/static-generators/metalsmith': '/docs',
    '/docs/building-plugins': '/docs/plugin-sdk/build-your-first-plugin',
    '/docs/content-delivery-api/endpoint': '/docs/content-delivery-api/api-endpoints',
    '/marketplace/starters/middleman-portfolio': '/starters',
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
    '/features/graphql-content-api': '/developers#graphql',
    '/docs/deployments/netlify': '/docs/hosting-and-deployment/netlify',
    '/docs/plugins/creating-a-new-plugin': '/docs/plugin-sdk/build-your-first-plugin',
    '/docs/visual-editing/how-to-use-visual-editing': '/docs/content-link/how-to-use-content-link',
    '/documentation': '/docs',
    '/docs/content-delivery-api/tree-like-collections':
      '/docs/content-delivery-api/hierarchical-sorting',
    '/docs/content-modelling/trees': '/docs/content-modelling/hierarchical-sorting',
    '/docs/plugin-sdk': '/docs/plugin-sdk/introduction',
    '/team/best-cms-for-developers': '/developers',
    '/team/cms-digital-marketing': '/editor-experience',
    '/team/content-creators': '/editor-experience',
    '/made-for/marketers': '/editor-experience',
    '/made-for/content-creators': '/editor-experience',
    '/customer-stories': '/blog/casual-chats',
    '/customer-stories/[...rest]': '/blog/casual-chats/[...rest]',
    // The casual chats are part of the blog.
    '/casual-chats': '/blog/casual-chats',
    '/casual-chats/[...rest]': '/blog/casual-chats/[...rest]',
    // The customers pages redirect to the case studies. The product overview is gone.
    '/success-stories': '/case-studies',
    '/customers': '/case-studies',
    '/how-to-datocms': '/academy',
    '/customers/[...rest]': '/case-studies/[...rest]',
    '/product': '/features',
    '/use-cases/headless-cms-publishing': '/',
    '/use-cases/headless-cms-websites': '/',
    '/use-cases/headless-ecommerce': '/',
    '/use-cases/headless-cms-knowledge-management': '/',
    '/partners/boldboy': '/partners/peter-coolen',
    '/marketplace/starters/nuxt-js-blog': '/blog/how-to-build-a-nuxt-blog',
    '/docs/building-plugins/publishing': '/docs/plugin-sdk/publishing-to-marketplace',
    '/docs/pro-tips/create-a-select-with-a-single-line-string-field':
      '/docs/content-management-api/resources/field',
    '/docs/plugins/publishing': '/docs/plugin-sdk/publishing-to-marketplace',
    '/docs/building-plugins/creating-a-new-plugin': '/docs/plugin-sdk/build-your-first-plugin',
    '/docs/next-js/setting-up-next-js-preview-mode':
      '/docs/legacy-next-js-documentation/setting-up-next-js-preview-mode',
    '/blog/static-ecommerce-website-snipcart-gatsbyjs-datocms': '/starters/ecommerce-website',
    '/blog/live-preview-changes-on-gatsby-preview': '/docs',
    '/enterprise': '/enterprise-headless-cms',
    '/docs/content-management-api/resources/item/batch_unpublish':
      '/docs/content-management-api/resources/item/bulk_unpublish',
    '/docs/content-management-api/resources/item/batch_destroy':
      '/docs/content-management-api/resources/item/bulk_destroy',
    '/docs/plugins/install': '/docs/general-concepts/plugins',
    '/docs/content-management-api/resources/item/batch_publish':
      '/docs/content-management-api/resources/item/bulk_publish',
    '/docs/building-plugins/entry-point': '/docs/plugin-sdk/introduction',
    '/marketplace/plugins/i/CHANGELOG.md': '/plugins',
    '/docs/content-management-api/resources/upload/batch_add_tags':
      '/docs/content-management-api/resources/upload/bulk_tag',
    '/docs/content-management-api/resources/sso-token':
      '/docs/content-management-api/resources/sso-settings',
    '/marketplace/plugins/i/shopify-product-plugin-datocms':
      '/plugins/i/datocms-plugin-shopify-product',
    '/marketplace/plugins/i/datocms-plugin-datocms-plugin-next-preview-redux':
      '/plugins/i/datocms-plugin-web-previews',
    '/docs/content-management-api/resources/upload/batch_destroy':
      '/docs/content-management-api/resources/item/bulk_destroy',
    '/docs/remix': '/docs/react-router',
    '/docs/remix/get-started': '/docs/react-router',
    '/docs/remix/remix-images': '/docs/react-router/managing-images',
    '/docs/remix/remix-structured-text-fields': '/docs/react-router/structured-text-fields',
    '/docs/remix/add-seo-to-remix': '/docs/react-router/seo-management',
    '/docs/remix/setting-up-a-preview-mode-with-remix':
      '/docs/react-router/setting-up-a-preview-mode',
    '/docs/remix/using-cache-tags': '/docs/content-delivery-api/cache-tags',
    '/docs/remix/[...rest]': '/docs/react-router/[...rest]',
    '/cms/remix': '/docs/react-router',
    '/cms/remix-cms': '/docs/react-router',
    '/academy/ancillary-concepts': '/academy/frontend-frameworks',
    '/academy/ancillary-concepts/react-concepts': '/academy/frontend-frameworks/react',
    '/academy/ancillary-concepts/astro-concepts': '/academy/frontend-frameworks/astro',
    '/academy/ancillary-concepts/next-js-concepts': '/academy/frontend-frameworks/nextjs',
  },
});

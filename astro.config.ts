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
    '/marketplace/plugins/i/datocms-plugin-yoast-seo':
      '/marketplace/plugins/i/datocms-plugin-seo-readability-analysis',
    '/docs/introduction/custom-assets-domain': '/marketplace/enterprise/aws-s3',
    '/search': '/docs/site-search',
    '/docs/search': '/docs/site-search',
    '/about': '/company/about',
    '/brand-assets': '/company/brand-assets',
    '/docs/building-plugins/[...rest]': '/docs/legacy-plugins/[...rest]',
    '/docs/guides/custom-assets-domain/[...rest]': '/marketplace/enterprise/[...rest]',
    '/docs/guides/single-sign-on': '/marketplace/enterprise',
    '/docs/guides/single-sign-on/configure-sso-with-okta': '/marketplace/enterprise/okta-sso',
    '/docs/guides/single-sign-on/configure-sso-with-onelogin':
      '/marketplace/enterprise/onelogin-sso',
    '/docs/deployments/travis': '/marketplace/hosting/travis-ci',
    '/docs/deployments/[...rest]': '/marketplace/hosting/[...rest]',
    '/plugins/i/@stackbitdatocms-plugin-typed-list':
      '/marketplace/plugins/i/@stackbit/datocms-plugin-typed-list',
    '/plugins/i/@ecologicdatocms-plugin-multiselect':
      '/marketplace/plugins/i/@ecologic/datocms-plugin-multiselect',
    '/plugins/i/@ecologicdatocms-plugin-ordered-tag-editor':
      '/marketplace/plugins/i/@ecologic/datocms-plugin-ordered-tag-editor',
    '/content-management-api': '/docs/content-management-api',
    '/plugins': '/marketplace/plugins',
    '/plugins/i/[...rest]': '/marketplace/plugins/i/[...rest]',
    '/docs/plugins/entry-point': '/docs/building-plugins/entry-point',
    '/docs/plugins/creating-a-new-plugin': '/docs/building-plugins/creating-a-new-plugin',
    '/docs/plugins/publishing': '/docs/building-plugins/publishing',
    '/docs/guides/offline-backups': '/docs/import-and-export/export-data',
    '/docs/general-concepts/transfer': '/docs/plans-pricing-and-billing/transfer',
    '/docs/content-management-api/js-client':
      '/docs/content-management-api/using-the-nodejs-clients',
    '/docs/security': '/security',
    '/docs/guides/private-videos': '/docs/content-modelling/external-video-field',
    '/docs/content-delivery-api/overview': '/docs/content-delivery-api',
    '/docs/content-delivery-api/endpoint': '/docs/content-delivery-api/api-endpoints',
    '/docs/content-delivery-api/complexity_limiting': '/docs/content-delivery-api/complexity',
    '/docs/content-delivery-api/first-request': '/docs/content-delivery-api/your-first-request',
    '/docs/content-delivery-api/querying': '/docs/content-delivery-api/how-to-fetch-records',
    '/docs/content-delivery-api/filtering': '/docs/content-delivery-api/filtering-records',
    '/docs/content-delivery-api/ordering': '/docs/content-delivery-api/ordering-records',
    '/docs/content-delivery-api/modular-content':
      '/docs/content-delivery-api/modular-content-fields',
    '/docs/content-delivery-api/uploads': '/docs/content-delivery-api/images-and-videos',
    '/docs/content-delivery-api/seo': '/docs/content-delivery-api/seo-and-favicon',
    '/blog/2': '/blog/p/2',
    '/changelog/2': '/product-updates/p/2',
    '/changelog/3': '/product-updates/p/3',
    '/changelog/4': '/product-updates/p/4',
    '/changelog/5': '/product-updates/p/5',
    '/changelog/6': '/product-updates/p/5',
    '/changelog/[...rest]': '/product-updates/[...rest]',
    '/docs/general-concepts/pricing': '/docs/plans-pricing-and-billing',
    '/docs/guides/installing-site-search/[...rest]': '/docs/site-search/[...rest]',
    '/docs/guides/[...rest]': '/docs/[...rest]',
    '/docs/static-generators/gatsbyjs/[...rest]': '/docs/gatsby/[...rest]',
    '/docs/static-generators/[...rest]': '/docs/[...rest]',
    '/docs/single-page-apps/[...rest]': '/docs/[...rest]',
    '/marketplace/hosting/zeit': '/marketplace/hosting/vercel',
    '/cms/react': '/cms/react-cms',
    '/cms/hugo': '/cms/hugo-cms',
    '/cms/nextjs': '/cms/nextjs-cms',
    '/cms/nuxt-js': '/cms/nuxtjs-cms',
    '/cms/jekyll': '/cms/jekyll-cms',
    '/cms/middleman': '/cms/middleman-cms',
    '/cms/vue': '/cms/vue-js-cms',
    '/cms/gatsbyjs': '/cms/gatsbyjs-cms',
    '/features/video-streaming-encoding': '/features/video-api',
    '/features/graphql-content-api': '/features/headless-cms-graphql',
    '/features/multi-language': '/features/headless-cms-multi-language',
    '/features/workflows': '/features/workflow-cms',
    '/features/real-time': '/features/real-time-api',
    '/features/structured-text': '/features/structured-content-cms',
    '/team/digital-marketers': '/team/cms-digital-marketing',
    '/blog/what-is-an-headless-cms': '/blog/what-is-a-headless-cms',
    '/team/developers': '/team/best-cms-for-developers',
    '/enterprise': '/enterprise-headless-cms',
    '/marketplace/starters/nextjs-blog': '/marketplace/starters/nextjs-template-blog',
    '/blog/offer-responsive-progressive-lqip-images-in-2020':
      '/blog/best-way-for-handling-react-images',
    '/blog/static-ecommerce-website-snipcart-gatsbyjs-datocms': '/blog/gatsby-ecommerce-tutorial',
    '/cms/gatsbyjs-cms': '/cms/gatsby-cms',
    '/legal/security': '/security',
    '/legal/privacy': '/legal/privacy-policy',
    '/docs/pro-tips/manage-draft-published-state-by-locale':
      '/docs/general-concepts/localization#locale-based-publishing',
    '/marketplace/starters/next-js-multilingual-blog-per-local-publishing':
      '/docs/general-concepts/localization#locale-based-publishing',
    '/pricing/compare': '/pricing',
    '/docs/content-management-api/rate-limits': '/docs/content-management-api/technical-limits',
    '/docs/content-delivery-api/rate-limiting': '/docs/content-delivery-api/technical-limits',
    '/partners/locale': '/tech-partners/crowdin',
    '/partners/imgix': '/tech-partners/imgix',
    '/blog/introducing-visual-editing-for-vercel-and-datocms-enterprise-customers':
      '/blog/introducing-content-link-for-vercel-and-datocms-enterprise-customers',
    '/blog/july-update-visual-editing-and-per-locale-publishing':
      '/blog/july-update-content-link-and-per-locale-publishing',
    '/docs/visual-editing': '/docs/content-link/how-to-use-content-link',
    '/docs/visual-editing/how-to-use-visual-editing': '/docs/content-link/how-to-use-content-link',
    '/partners/harvey-cameron/showcase/jacuzzi ': '/partners',
    '/docs/plugins/install': '/docs/general-concepts/plugins',
    '/blog/live-preview-changes-on-gatsby-preview': '/blog',
    '/docs/localizing-images': '/docs/content-delivery-api/images-and-videos',
    '/cda-explorer': '/docs/content-delivery-api',
    '/docs/content-management-api/using-the-ruby-client': '/docs/content-management-api',
    '/use-cases': '/',
    '/docs/cdn-settings/advanced-asset-settings': '/docs/asset-api/asset-cdn-settings',
    '/docs/general-concepts/videos': '/docs/asset-api/videos',
    '/docs/general-concepts/images': '/docs/asset-api/images',
    '/docs/project-starters-and-templates': '/docs/general-concepts/project-starters-and-templates',
    '/docs/project-starters-and-templates/clone-project-button':
      '/docs/general-concepts/project-starters-and-templates#generate-a-clone-project-button',
    '/docs/project-starters-and-templates/project-starter-button':
      '/docs/general-concepts/project-starters-and-templates#generate-a-project-starter-button',
    '/blog/headless-cms-unconventional-use-cases': '/customer-stories/trip-to-japan',
    '/docs/plugin-sdk': '/docs/plugin-sdk/introduction',
    '/docs/general-concepts/environments':
      '/docs/general-concepts/primary-and-sandbox-environments',
    '/docs/react/[...rest]': '/docs/next-js/[...rest]',
    '/marketplace/plugins/i/datocms-plugin-gatsby-cloud': '/',
    '/docs/content-management-api/resources/sso-token':
      '/docs/content-management-api/resources/sso-settings/generate_token',
    '/docs/next-js/setting-up-next-js-preview-mode':
      '/docs/legacy-next-js-documentation/setting-up-next-js-preview-mode',
    '/docs/plugin-sdk/execute-code-on-boot': '/docs/plugin-sdk/event-hooks',
    '/partners/harvey-cameron': '/partners',
    '/docs/vue/display-videos': '/docs/nuxt',
    '/docs/vue/loading-responsive-progressive-images-from-datocms': '/docs/nuxt',
    '/docs/vue': '/docs/nuxt',
    '/docs/vue/[...rest]': '/docs/nuxt/[...rest]',
    '/docs/sveltekit/getting-started-with-sveltekit-and-datocms': '/docs/svelte',
    '/partners/dev-kitchen': '/partners',
    '/docs/plugin-sdk/sdk/field-extensions ': '/docs/plugin-sdk/field-extensions',
    '/cms/hugo-cms': '/',
    '/marketplace/starters/next-13-company-landing-page-demo':
      '/marketplace/starters/next-js-starter-kit',
    '/docs/agency-partner-program/benefits': '/partner-program',
    '/docs/site-search/excluding-text':
      '/docs/site-search/how-the-crawling-works#excluding-content-from-indexing',
    '/docs/building-plugins/creating-a-new-plugin': '/docs/plugin-sdk/introduction',
    '/docs/building-plugins/sdk-reference': '/docs/plugin-sdk/introduction',
    '/docs/building-plugins/entry-point': '/docs/plugin-sdk/introduction',
    '/docs/gatsby': '/docs',
    '/docs/other-ssgs': '/docs',
    '/docs/guides/building-plugins/sdk-reference': '/docs/plugin-sdk/build-your-first-plugin',
    '/docs/react': '/docs',
    '/docs/guides/building-plugins/creating-a-new-plugin':
      '/docs/plugin-sdk/build-your-first-plugin',
    '/docs/hugo': '/docs',
    '/docs/building-plugins': '/docs/plugin-sdk/build-your-first-plugin',
    '/docs/building-plugins/using-the-generator': '/docs/plugin-sdk/build-your-first-plugin',
    '/docs/content-delivery-api/docs/general-concepts/roles-and-permission-system':
      '/docs/general-concepts/roles-and-permission-system',
    '/docs/plugin-sdk/render%E2%80%8BUpload%E2%80%8BSidebarPanel':
      '/docs/plugin-sdk/sidebar-panels',
    '/docs/plugin-sdk/sdk/field-extensions': '/docs/plugin-sdk/field-extensions',
    '/docs/building-plugins/install':
      '/docs/plugin-sdk/build-your-first-plugin#install-your-plugin-in-the-datocms-web-app',
    '/docs/building-plugins/publishing': '/docs/plugin-sdk/publishing-to-marketplace',
    '/docs/guides': '/docs',
    '/docs/react/managing-images': '/docs',
    '/marketplace/plugins/i/git@github.com:voorhoede/datocms-plugin-editor-help.git':
      '/marketplace/plugins',
    '/marketplace/plugins/i/license': '/marketplace/plugins',
    '/docs/gatsby/gatsby-cloud': '/docs',
    '/docs/single-page-apps/react': '/docs',
    '/docs/static-generators/gatsbyjs': '/docs',
    '/marketplace/plugins/i/contributing.md': '/docs/plugin-sdk/publishing-to-marketplace',
    '/marketplace/starters/middleman-portfolio': '/marketplace/starters',
    '/docs/react/structured-text-fields': '/docs',
    '/marketplace/plugins/i/LICENSE.txt': '/docs/plugin-sdk/publishing-to-marketplace',
    '/docs/middleman': '/docs',
    '/docs/guides/localizing-images': '/docs/asset-api/images',
    '/blog/introducing-inherited-roles-for-greater-modularity-in-role-management':
      '/blog/introducing-inherited-roles',
    '/marketplace/plugins/i/datocms-plugin-kontainer': '/marketplace/plugins',
    '/docs/vue/rendering-structured-text-fields': '/docs/nuxt/rendering-structured-text-fields',
    '/product-updates/undefined': '/product-updates',
    '/docs/content-management-api/resources/item/instances/docs/content-management-api/resources/item/instances':
      '/docs/content-management-api',
    '/marketplace/starters/next-js-multilingual-blog': '/marketplace/starters',
    '/docs/guides/installing-site-search/widget': '/docs/general-concepts/site-search',
    '/docs/pro-tips/create-a-select-with-a-single-line-string-field': '/docs',
    '/docs/guides/building-plugins': '/docs/plugin-sdk/build-your-first-plugin',
    '/partners/tecnica': '/partners',
    '/docs/hugo/fields': '/docs',
    '/docs/content-modelling/data-migration/docs/content-modelling/data-migration':
      '/docs/content-modelling/data-migration',
    '/partners/harvey-cameron/showcase/jacuzzi': '/partners',
    '/docs/plugin-sdk/field-extension': '/docs/plugin-sdk/field-extensions',
    '/docs/jekyll/fields': '/docs',
    '/docs/static-generators/middleman/image-manipulation': '/docs',
    '/docs/gatsby/examples': '/docs',
    '/docs/guides/custom-assets-domain/google-cloud-storage':
      '/marketplace/enterprise/google-cloud-storage',
    '/use-cases/docs': '/use-cases/headless-cms-knowledge-management',
    '/features/headless-cms-multi-languag': '/features/headless-cms-multi-language',
    '/docs/guides/custom-assets-domain': '/docs',
    '/docs/deployments/zeit': '/docs',
    '/docs/content-management-api/resources/upload/updatebut':
      '/docs/content-management-api/resources/upload',
    '/foo': '/docs',
  },
});

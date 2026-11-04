export const featureTargets: Record<string, string> = {
  'structured-content-cms': '/editor-experience#structured-content',
  'visual-editing': '/editor-experience#visual-editing',
  'dynamic-layouts': '/editor-experience#dynamic-layouts',
  'headless-cms-multi-language': '/editor-experience#localization',
  'workflow-cms': '/editor-experience#workflows',
  'editor-experience': '/editor-experience',
  'dark-mode': '/features#editor-experience',
  'schema-builder': '/developers#schema',
  'headless-cms-graphql': '/developers#graphql',
  'real-time-api': '/developers#real-time',
  'cache-tags': '/developers#delivery',
  'worldwide-cdn': '/developers#numbers',
  'data-integrity': '/developers#environments',
  'developer-experience': '/developers',
  plugins: '/developers#plugins',
  'images-api': '/media#images',
  'video-api': '/media#video',
  ai: '/ai',
};

export const useCaseTargets: Record<string, string> = {
  'knowledge-management': '/case-studies',
  ecommerce: '/case-studies',
  'modern-websites': '/case-studies',
  'digital-publishing': '/case-studies',
  'headless-cms-travel': '/case-studies',
};

export const landingPageTargets: Record<string, string> = {
  'gatsby-cms': '/developers',
  'react-cms': '/cms/nextjs-cms',
  'vue-js-cms': '/cms/nuxtjs-cms',
};

export function redirectsFrom(prefix: string, targets: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(targets).map(([slug, target]) => [`${prefix}/${slug}`, target]),
  );
}

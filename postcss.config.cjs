const nested = require('postcss-nested');

// The scene kit (@datocms/product-scenes) uses native CSS nesting with
// rules such as `.Modal--dialog &` under `.ProductScenesScreen .Modal__content`.
// postcss-nested 4 flattens such a rule to `.Modal--dialog .ProductScenesScreen
// .Modal__content`. This is wrong when .Modal--dialog is not an ancestor of
// .ProductScenesScreen. Thus the kit keeps its native nesting: the browser
// resolves it, as in the prototype. All other CSS goes through postcss-nested.
function nestedExceptKit() {
  const run = nested();
  return {
    postcssPlugin: 'postcss-nested-except-kit',
    Once(root, { result }) {
      const file = root.source?.input.file ?? '';
      if (file.includes('/node_modules/@datocms/product-scenes/')) return;
      return run(root, result);
    },
  };
}
nestedExceptKit.postcss = true;

module.exports = {
  plugins: [
    nestedExceptKit(),
    require('rfs')({
      baseValue: '16px',
      unit: 'px',
    }),
  ],
};

const allSvgFiles = import.meta.glob<string>('../../**/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export function getSvgFile(path: string): string {
  const file = allSvgFiles[`../../${path}.svg`];

  if (!file) {
    throw new Error(`Could not find SVG file "~/${path}.svg"`);
  }

  return file;
}

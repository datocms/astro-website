export function cleanDomain(link: string, includePath: boolean = false): string {
  try {
    const url = new URL(link);

    const hostname = url.hostname.replace(/^www\./, '');

    if (includePath) {
      const pathname = url.pathname.replace(/\/$/, '');
      return pathname ? `${hostname}${pathname}` : hostname;
    }

    return hostname;
  } catch (err) {
    throw new Error(`Invalid URL: ${link}`);
  }
}

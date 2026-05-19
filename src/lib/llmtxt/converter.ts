/**
 * HTML to Markdown Converter for llmstxt.org spec
 *
 * Adapted from LLMFeeder browser extension by @jatinkrmalik
 * https://github.com/jatinkrmalik/LLMFeeder
 */

import { Readability } from '@mozilla/readability';
import { parseHTML } from 'linkedom';
import TurndownService from 'turndown';

export interface ConversionOptions {
  includeTitle?: boolean;
  preserveTables?: boolean;
  includeSidebar?: boolean;
}

interface SidebarLink {
  title: string;
  url: string;
}

interface SidebarData {
  sectionTitle: string;
  links: SidebarLink[];
}

const DEFAULT_OPTIONS: ConversionOptions = {
  includeTitle: false,
  preserveTables: true,
  includeSidebar: false,
};

/**
 * Convert HTML string to Markdown
 * @param htmlString - The HTML content to convert
 * @param url - The source URL of the page (for absolute URL conversion)
 * @param options - Conversion options
 * @returns Markdown string
 */
export function convertHtmlToMarkdown(
  htmlString: string,
  url: string,
  options: ConversionOptions = {},
): string {
  const settings = { ...DEFAULT_OPTIONS, ...options };

  // Parse HTML with linkedom
  const { document } = parseHTML(htmlString);

  // Extract sidebar data before cleaning (sidebar will be removed during cleaning)
  const sidebarData = extractSidebarData(document, url);

  // Extract content based on scope
  const content: HTMLElement = extractMainContent(document);

  // Rewrite elements carrying data-datocms-as-tag to the requested tag,
  // so downstream cleanup and turndown rules treat them as that tag.
  applyAsTagOverrides(content);

  // Clean the content before conversion
  cleanContent(content, settings);

  // Make URLs absolute
  makeUrlsAbsolute(content, url);

  // Lift <script type="text/markdown"> bodies out of the DOM before turndown
  // runs. Turndown's own `collapseWhitespace` pre-pass would otherwise
  // collapse newlines inside the rawtext body — and that pass fires before
  // any custom rule can intercept the node.
  const placeholders = extractPreRenderedMarkdown(content);

  // Convert to Markdown using TurndownService
  const turndownService = configureTurndownService(settings);

  let markdown = turndownService.turndown(content);

  markdown = restorePreRenderedMarkdown(markdown, placeholders);

  if (!markdown || markdown.trim() === '') {
    throw new Error('Conversion resulted in empty markdown');
  }

  // Add page title as H1 if enabled
  if (settings.includeTitle) {
    const pageTitle = document.title.trim();
    if (pageTitle.length > 0) {
      markdown = `# ${pageTitle}\n\n${markdown}`;
    }
  }

  // Append sidebar links if any
  // Skip if all links are just anchors to the same URL (current page)
  if (options.includeSidebar && sidebarData.links.length > 0) {
    const currentPageUrl = new URL(url).href.replace(/\/?$/, '.md');
    const allLinksAreSameUrl = sidebarData.links.every((link: SidebarLink) => {
      // Remove hash from link URL for comparison
      const linkUrlWithoutHash = link.url.split('#')[0];
      return linkUrlWithoutHash === currentPageUrl;
    });

    if (!allLinksAreSameUrl) {
      markdown += `\n\n## Related content in "${sidebarData.sectionTitle}"\n\n`;
      sidebarData.links.forEach((link: SidebarLink) => {
        markdown += `- [${link.title}](${link.url})\n`;
      });
    }
  }

  // Post-process the markdown
  return postProcessMarkdown(markdown);
}

/**
 * Extract links and title from aside#sidebar element
 * Only extract links that appear after the h6 element
 */
function extractSidebarData(document: Document, baseUrl: string): SidebarData {
  const sidebar = document.querySelector('aside#sidebar');
  if (!sidebar) {
    return { sectionTitle: 'Related content', links: [] };
  }

  // Extract the h6 title if present
  const h6Element = sidebar.querySelector('h6');
  const sectionTitle = h6Element?.textContent?.trim() || 'Related content';

  const links: SidebarLink[] = [];
  const baseUrlObj = new URL(baseUrl);

  // If there's no h6, collect all links; otherwise only collect links after the h6
  let collectLinks = !h6Element;
  const allElements = sidebar.querySelectorAll('*');

  allElements.forEach((element) => {
    // Start collecting links after we encounter the h6
    if (element.tagName === 'H6') {
      collectLinks = true;
      return;
    }

    // Only collect links if we've passed the h6 (or if there was no h6)
    if (collectLinks && element.tagName === 'A') {
      const linkElement = element as HTMLAnchorElement;
      const href = linkElement.getAttribute('href');
      const title = linkElement.textContent?.trim();

      if (href && title) {
        try {
          const absoluteUrl = new URL(href, baseUrl);

          // For internal links (same origin), add .md to the pathname
          // unless the pathname already has a file extension
          if (absoluteUrl.origin === baseUrlObj.origin) {
            const hasExtension = /\.[^/.]+$/.test(absoluteUrl.pathname);
            if (!hasExtension) {
              absoluteUrl.pathname = absoluteUrl.pathname + '.md';
            }
          }

          links.push({
            title,
            url: absoluteUrl.href,
          });
        } catch (e) {
          // Invalid URL, skip
        }
      }
    }
  });

  return { sectionTitle, links };
}

/**
 * Extract the full page content
 */
function extractFullPageContent(document: Document): HTMLElement {
  const body = document.body.cloneNode(true) as HTMLElement;

  // Remove script and style tags
  const scripts = body.getElementsByTagName('script');
  const styles = body.getElementsByTagName('style');

  // Remove scripts and styles (iterate backwards to avoid issues with live collections)
  for (let i = scripts.length - 1; i >= 0; i--) {
    const script = scripts[i];
    if (script && script.parentNode) {
      script.parentNode.removeChild(script);
    }
  }

  for (let i = styles.length - 1; i >= 0; i--) {
    const style = styles[i];
    if (style && style.parentNode) {
      style.parentNode.removeChild(style);
    }
  }

  return body;
}

/**
 * Extract the main content using Readability
 */
function extractMainContent(document: Document): HTMLElement {
  try {
    // Try to find main content area with common selectors
    const mainElement = document.querySelector('#main-content');
    if (mainElement) {
      const container = document.createElement('div');
      container.innerHTML = mainElement.innerHTML;
      return container;
    }

    // Fallback to Readability for blog posts/articles
    const documentClone = document.cloneNode(true) as Document;

    const reader = new Readability(documentClone, {
      // Be less aggressive in removing content for technical documentation
      charThreshold: 100, // Lower from default 500
      nbTopCandidates: 10, // Increase from default 5
      keepClasses: false,
    });
    const article = reader.parse();

    if (!article || !article.content) {
      // Fallback to full page if Readability fails
      return extractFullPageContent(document);
    }

    const container = document.createElement('div');
    container.innerHTML = article.content;

    return container;
  } catch (error) {
    console.error('Readability error:', error);
    // Fallback to full page extraction
    return extractFullPageContent(document);
  }
}

/**
 * Pull each `<script type="text/markdown">` out of the DOM and replace it
 * with a placeholder div whose only content is a unique token. The token
 * survives turndown verbatim; we substitute the stored markdown back in
 * after turndown has run. This bypasses turndown's `collapseWhitespace`
 * pre-pass, which would otherwise eat the newlines inside the rawtext body.
 */
function extractPreRenderedMarkdown(content: HTMLElement): Map<string, string> {
  const placeholders = new Map<string, string>();
  const scripts = content.querySelectorAll('script[type="text/markdown"]');
  scripts.forEach((script, i) => {
    const token = `LLMTXTMDPLACEHOLDER${i}${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const raw = script.textContent ?? '';
    // Reverse the `</script>` -> `<\/script>` escape applied at emit time
    // (needed so the closer doesn't end the rawtext element prematurely).
    placeholders.set(token, raw.replace(/<\\\/script>/gi, '</script>').trim());
    const placeholder = content.ownerDocument.createElement('div');
    placeholder.textContent = token;
    script.parentNode?.replaceChild(placeholder, script);
  });
  return placeholders;
}

function restorePreRenderedMarkdown(markdown: string, placeholders: Map<string, string>): string {
  let result = markdown;
  for (const [token, md] of placeholders) {
    result = result.replace(token, `\n\n${md}\n\n`);
  }
  return result;
}

/**
 * Replace elements that declare `data-datocms-as-tag="<tag>"` with a new
 * element of the requested tag, preserving children and other attributes.
 */
function applyAsTagOverrides(content: HTMLElement): void {
  const doc = content.ownerDocument;
  const elements = Array.from(content.querySelectorAll('[data-datocms-as-tag]'));

  for (const el of elements) {
    const asTag = el.getAttribute('data-datocms-as-tag')?.trim().toLowerCase();
    if (!asTag || asTag === el.tagName.toLowerCase()) {
      el.removeAttribute('data-datocms-as-tag');
      continue;
    }

    const replacement = doc.createElement(asTag);
    for (const attr of Array.from(el.attributes)) {
      if (attr.name === 'data-datocms-as-tag') continue;
      replacement.setAttribute(attr.name, attr.value);
    }
    while (el.firstChild) replacement.appendChild(el.firstChild);
    el.parentNode?.replaceChild(replacement, el);
  }
}

/**
 * Clean the HTML content before conversion
 */
function cleanContent(content: HTMLElement, _settings: ConversionOptions): void {
  // Replace videos with placeholder
  const videos = content.querySelectorAll(
    'video, iframe[src*="youtube"], iframe[src*="vimeo"], astro-island[component-export="VideoPlayer"]',
  );
  videos.forEach((video) => {
    const placeholder = content.ownerDocument.createTextNode('(Video content)');
    video.parentNode?.replaceChild(placeholder, video);
  });

  // Replace images with placeholder
  const images = content.querySelectorAll('img, picture');
  images.forEach((image) => {
    const placeholder = content.ownerDocument.createTextNode('(Image content)');
    image.parentNode?.replaceChild(placeholder, image);
  });

  // Remove elements that shouldn't be included
  const elementsToRemove = [
    'script:not([type="text/markdown"])',
    'style',
    'noscript',
    'iframe',
    'nav',
    'footer',
    '.comments',
    '.ads',
    '.sidebar',
    'svg',
    '[data-datocms-noindex]',
    '[data-datocms-nomd]',
  ];

  // Remove unwanted elements
  elementsToRemove.forEach((selector) => {
    const elements = content.querySelectorAll(selector);
    elements.forEach((element) => {
      // Don't remove aside#sidebar even if it matches the selector
      if (element.tagName === 'ASIDE' && element.id === 'sidebar') {
        return;
      }
      element.parentNode?.removeChild(element);
    });
  });

  // Fix expressive-code line breaks: each .ec-line div should become a separate line
  // Add a newline marker after each code line div before removing gutters
  const codeLines = content.querySelectorAll('.ec-line');
  codeLines.forEach((line) => {
    const codeDiv = line.querySelector('.code');
    if (codeDiv) {
      // Add a text node with newline after the code content
      const newline = content.ownerDocument.createTextNode('\n');
      codeDiv.appendChild(newline);
    }
  });

  // Remove line number gutters from code blocks (expressive-code, prism, etc.)
  const lineNumberGutters = content.querySelectorAll('.gutter, .line-numbers-rows');
  lineNumberGutters.forEach((element) => {
    element.parentNode?.removeChild(element);
  });

  // Remove empty paragraphs and divs
  const emptyElements = content.querySelectorAll('p:empty, div:empty');
  emptyElements.forEach((element) => {
    element.parentNode?.removeChild(element);
  });

  normalizeWhitespace(content);
}

/**
 * Collapse insignificant whitespace text nodes in the DOM, similar to how a
 * browser treats whitespace when rendering. This stops turndown from being
 * misled by source indentation (e.g. flipping list items between tight and
 * loose, or treating cell content as paragraphs). Content inside <pre>,
 * <code>, <textarea>, <script>, <style> is left untouched.
 */
function normalizeWhitespace(content: HTMLElement): void {
  const PRESERVE = new Set(['PRE', 'CODE', 'TEXTAREA', 'SCRIPT', 'STYLE']);
  const BLOCK = new Set([
    'ADDRESS',
    'ARTICLE',
    'ASIDE',
    'BLOCKQUOTE',
    'BODY',
    'BR',
    'CANVAS',
    'DD',
    'DETAILS',
    'DIALOG',
    'DIV',
    'DL',
    'DT',
    'FIELDSET',
    'FIGCAPTION',
    'FIGURE',
    'FOOTER',
    'FORM',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'HEADER',
    'HR',
    'LI',
    'MAIN',
    'NAV',
    'OL',
    'P',
    'PRE',
    'SECTION',
    'SUMMARY',
    'TABLE',
    'TBODY',
    'TD',
    'TH',
    'THEAD',
    'TFOOT',
    'TR',
    'UL',
    'VIDEO',
  ]);

  const inPreserved = (node: Node): boolean => {
    let p: Node | null = node.parentNode;
    while (p) {
      if (p.nodeType === 1 && PRESERVE.has((p as Element).tagName)) return true;
      p = p.parentNode;
    }
    return false;
  };

  const isBlock = (node: Node | null): boolean =>
    !!node && node.nodeType === 1 && BLOCK.has((node as Element).tagName);

  // Snapshot text nodes first — mutating during the walk would skip siblings
  const textNodes: Text[] = [];
  const walker = content.ownerDocument.createTreeWalker(content, 4 /* SHOW_TEXT */);
  let n: Node | null;
  while ((n = walker.nextNode())) textNodes.push(n as Text);

  for (const t of textNodes) {
    if (inPreserved(t)) continue;
    const text = t.textContent ?? '';
    if (/^\s*$/.test(text)) {
      const prev = t.previousSibling;
      const next = t.nextSibling;
      if (!prev || !next || isBlock(prev) || isBlock(next)) {
        t.parentNode?.removeChild(t);
      } else {
        t.textContent = ' ';
      }
    } else {
      t.textContent = text.replace(/\s+/g, ' ');
    }
  }
}

/**
 * Resolve an href against a base URL, and for same-origin docs paths without
 * a file extension append `.md` (so internal cross-doc links point to the
 * markdown twin). Returns the original href unchanged on parse failure.
 */
export function resolveDocsHref(href: string, baseUrl: string): string {
  try {
    const baseUrlObj = new URL(baseUrl);
    const absoluteUrl = new URL(href, baseUrl);
    if (absoluteUrl.origin === baseUrlObj.origin) {
      const hasExtension = /\.[^/.]+$/.test(absoluteUrl.pathname);
      if (!hasExtension) {
        absoluteUrl.pathname = absoluteUrl.pathname + '.md';
      }
    }
    return absoluteUrl.href;
  } catch {
    return href;
  }
}

/**
 * Make all URLs in the content absolute
 */
function makeUrlsAbsolute(content: HTMLElement, baseUrl: string): void {
  // Convert links
  const links = content.querySelectorAll('a[href]');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      // Remove anchor links (empty links with only hash fragments)
      // These are typically heading anchors that aren't useful in markdown
      const textContent = link.textContent?.trim();
      if (!textContent || textContent === '') {
        link.parentNode?.removeChild(link);
        return;
      }

      link.setAttribute('href', resolveDocsHref(href, baseUrl));
    }
  });
}

/**
 * Configure the TurndownService based on user settings
 */
function configureTurndownService(settings: ConversionOptions): TurndownService {
  const turndownService = new TurndownService({
    headingStyle: 'atx', // Use # style headings
    hr: '---', // Use --- for horizontal rules
    bulletListMarker: '-', // Use - for bullet lists
    codeBlockStyle: 'fenced', // Use ``` style code blocks
    emDelimiter: '*', // Use * for emphasis
  });

  // Improve code block handling
  turndownService.addRule('fencedCodeBlock', {
    filter: function (node) {
      return (
        node.nodeName === 'PRE' && node.firstChild !== null && node.firstChild.nodeName === 'CODE'
      );
    },
    replacement: function (_content, node) {
      const preNode = node as HTMLElement;
      const codeNode = preNode.firstChild as HTMLElement;

      // Check for data-language attribute on <pre> tag
      let languageIdentifier = preNode.getAttribute('data-language') || '';

      // Fallback to class-based language detection
      if (!languageIdentifier) {
        const classAttr = codeNode?.getAttribute('class') || '';
        const languageMatch = classAttr.match(/language-(\S+)/);
        languageIdentifier = languageMatch?.[1] || '';
      }

      return (
        '\n\n```' +
        languageIdentifier +
        '\n' +
        codeNode.textContent?.replace(/\n$/, '') +
        '\n```\n\n'
      );
    },
  });

  // Add table support if enabled
  if (settings.preserveTables) {
    addTableSupport(turndownService);
  }

  // Add callout support
  turndownService.addRule('callouts', {
    filter: function (node) {
      return node.nodeName === 'DIV' && node.hasAttribute('data-callout-type');
    },
    replacement: function (_content, node) {
      const calloutType =
        (node as HTMLElement).getAttribute('data-callout-type')?.toUpperCase() || 'NOTE';
      const titleElement = (node as HTMLElement).querySelector('[data-callout-title]');
      const contentElement = (node as HTMLElement).querySelector('[data-callout-content]');

      const title = titleElement?.textContent?.trim() || '';

      // Convert callout content HTML to markdown to preserve formatting
      let calloutContent = '';
      if (contentElement) {
        // Use turndownService to convert the content HTML, preserving formatting
        calloutContent = turndownService.turndown(contentElement.innerHTML).trim();
      }

      // Format as GitHub-style alert
      let result = `\n\n> [!${calloutType === 'NEUTRAL' ? 'NOTE' : calloutType}]`;
      if (title) {
        result += ` ${title}`;
      }
      result += '\n';

      // Add content lines, each prefixed with "> "
      if (calloutContent) {
        const lines = calloutContent.split('\n');
        lines.forEach((line) => {
          result += `> ${line}\n`;
        });
      }

      result += '\n';
      return result;
    },
  });

  // Definition list term -> render as a heading so glossary-style content
  // gets a proper structure in markdown
  turndownService.addRule('definitionTerm', {
    filter: 'dt',
    replacement: function (content) {
      const text = content.trim();
      if (!text) return '';
      return `\n\n### ${text}\n\n`;
    },
  });

  // Definition list description -> render as a paragraph
  turndownService.addRule('definitionDescription', {
    filter: 'dd',
    replacement: function (content) {
      const text = content.trim();
      if (!text) return '';
      return `${text}\n\n`;
    },
  });

  // Compare-page "take" <dd>: when a description-list pair carries a
  // data-compare-product attribute, collapse it into a single
  // bold-prefixed paragraph so each side reads as "**Product:** text".
  // Must be registered AFTER definitionDescription so turndown picks this
  // more specific rule first.
  turndownService.addRule('compareProductTake', {
    filter: function (node) {
      return node.nodeName === 'DD' && node.hasAttribute('data-compare-product');
    },
    replacement: function (content, node) {
      const product = (node as HTMLElement).getAttribute('data-compare-product') || '';
      const trimmed = content.trim();
      if (!trimmed) return '';
      return `\n\n**${product}:** ${trimmed}\n\n`;
    },
  });

  // Add details/summary support (expandable/collapsible sections)
  turndownService.addRule('details', {
    filter: function (node) {
      return node.nodeName === 'DETAILS';
    },
    replacement: function (_content, node) {
      const detailsElement = node as HTMLElement;
      const summaryElement = detailsElement.querySelector('summary');

      // Extract summary text (plain text, no markdown)
      const summaryText = summaryElement?.textContent?.trim() || 'Details';

      // Get all content except the summary element
      const contentContainer = detailsElement.cloneNode(true) as HTMLElement;
      const summaryToRemove = contentContainer.querySelector('summary');
      if (summaryToRemove && summaryToRemove.parentNode) {
        summaryToRemove.parentNode.removeChild(summaryToRemove);
      }

      // Convert the remaining content to markdown
      let detailsContent = turndownService.turndown(contentContainer.innerHTML).trim();

      // Check if details element has 'open' attribute
      const isOpen = detailsElement.hasAttribute('open');
      const openAttr = isOpen ? ' open' : '';

      // Format as HTML tags with markdown content inside
      let result = `\n\n<details${openAttr}>\n<summary>${summaryText}</summary>\n\n`;
      if (detailsContent) {
        result += detailsContent + '\n\n';
      }
      result += '</details>\n\n';

      return result;
    },
  });

  // Replace <time data-datocms-llm-date> with ISO-based marker
  turndownService.addRule('llmDate', {
    filter: function (node) {
      return node.nodeName === 'TIME' && node.hasAttribute('data-datocms-llm-date');
    },
    replacement: function (_content, node) {
      const iso = (node as HTMLElement).getAttribute('datetime') || '';
      return `[date: ${iso}]`;
    },
  });

  return turndownService;
}

/**
 * Add table support to TurndownService
 */
function addTableSupport(turndownService: TurndownService): void {
  turndownService.addRule('tableCell', {
    filter: ['th', 'td'],
    replacement: function (cellContent) {
      // Collapse newlines so block-level descendants (e.g. <div>) don't
      // break the row layout in GFM tables.
      return ' ' + cellContent.trim().replace(/\s*\n+\s*/g, ' ') + ' |';
    },
  });

  // Pass through thead/tbody/tfoot without surrounding blank lines —
  // otherwise turndown treats them as block elements and inserts a blank
  // line between the header-separator row and the first body row.
  turndownService.addRule('tableSection', {
    filter: ['thead', 'tbody', 'tfoot'],
    replacement: (content) => content,
  });

  turndownService.addRule('tableRow', {
    filter: 'tr',
    replacement: function (content, node) {
      let output = '|' + content + '\n';

      // Add header row separator
      if ((node as HTMLElement).parentNode?.nodeName === 'THEAD') {
        const cells = (node as HTMLElement).querySelectorAll('th, td');
        output +=
          '|' +
          Array.from(cells)
            .map(() => ' --- |')
            .join('') +
          '\n';
      }

      return output;
    },
  });

  turndownService.addRule('table', {
    filter: 'table',
    replacement: function (content) {
      return '\n\n' + content + '\n\n';
    },
  });
}

/**
 * Post-process the markdown output
 */
function postProcessMarkdown(markdown: string): string {
  // Remove excessive blank lines (more than 2 in a row)
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  // Ensure proper spacing around headings
  markdown = markdown.replace(/([^\n])(\n#{1,6} )/g, '$1\n\n$2');

  // Collapse blank lines between adjacent list items (turndown can emit
  // "loose" items with surrounding whitespace; force them tight)
  markdown = markdown.replace(/(\n[*\-+] +[^\n]+)\n\s*\n(?=[*\-+] +)/g, '$1\n');

  return markdown.trim();
}

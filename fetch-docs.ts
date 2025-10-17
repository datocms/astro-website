import { executeQueryWithAutoPagination } from '@datocms/cda-client';
import * as fs from 'node:fs';
import * as path from 'node:path';
import ky from 'ky';
import { buildUrlForDocGroup, DocGroupUrlFragment } from '~/lib/datocms/gqlUrlBuilder/docGroup';
import { graphql } from '~/lib/datocms/graphql';

// Single comprehensive GraphQL query for all DatoCMS dynamic content
const query = graphql(
  /* GraphQL */ `
    query LlmsTxtQuery {
      docRoots: allDocGroups(filter: { parent: { exists: false } }) {
        name
        children {
          name
          ...DocGroupUrlFragment
        }
      }
    }
  `,
  [DocGroupUrlFragment],
);

function extractRelatedLinks(markdown: string): string[] {
  const relatedContentRegex = /## Related content in ".*?"[\s\S]*?(?=\n## |$)/;
  const match = markdown.match(relatedContentRegex);

  if (!match) {
    return [];
  }

  const relatedSection = match[0];
  const linkRegex = /\(http:\/\/localhost:4321\/docs\/[^\)]+\.md\)/g;
  const links: string[] = [];

  let linkMatch;
  while ((linkMatch = linkRegex.exec(relatedSection)) !== null) {
    // Remove the parentheses from the match
    links.push(linkMatch[0].slice(1, -1));
  }

  return links;
}

function urlToFilePath(url: string): string {
  // Convert http://localhost:4321/docs/asset-api/images.md to docs/asset-api/images.md
  const urlPath = new URL(url).pathname;
  return urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;
}

function removeRelatedContent(markdown: string): string {
  // Remove the "## Related content in" section and everything after it
  return markdown.replace(/## Related content in ".*?"[\s\S]*$/, '').trimEnd();
}

async function scrapeUrl(
  url: string,
): Promise<{ url: string; content: string; relatedLinks: string[] } | null> {
  try {
    console.log(`Scraping: ${url}`);
    const content = await ky(url).text();

    // Extract related links before removing the section
    const relatedLinks = extractRelatedLinks(content);

    // Remove the "Related content" section from the content
    const cleanedContent = removeRelatedContent(content);

    // Save the page to the appropriate location
    const filePath = urlToFilePath(url);
    const fileDir = path.dirname(filePath);

    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    fs.writeFileSync(filePath, cleanedContent, 'utf-8');
    console.log(`  → Saved to ${filePath}`);

    return { url, content: cleanedContent, relatedLinks };
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, error);
    return null;
  }
}

async function run() {
  const docsDir = 'docs';
  const CONCURRENCY = 5;

  // Step 1: Delete all content in docs/ directory
  console.log(`Cleaning ${docsDir}/ directory...`);
  if (fs.existsSync(docsDir)) {
    fs.rmSync(docsDir, { recursive: true, force: true });
  }
  fs.mkdirSync(docsDir, { recursive: true });
  console.log(`${docsDir}/ directory cleaned.\n`);

  const datoCmsData = await executeQueryWithAutoPagination(query, {
    token: '94c337dda56f1cb4f6d92025d04d50',
  });

  const initialUrls = datoCmsData.docRoots
    .flatMap((r) => r.children)
    .map(buildUrlForDocGroup)
    .map((url) => `http://localhost:4321${url}.md`);

  const visited = new Set<string>();
  const queue: string[] = [...initialUrls];
  const processing = new Set<string>();

  async function worker() {
    while (true) {
      // Find next URL to process
      let url: string | undefined;
      while (queue.length > 0) {
        const candidate = queue.shift()!;
        if (!visited.has(candidate) && !processing.has(candidate)) {
          url = candidate;
          break;
        }
      }

      if (!url) {
        // No more work available
        return;
      }

      visited.add(url);
      processing.add(url);

      const result = await scrapeUrl(url);
      processing.delete(url);

      if (result) {
        for (const relatedUrl of result.relatedLinks) {
          if (!visited.has(relatedUrl) && !processing.has(relatedUrl)) {
            queue.push(relatedUrl);
          }
        }
      }
    }
  }

  // Start CONCURRENCY number of workers
  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  console.log(`\nTotal pages scraped: ${visited.size}`);
}

run();

import type { APIRoute } from 'astro';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import RSS from 'rss';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  ChangelogEntryUrlFragment,
  buildUrlForChangelogEntry,
} from '~/lib/datocms/gqlUrlBuilder/changelogEntry';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query ChangelogEntrys {
      posts: allChangelogEntries(first: 10, orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]) {
        ...ChangelogEntryUrlFragment
        title
        content {
          value
        }
        _firstPublishedAt
      }
    }
  `,
  [ChangelogEntryUrlFragment],
);

export const GET: APIRoute = async () => {
  const { posts } = await executeQueryOutsideAstro(query, { includeDrafts: false });

  const baseUrl = new URL('https://www.datocms.com');

  const feed = new RSS({
    title: 'DatoCMS Product Changelog',
    description: 'Here we document our progress and announce product updates',
    site_url: baseUrl.toString(),
    feed_url: new URL('/product-changelog.xml', baseUrl).toString(),
  });

  for (const post of posts) {
    const url = new URL(buildUrlForChangelogEntry(post), baseUrl).toString();

    feed.item({
      title: post.title,
      date: new Date(post._firstPublishedAt!),
      description: toPlainText(post.content) || '',
      url,
      guid: url,
    });
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};

import type { APIRoute } from 'astro';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import RSS from 'rss';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { BlogPostUrlFragment, buildUrlForBlogPost } from '~/lib/datocms/gqlUrlBuilder/blogPost';
import { graphql } from '~/lib/datocms/graphql';
import { baseUrl as buildBaseUrl } from '~/lib/draftMode';

export const query = graphql(
  /* GraphQL */ `
    query BlogPosts {
      posts: allBlogPosts(first: 10, orderBy: [_firstPublishedAt_DESC, _createdAt_DESC]) {
        ...BlogPostUrlFragment
        title
        excerpt {
          value
          links {
            ... on RecordInterface {
              id
              __typename
            }
          }
        }
        _firstPublishedAt
      }
    }
  `,
  [BlogPostUrlFragment],
);

export const GET: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers({
    'Content-Type': 'application/xml',
  });

  const { posts } = await executeQueryOutsideAstro(query, {
    request,
    responseHeaders,
  });

  const baseUrl = buildBaseUrl(request);

  const feed = new RSS({
    title: 'DatoCMS Blog',
    description:
      'Where we publish articles on topics such as digital publishing, content strategy, and software development.',
    site_url: baseUrl,
    feed_url: new URL('/blog.xml', baseUrl).toString(),
  });

  for (const post of posts) {
    const url = new URL(buildUrlForBlogPost(post), baseUrl).toString();

    feed.item({
      title: post.title,
      date: new Date(post._firstPublishedAt!),
      description: toPlainText(post.excerpt) || '',
      url,
      guid: url,
    });
  }

  return new Response(feed.xml({ indent: true }), {
    headers: responseHeaders,
  });
};

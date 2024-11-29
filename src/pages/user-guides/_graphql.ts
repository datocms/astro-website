import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';
import { EpisodeFragment } from './[chapterSlug]/[episodeSlug]/_graphql';

export const ChapterFragment = graphql(
  /* GraphQL */ `
    fragment ChapterFragment on UserGuidesChapterRecord {
      title
      introduction {
        value
      }
      episodes: videos {
        asset: video {
          video {
            duration
          }
        }
        ...EpisodeFragment
      }
    }
  `,
  [EpisodeFragment],
);

export const query = graphql(
  /* GraphQL */ `
    query UserGuidesHome {
      page: userGuidesHome {
        _seoMetaTags {
          ...TagFragment
        }
      }
      chapters: allUserGuidesChapters {
        ...ChapterFragment
      }
    }
  `,
  [TagFragment, ChapterFragment],
);

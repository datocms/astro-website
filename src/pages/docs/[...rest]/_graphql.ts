import { DocGroupItemsFragment } from '~/components/docs/sidebar';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const docGroupQuery = graphql(
  /* GraphQL */ `
    query DocPageGroup($groupSlug: String!) {
      group: docGroup(filter: { slug: { eq: $groupSlug } }) {
        ...DocGroupItemsFragment
        name
        slug
        pagesOrSections: pages {
          __typename
          ... on DocGroupPageRecord {
            page {
              id
              slug
            }
          }
          ... on DocGroupSectionRecord {
            title
            pages {
              page {
                id
                slug
              }
            }
          }
        }
        techStarterKit {
          id
          name
          cmsDescription
          code
          starterType
          badge {
            name
            emoji
          }
          label
          githubRepo
          technology {
            name
            logo {
              url
            }
            squareLogo {
              url
            }
          }
          screenshot {
            responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fit: crop }) {
              ...ResponsiveImageFragment
            }
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment, DocGroupItemsFragment],
);

export const docPageQuery = graphql(
  /* GraphQL */ `
    query DocPagePage($pageId: ItemId!) {
      page: docPage(filter: { id: { eq: $pageId } }) {
        title
        _seoMetaTags {
          ...TagFragment
        }
        content {
          value
          blocks {
            ... on ImageRecord {
              id
              _modelApiKey
              frameless
              image {
                format
                width
                responsiveImage(imgixParams: { auto: format, w: 1000 }) {
                  ...ResponsiveImageFragment
                }
                zoomableResponsiveImage: responsiveImage(
                  imgixParams: { auto: format, w: 1500, fit: max }
                ) {
                  ...ResponsiveImageFragment
                }
                url
              }
            }
            ... on VideoRecord {
              id
              _modelApiKey
              video {
                url
                title
                provider
                width
                height
                providerUid
              }
            }
            ... on TableRecord {
              id
              _modelApiKey
              table
            }
            ... on DemoRecord {
              id
              _modelApiKey
              demo {
                id
                name
                code
                githubRepo
                technology {
                  name
                  logo {
                    url
                  }
                }
                screenshot {
                  responsiveImage(
                    imgixParams: { auto: format, w: 450, h: 350, fit: crop, crop: top }
                  ) {
                    ...ResponsiveImageFragment
                  }
                }
              }
            }
            ... on MultipleDemosBlockRecord {
              id
              _modelApiKey
              demos {
                id
                name
                code
                technology {
                  name
                  logo {
                    url
                  }
                }
                screenshot {
                  responsiveImage(
                    imgixParams: { auto: format, w: 300, h: 200, fit: crop, crop: top }
                  ) {
                    ...ResponsiveImageFragment
                  }
                }
              }
            }
            ... on InternalVideoRecord {
              id
              _modelApiKey
              thumbTimeSeconds
              video {
                title
                width
                height
                blurUpThumb
                video {
                  playbackId: muxPlaybackId
                }
              }
            }
            ... on GraphiqlEditorRecord {
              id
              _modelApiKey
              query
            }
            ... on CloneButtonFormRecord {
              id
              _modelApiKey
            }
            ... on DeployButtonFormRecord {
              id
              _modelApiKey
            }
            ... on PluginSdkHookGroupRecord {
              id
              _modelApiKey
              groupName
            }
            ... on DocCalloutRecord {
              id
              _modelApiKey
              calloutType
              title
              text {
                value
              }
            }
            ... on ReactUiLiveExampleRecord {
              id
              _modelApiKey
              componentName
            }
            ... on TutorialVideoRecord {
              id
              _modelApiKey
              tutorials {
                ... on RecordInterface {
                  id
                  _modelApiKey
                }
                ... on RecordInterface {
                  id
                  _modelApiKey
                }
                ... on UserGuidesVideoRecord {
                  title
                  slug
                  thumbTimeSeconds
                  video {
                    video {
                      thumbnailUrl
                      blurUpThumb
                      width
                      height
                    }
                  }
                  chapters: _allReferencingUserGuidesChapters {
                    slug
                  }
                }
                ... on VideoTutorialRecord {
                  id
                  title
                  res: videoTutorialResource {
                    ... on OtherVideoResourceRecord {
                      _modelApiKey
                      url
                      coverImage {
                        responsiveImage(
                          imgixParams: { auto: format, w: 300, ar: "4:3", fit: crop }
                        ) {
                          ...ResponsiveImageFragment
                        }
                      }
                    }
                    ... on YoutubeVideoResourceRecord {
                      _modelApiKey
                      video {
                        url
                        thumbnailUrl
                        providerUid
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment],
);

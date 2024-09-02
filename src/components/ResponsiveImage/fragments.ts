import { graphql } from '~/lib/datocms/graphql';

/**
 * Let's define the GraphQL fragment needed for the component to function.
 *
 * GraphQL fragment colocation keeps queries near the components using them,
 * improving maintainability and encapsulation. Fragment composition enables
 * building complex queries from reusable parts, promoting code reuse and
 * efficiency. Together, these practices lead to more modular, maintainable, and
 * performant GraphQL implementations by allowing precise data fetching and
 * easier code management.
 *
 * Learn more: https://gql-tada.0no.co/guides/fragment-colocation
 */

export const ResponsiveImageFragment = graphql(/* GraphQL */ `
  fragment ResponsiveImageFragment on ResponsiveImage {
    # always required
    src
    srcSet
    width
    height

    # not required, but strongly suggested!
    alt
    title

    # LQIP (base64-encoded)
    base64

    # you can omit 'sizes' if you explicitly pass the 'sizes' prop to the image component
    sizes
  }
`);

import { graphql } from '~/lib/datocms/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';

/*
 * This file lists a series of graphql not related to any specific Vue
 * component, but necessary in various parts of the code.
 */

export const TagFragment = graphql(/* GraphQL */ `
  fragment TagFragment on Tag @_unmask {
    tag
    attributes
    content
  }
`);

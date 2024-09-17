import { useState, type ReactNode } from 'react';
import chevronDownIcon from '~/icons/regular/chevron-down.svg?raw';
import plusIcon from '~/icons/regular/plus.svg?raw';
import trashIcon from '~/icons/regular/trash.svg?raw';
import type { ReactUiLiveExample } from './utils';
import * as SDK from 'datocms-react-ui';
import { MDXRemote } from 'next-mdx-remote';

const PlusIcon = () => <span dangerouslySetInnerHTML={{ __html: plusIcon }} />;
const TrashIcon = () => <span dangerouslySetInnerHTML={{ __html: trashIcon }} />;
const ChevronDownIcon = () => <span dangerouslySetInnerHTML={{ __html: chevronDownIcon }} />;

function StateManager<T>({
  initial,
  children,
}: {
  initial: T;
  children: (value: T, setValue: (newValue: T) => void) => ReactNode;
}) {
  const [value, setValue] = useState(initial);

  return children(value, setValue);
}

export function LiveExample({
  serializedMdxExample,
}: {
  serializedMdxExample: ReactUiLiveExample['serializedMdxExample'];
}) {
  return (
    <MDXRemote
      {...serializedMdxExample}
      scope={{
        ctx: {
          mode: 'renderPage',
          bodyPadding: [0, 0, 0, 0],
          theme: {
            primaryColor: 'rgb(226, 87, 87)',
            accentColor: 'rgb(75, 199, 216)',
            semiTransparentAccentColor: 'rgb(75, 199, 216, 0.1)',
            lightColor: 'rgb(229, 249, 252)',
            darkColor: 'rgb(80, 50, 83)',
          },
        },
      }}
      components={{
        PlusIcon: PlusIcon,
        ChevronDownIcon: ChevronDownIcon,
        TrashIcon: TrashIcon,
        StateManager: StateManager,
        ...(SDK as any)
      }}
    />
  );
}

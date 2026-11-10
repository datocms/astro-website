import { createElement, type SVGProps } from 'react';
import { type IconData, iconParts } from './data';

type Props = Omit<SVGProps<SVGSVGElement>, 'ref'> & {
  /** A Lucide icon or a Simple Icons brand mark. */
  icon: IconData;
  /** The accessible name. Without it, the icon is hidden from assistive technology. */
  label?: string;
};

/** Change an SVG attribute name to the name that React uses (`stroke-width` to `strokeWidth`). */
function reactName(name: string): string {
  return name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function reactAttrs(attrs: Record<string, string | number>) {
  return Object.fromEntries(Object.entries(attrs).map(([key, value]) => [reactName(key), value]));
}

/** The same markup as `Component.astro`, for React islands. */
export function IconReact({ icon, label, ...rest }: Props) {
  const { svgAttrs, children } = iconParts(icon);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...reactAttrs(svgAttrs)}
      width="1em"
      height="1em"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      {children.map(({ tag, attrs }, index) =>
        // The order of the elements does not change, thus the index is a stable key.
        createElement(tag, { key: index, ...reactAttrs(attrs) }),
      )}
    </svg>
  );
}

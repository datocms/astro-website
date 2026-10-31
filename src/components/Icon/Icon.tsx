import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import type { SVGProps } from 'react';

type Props = Omit<SVGProps<SVGSVGElement>, 'ref'> & {
  /** The Font Awesome icon. Import it one at a time from the package. */
  icon: IconDefinition;
  /** The accessible name. Without it, the icon is hidden from assistive technology. */
  label?: string;
};

/** The same markup as `Component.astro`, for React islands. */
export function IconReact({ icon, label, ...rest }: Props) {
  const [width, height, , , pathData] = icon.icon;
  const paths = Array.isArray(pathData) ? pathData : [pathData];
  const widthEm = Number((width / height).toFixed(4));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={`${widthEm}em`}
      height="1em"
      fill="currentColor"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

import type { CSSProperties } from 'react';
import s from '../style.module.css';

/**
 * Spacing scale as a bar ramp: token name on the left, an accent bar whose
 * width equals the spacing value. Width differences read more clearly than
 * square area, so the scale is obvious at a glance.
 */
export function Spacings({ tokens }: { tokens: string[] }) {
  return (
    <div className={s.spacings}>
      {tokens.map((token) => {
        // expose the token to CSS so the bar can size itself off `var(--spacing-token)`
        const tokenVar = { '--spacing-token': `var(${token})` } as CSSProperties;

        return (
          <div key={token} title={token} className={s.spacing}>
            <code className={s.spacingToken}>{token}</code>
            <div className={s.spacingBar} style={tokenVar} />
          </div>
        );
      })}
    </div>
  );
}

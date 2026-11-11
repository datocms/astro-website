import { Check, Copy } from 'lucide';
import { useEffect, useRef, useState } from 'react';
import { IconReact } from '~/components/Icon/Icon';
import { type SnippetLang, tokenize } from '~/lib/code/snippet';
import s from './style.module.css';

type Props = {
  code: string;
  lang: SnippetLang;
  /** One long line (a URL): it continues on the next line. */
  wrap?: boolean;
};

/** The same markup as `Component.astro`, for React islands. */
export function CodeSnippetReact({ code, lang, wrap }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={wrap ? `${s.root} ${s.wrap}` : s.root} data-copied={copied ? '' : undefined}>
      <pre className={s.pre}>
        <code>
          {tokenize(code, lang).map(({ text, role }, index) =>
            role === 'plain' ? (
              text
            ) : (
              // The tokens change together with the code, thus the index is a stable key.
              <span key={index} data-token={role}>
                {text}
              </span>
            ),
          )}
        </code>
      </pre>
      <button type="button" className={s.copy} onClick={copy} aria-label="Copy to clipboard">
        <IconReact icon={Copy} className={s.idle} />
        <IconReact icon={Check} className={s.done} />
      </button>
      <span className={s.status} aria-live="polite">
        {copied ? 'Copied' : ''}
      </span>
    </div>
  );
}

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Streamdown } from 'streamdown';
import { createCodePlugin } from '@streamdown/code';

import s from '../../style.module.css';
import { streamAskAi } from '../../apis/ask';
import { useSearch } from '../../context';
import { Thinking } from './Thinking';

import thumbsUpIcon from '~/icons/regular/thumbs-up.svg?raw';
import thumbsDownIcon from '~/icons/regular/thumbs-down.svg?raw';

const codePlugin = createCodePlugin({ themes: ['github-light', 'github-light'] });

function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return extractText((children as any).props.children);
  }
  return '';
}

function LinkPill({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className={s.linkPill} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}

function renderLink(href: string | undefined, children: React.ReactNode) {
  const text = extractText(children);
  const match = text.match(/^\[(.+)\]$/);
  if (match && href && match[1]) {
    return <LinkPill href={href} label={match[1]} />;
  }
  return null;
}

type AiState = 'streaming' | 'done' | 'error';
type Sentiment = 'up' | 'down';
type Turn = {
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  feedback?: Sentiment;
};

export type AskAiHandle = {
  submit: (question: string) => void;
};

type Props = {
  initialQuestion?: string;
};

export const AskAi = forwardRef<AskAiHandle, Props>(function AskAi({ initialQuestion }, ref) {
  const {
    telemetry: { posthogReady, trackAiQuestion, trackAiFeedback },
  } = useSearch();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [aiState, setAiState] = useState<AiState>('streaming');
  const [aiError, setAiError] = useState<string>('');
  const turnsRef = useRef<Turn[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const latestUserMsgRef = useRef<HTMLDivElement | null>(null);
  const lastAnswerRef = useRef<HTMLDivElement | null>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const prevTurnCountRef = useRef(0);

  const recomputeSpacer = useCallback(() => {
    const cardBody = conversationRef.current?.parentElement;
    const conv = conversationRef.current;
    const userMsg = latestUserMsgRef.current;
    const answer = lastAnswerRef.current;
    const spacer = spacerRef.current;
    if (!cardBody || !conv || !spacer || !userMsg) {
      if (spacer) spacer.style.height = '0px';
      return;
    }
    const cbs = getComputedStyle(cardBody);
    const cvs = getComputedStyle(conv);
    const cardBodyPadV = parseFloat(cbs.paddingTop) + parseFloat(cbs.paddingBottom);
    const convPadV = parseFloat(cvs.paddingTop) + parseFloat(cvs.paddingBottom);
    const gap = parseFloat(cvs.rowGap || cvs.gap || '0');
    // Two flex gaps sit between the last user msg / answer / spacer trio
    const reserved = cardBodyPadV + convPadV + gap * 2;
    const userH = userMsg.offsetHeight;
    const answerH = answer?.offsetHeight ?? 0;
    const needed = cardBody.clientHeight - userH - answerH - reserved;
    spacer.style.height = `${Math.max(0, needed)}px`;
  }, []);

  const updateTurns = (next: Turn[]) => {
    turnsRef.current = next;
    setTurns(next);
  };

  const submit = async (questionRaw: string) => {
    const question = questionRaw.trim();
    if (!question) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const baseTurns = turnsRef.current;
    const userTurn: Turn = { role: 'user', content: question };
    const turnIndex = baseTurns.length;
    trackAiQuestion({ turn_index: turnIndex });
    updateTurns([...baseTurns, userTurn, { role: 'assistant', content: '' }]);
    setAiState('streaming');
    setAiError('');

    const messages = [...baseTurns, userTurn].map(({ role, content }) => ({ role, content }));

    try {
      let answer = '';
      let reasoning = '';
      for await (const chunk of streamAskAi(messages, controller.signal)) {
        if (chunk.answer) answer += chunk.answer;
        if (chunk.reasoning) reasoning += chunk.reasoning;
        const current = turnsRef.current;
        updateTurns([
          ...current.slice(0, -1),
          { role: 'assistant', content: answer, reasoning: reasoning || undefined },
        ]);
      }
      setAiState('done');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const current = turnsRef.current;
      const last = current.at(-1);
      if (last && last.role === 'assistant' && last.content === '') {
        updateTurns(current.slice(0, -1));
      }
      setAiError((err as Error).message || 'Something went wrong. Try asking again.');
      setAiState('error');
    }
  };

  useImperativeHandle(ref, () => ({ submit }), []);

  useEffect(() => {
    if (initialQuestion) submit(initialQuestion);
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const cardBody = conversationRef.current?.parentElement;
    if (!cardBody) return;
    recomputeSpacer();
    const ro = new ResizeObserver(recomputeSpacer);
    ro.observe(cardBody);
    if (latestUserMsgRef.current) ro.observe(latestUserMsgRef.current);
    if (lastAnswerRef.current) ro.observe(lastAnswerRef.current);
    return () => ro.disconnect();
  }, [turns.length, recomputeSpacer]);

  useLayoutEffect(() => {
    const justSubmitted = turns.length > prevTurnCountRef.current;
    prevTurnCountRef.current = turns.length;
    if (justSubmitted) {
      recomputeSpacer();
      latestUserMsgRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [turns, recomputeSpacer]);

  const lastUserTurnIndex = turns.reduce((acc, turn, i) => (turn.role === 'user' ? i : acc), -1);
  const lastAssistantTurnIndex = turns.reduce(
    (acc, turn, i) => (turn.role === 'assistant' ? i : acc),
    -1,
  );

  const submitFeedback = (turnIndex: number, sentiment: Sentiment) => {
    const current = turnsRef.current;
    const turn = current[turnIndex];
    if (!turn || turn.role !== 'assistant' || turn.feedback) return;
    updateTurns(current.map((t, i) => (i === turnIndex ? { ...t, feedback: sentiment } : t)));
    const question = sentiment === 'down' ? current[turnIndex - 1]?.content : undefined;
    trackAiFeedback({ turn_index: turnIndex, sentiment, question });
  };

  return (
    <div className={s.conversation} ref={conversationRef}>
      {turns.map((turn, i) => {
        if (turn.role === 'user') {
          return (
            <div
              key={i}
              className={s.questionBubble}
              ref={i === lastUserTurnIndex ? latestUserMsgRef : undefined}
            >
              {turn.content}
            </div>
          );
        }
        return (
          <div
            key={i}
            className={s.answer}
            ref={i === lastAssistantTurnIndex ? lastAnswerRef : undefined}
          >
            {!turn.content && <Thinking reasoning={turn.reasoning} />}
            <Streamdown
              parseIncompleteMarkdown
              controls={false}
              lineNumbers={false}
              linkSafety={{ enabled: false }}
              remend={{ linkMode: 'text-only' }}
              plugins={{ code: codePlugin as any }}
              components={{
                a: ({ href, children, ...props }) => {
                  const pill = renderLink(href, children);
                  if (pill) return pill;
                  return (
                    <a href={href} target="_blank" rel="noreferrer" {...props}>
                      {children}
                    </a>
                  );
                },
              }}
            >
              {turn.content}
            </Streamdown>
            {posthogReady &&
              turn.content &&
              !(i === lastAssistantTurnIndex && aiState === 'streaming') && (
                <div className={s.feedbackRow} data-state={turn.feedback ? 'done' : 'prompt'}>
                  <div className={s.feedbackPrompt}>
                    <span className={s.feedbackLabel}>Was this helpful?</span>
                    <button
                      type="button"
                      className={s.feedbackButton}
                      aria-label="Helpful"
                      onClick={() => submitFeedback(i, 'up')}
                    >
                      <span
                        className={s.feedbackButtonIcon}
                        dangerouslySetInnerHTML={{ __html: thumbsUpIcon }}
                      />
                      Yes
                    </button>
                    <button
                      type="button"
                      className={s.feedbackButton}
                      aria-label="Not helpful"
                      onClick={() => submitFeedback(i, 'down')}
                    >
                      <span
                        className={s.feedbackButtonIcon}
                        dangerouslySetInnerHTML={{ __html: thumbsDownIcon }}
                      />
                      No
                    </button>
                  </div>
                  <div className={s.feedbackThanks} aria-live="polite">
                    Thank you for your feedback!
                  </div>
                </div>
              )}
          </div>
        );
      })}
      {aiState === 'error' && <p className={s.errorLine}>{aiError}</p>}
      <div ref={spacerRef} style={{ flexShrink: 0 }} aria-hidden />
      <span role="status" aria-live="polite" className={s.srOnly}>
        {aiState === 'streaming' ? 'Generating answer…' : ''}
        {aiState === 'done' ? 'Answer complete.' : ''}
        {aiState === 'error' ? `Error: ${aiError}` : ''}
      </span>
    </div>
  );
});

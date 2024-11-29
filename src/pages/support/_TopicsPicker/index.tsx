import { useEffect, useState } from 'react';
import s from './style.module.css';
import { SupportTopicFragment } from '../_graphql';
import type { ResultOf } from 'gql.tada';
import { Form } from '../_Form';
import { Form as SalesForm } from '../../contact/_Form';
import { parseUrlSearchParams, useSearchParams } from './utils';
import ProseReactComponent from '~/components/Prose/ReactComponent';

type GqlTopic = ResultOf<typeof SupportTopicFragment>;
export type Topic = Omit<GqlTopic, 'description'> & { description: string | undefined };

type Props = {
  topics: Topic[];
  initialLocationSearch: string;
};

function isDefined<T>(
  value: T | null | undefined | false,
): value is NonNullable<Exclude<T, false>> {
  return value !== null && value !== undefined && value !== false;
}

export function TopicsPicker({ topics, initialLocationSearch }: Props) {
  const [formVisible, setFormVisible] = useState(
    typeof window !== 'undefined' && window.location.hash === '#form',
  );

  const queryString = parseUrlSearchParams(useSearchParams(initialLocationSearch));

  const setSelectedTopicSlugs = (slugs: string[]) => {
    let currentUrl = new URL(window.location.href);
    let searchParams = currentUrl.searchParams;
    searchParams.set('topics', slugs.join('/'));
    window.history.pushState({}, '', currentUrl);
  };

  const rootTopicSlug = queryString.topicSlugs[0];
  const rootTopics = topics.filter((t) => !t.parent);
  const rootTopic = rootTopicSlug ? topics.find((t) => t.slug === rootTopicSlug) : undefined;
  const subTopics = rootTopic?.children
    ? rootTopic.children.map((x) => topics.find((t) => t.slug === x.slug)).filter(isDefined)
    : [];
  const leafTopic =
    queryString.topicSlugs.length > 0 &&
    topics.find((t) => t.slug === queryString.topicSlugs[queryString.topicSlugs.length - 1]);

  const handleChange = (level: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const topicSlug = event.target.value;

    setFormVisible(false);

    if (level === 0) {
      setSelectedTopicSlugs([topicSlug]);
    }
    if (level === 1) {
      setSelectedTopicSlugs([queryString.topicSlugs[0]!, topicSlug]);
    }
  };

  useEffect(() => {
    if (formVisible) {
      const el = document.getElementById('form');

      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start',
        });
      }
    }
  }, [formVisible]);

  return (
    <div className={s.root}>
      <div className={s.picker}>
        <div className={s.topic}>
          <p className={s.topicLabel}>Topic:</p>
          <select
            className={s.topicSelect}
            autoComplete="off"
            value={queryString.topicSlugs[0] || 'empty'}
            onChange={handleChange.bind(null, 0)}
          >
            <option value="empty" disabled>
              Please select a topic...
            </option>
            {rootTopics.map((topic) => (
              <option value={topic.slug} key={topic.slug}>
                {topic.title}
              </option>
            ))}
          </select>
        </div>
        {rootTopic && subTopics.length > 0 && (
          <div className={s.topic}>
            <p className={s.topicLabel}>{rootTopic.subtopicQuestion}</p>
            <select
              className={s.topicSelect}
              value={queryString.topicSlugs[1] || 'empty'}
              onChange={handleChange.bind(null, 1)}
            >
              <option value="empty" disabled>
                Please select a topic...
              </option>
              {subTopics.map((topic) => (
                <option value={topic.slug} key={topic.slug}>
                  {topic.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {leafTopic && (leafTopic.commonQuestions.length > 0 || leafTopic.description) && (
        <div className={s.description}>
          <ProseReactComponent>
            {leafTopic.description && (
              <div dangerouslySetInnerHTML={{ __html: leafTopic.description }} />
            )}
            {leafTopic.commonQuestions.length > 0 && (
              <>
                <h3>Popular guides and tutorials</h3>
                <p>
                  Please take a look at these resources, as they might probably be the fastest way
                  to solve your issue!
                </p>
                <ul>
                  {leafTopic.commonQuestions.map((q) => (
                    <li id={q.url} key={q.url}>
                      <a href={q.url}>{q.title}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {leafTopic && leafTopic.children.length === 0 && !leafTopic.disableContactForm && (
              <>
                <h3>Didn&#39;t find what you&#39;re looking for?</h3>
                <ul>
                  <li>
                    <a
                      href="#form"
                      onClick={(e) => {
                        e.preventDefault();
                        setFormVisible(true);
                      }}
                    >
                      Contact our support team
                    </a>
                  </li>
                </ul>
              </>
            )}
          </ProseReactComponent>
        </div>
      )}
      {leafTopic &&
        leafTopic.children.length === 0 &&
        ((leafTopic.commonQuestions.length === 0 && !leafTopic.disableContactForm) ||
          (leafTopic.commonQuestions.length > 0 && formVisible)) && (
          <div className={s.talkWithUs} id="form">
            <div className={s.talkWithUsInner}>
              <div className={s.talkWithUsIntro}>
                <div className={s.talkWithUsTitle}>Talk with us!</div>
                <div className={s.talkWithUsDescription}>
                  Our experts are available to answer any of your questions. We’re available in a
                  number of ways, any time that you need us.
                </div>
              </div>
              <div className={s.form}>
                {leafTopic.contactFormType === 'support' ? (
                  <Form
                    initialValues={{
                      email: queryString.email || '',
                      errorId: queryString.errorId || '',
                      project: queryString.projectUrl || '',
                      issueType: leafTopic.autoResponderType,
                    }}
                  />
                ) : (
                  <SalesForm issueType="sales" />
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

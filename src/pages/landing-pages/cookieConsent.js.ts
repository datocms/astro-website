import type { APIRoute } from 'astro';
import { LINKEDIN_PARTNER_ID, PUBLIC_HOSTNAME } from 'astro:env/client';
import { CONSENT_COOKIE_NAME, hasMarketingConsent } from '~/lib/consent';
import { GOOGLE_ADS_ID } from '~/lib/googleAds';

function maybeCookieDomain() {
  if (!PUBLIC_HOSTNAME) {
    return '';
  }

  return 'domain=.' + PUBLIC_HOSTNAME.split('.').slice(-2).join('.') + ';';
}

// Usage:
// <script type="text/javascript" src="https://www.datocms.com/landing-pages/cookieConsent.js"></script>

const linkedinSnippet = LINKEDIN_PARTNER_ID
  ? `
window._linkedin_partner_id="${LINKEDIN_PARTNER_ID}";
window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];
window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s)})(window.lintrk);
`
  : '';

const scriptsToAddOnCookieConsent = `
var _gtag=document.createElement("script");_gtag.async=true;_gtag.src="https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}";document.head.appendChild(_gtag);
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${GOOGLE_ADS_ID}");
${linkedinSnippet}
!function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="$i ji init en nn Ar tn an Yi capture calculateEventProperties dn register register_once register_for_session unregister unregister_for_session gn getFeatureFlag getFeatureFlagPayload getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync mn identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty fn hn createPersonProfile setInternalOrTestUser pn Ji opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing un debug Dr vn getPageViewId captureTraceFeedback captureTraceMetric Zi".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_u7FPCuTnUpVlYYTYmfeutKpnI7qEE2cjwgzjz3JDuH6', {
  api_host: 'https://c.datocms.com',
  ui_host: 'https://eu.posthog.com',
  defaults: '2026-05-30',
});

`;

const cookieConsentScript = `
(() => {
  function addScripts() {
    const script = document.createElement('script');
    script.src = 'https://www.datocms.com/landing-pages/cookieConsent.js?loadTracking=true';
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  function onReady(cb) {
    if (document.readyState === 'complete') {
      cb();
    } else {
      window.addEventListener('load', cb);
    }
  }

  const html = \`
  <div class="consent--cookiesWrapper">
    <div class="consent--cookies">
      <div class="consent--cookiesTitle">Can we use cookies?</div>
      <div class="consent--cookiesText">We use them to find the parts of the site that get in your way, so we can fix them, and to see which of our ads work. We never sell your data. The details are in our <a href="https://www.datocms.com/legal/cookie-policy">Cookie Policy</a>.</div>
      <button class="consent--cookiesButton consent--cookiesPrimaryButton" data-consent="true">Accept cookies</button>
      <button class="consent--cookiesButton" data-decline="true">Reject</button>
    </div>
  </div>
  \`;

  const css = \`
  /* The modal of www.datocms.com: a flat card on the paper of the page, a
     hairline, no shadow, the text at the left, the pill buttons of the
     website. On www.datocms.com the colours are the tokens of the theme of
     the page (src/styles/tokens.css), thus the modal takes the theme. On a
     page without these tokens (the dashboard), the colours are the neutral
     values after the comma. The scheme comes from data-color-scheme on
     <html>. When <html> has no data-color-scheme, it comes from the OS. */
  .consent--cookiesWrapper {
    --consent-backdrop: rgba(0, 0, 0, 0.45);
    --consent-surface: var(--surface-default, #ffffff);
    --consent-border: var(--border-on-page, rgba(31, 33, 38, 0.16));
    --consent-ink: var(--text-on-page, #1f2126);
    --consent-ink-muted: var(--text-on-page-muted, #5c6270);
    --consent-button: var(--surface-button, #1f2126);
    --consent-button-ink: var(--text-button, #ffffff);
    --consent-button-hover: var(--surface-button-hover, #3a3d45);
    --consent-button-hover-ink: var(--text-button-hover, #ffffff);
    --consent-soft: var(--surface-button-soft, rgba(31, 33, 38, 0.07));
    --consent-soft-ink: var(--text-button-soft, #1f2126);
    color-scheme: light;
    position: fixed;
    z-index: 1000000;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: var(--consent-backdrop);
    animation: consent-appear 240ms cubic-bezier(0.16, 1, 0.3, 1);
    font-family: 'ABC Oracle', 'ABC Oracle Fallback HN', 'ABC Oracle Fallback Arial', 'ABC Oracle Fallback Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  :root[data-color-scheme='dark'] .consent--cookiesWrapper {
    --consent-backdrop: rgba(0, 0, 0, 0.6);
    --consent-surface: var(--surface-default, #1e1f24);
    --consent-border: var(--border-on-page, rgba(255, 255, 255, 0.14));
    --consent-ink: var(--text-on-page, #ececef);
    --consent-ink-muted: var(--text-on-page-muted, #a3a8b5);
    --consent-button: var(--surface-button, #ececef);
    --consent-button-ink: var(--text-button, #1e1f24);
    --consent-button-hover: var(--surface-button-hover, #ffffff);
    --consent-button-hover-ink: var(--text-button-hover, #1e1f24);
    --consent-soft: var(--surface-button-soft, rgba(255, 255, 255, 0.09));
    --consent-soft-ink: var(--text-button-soft, #ececef);
    color-scheme: dark;
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-color-scheme]) .consent--cookiesWrapper {
      --consent-backdrop: rgba(0, 0, 0, 0.6);
      --consent-surface: var(--surface-default, #1e1f24);
      --consent-border: var(--border-on-page, rgba(255, 255, 255, 0.14));
      --consent-ink: var(--text-on-page, #ececef);
      --consent-ink-muted: var(--text-on-page-muted, #a3a8b5);
      --consent-button: var(--surface-button, #ececef);
      --consent-button-ink: var(--text-button, #1e1f24);
      --consent-button-hover: var(--surface-button-hover, #ffffff);
      --consent-button-hover-ink: var(--text-button-hover, #1e1f24);
      --consent-soft: var(--surface-button-soft, rgba(255, 255, 255, 0.09));
      --consent-soft-ink: var(--text-button-soft, #ececef);
      color-scheme: dark;
    }
  }

  /* The card comes up a little and the backdrop fades in */
  @keyframes consent-appear {
    from {
      opacity: 0;
    }
  }

  @keyframes consent-rise {
    from {
      transform: translateY(8px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .consent--cookiesWrapper,
    .consent--cookies {
      animation: none;
    }
  }

  .consent--cookies {
    box-sizing: border-box;
    width: 100%;
    max-width: 480px;
    padding: 28px;
    background: var(--consent-surface);
    border: 1px solid var(--consent-border);
    border-radius: 12px;
    color: var(--consent-ink);
    font-size: var(--type-s, 0.875rem);
    font-weight: 400;
    line-height: 1.45;
    letter-spacing: -0.005em;
    text-align: left;
    animation: consent-rise 320ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .consent--cookiesTitle {
    margin-bottom: 10px;
    font-size: var(--type-l, 1.375rem);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -0.03em;
    text-wrap: balance;
  }

  .consent--cookiesText {
    margin-bottom: 24px;
    color: var(--consent-ink-muted);
    text-wrap: pretty;
  }

  .consent--cookies a {
    color: var(--consent-ink);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
  }

  /* The pills of the website: the hover changes the colours at once */
  .consent--cookiesButton {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 16px;
    margin: 0 8px 0 0;
    border: 0;
    border-radius: 999px;
    background: var(--consent-soft);
    color: var(--consent-soft-ink);
    font: inherit;
    font-weight: 500;
    letter-spacing: -0.01em;
    white-space: nowrap;
    cursor: pointer;
  }

  .consent--cookiesButton:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .consent--cookiesButton:active {
    opacity: 0.8;
  }

  .consent--cookiesPrimaryButton {
    background: var(--consent-button);
    color: var(--consent-button-ink);
  }

  /* The arrow is decoration: screen readers do not read it */
  .consent--cookiesPrimaryButton::after {
    content: '→' / '';
  }

  @media (hover: hover) {
    .consent--cookiesButton:hover {
      background: var(--consent-button);
      color: var(--consent-button-ink);
    }

    .consent--cookiesPrimaryButton:hover {
      background: var(--consent-button-hover);
      color: var(--consent-button-hover-ink);
    }
  }

  @media (max-width: 420px) {
    .consent--cookies {
      padding: 22px;
    }

    .consent--cookiesButton {
      margin: 0 0 8px;
    }
  }
  \`;

  const cookieName = '${CONSENT_COOKIE_NAME}';

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp(name + '=([^;]+)'));
    if (match) return match[1];
  };

  const setCookie = (name, value) => {
    const expiration = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = name + '=' + value + '; expires=' + expiration + '; path=/; ${maybeCookieDomain()} samesite=none; secure';
  };

  onReady(() => {
    if (getCookie(cookieName)) {
      addScripts();
      return;
    }

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);

    document
      .querySelector('.consent--cookies [data-consent]')
      .addEventListener('click', () => {
        container.parentNode.removeChild(container);
        setCookie(cookieName, 'true');
        addScripts();
      });

    document
      .querySelector('.consent--cookies [data-decline]')
      .addEventListener('click', () => {
        container.parentNode.removeChild(container);
      });
  });
})();
`;

const headers = {
  'content-type': 'application/javascript',
  'surrogate-control': 'no-store, max-age=0',
};

export const GET: APIRoute = async ({ cookies, request }) => {
  // 'client-geo-country' is exposed by Fastly via custom VCL snippet
  const country = request.headers.get('client-geo-country');
  const consented = hasMarketingConsent(request, cookies);

  return new Response(
    [
      `/* c:${country ?? '?'},a:${consented ? 'y' : 'n'} */`,
      consented ? scriptsToAddOnCookieConsent : cookieConsentScript,
    ].join('\n'),
    { headers },
  );
};

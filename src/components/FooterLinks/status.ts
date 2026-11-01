// The <status-badge> element: it shows the status of the DatoCMS services
// at the end of the footer (see Component.astro).
//
// - The server renders the "checking" text. The element then reads the
//   status page API and shows the result.
// - A result from the API stays in localStorage for 5 minutes, thus a visit
//   to many pages does one request only. When the browser blocks
//   localStorage, the element reads the API on each page.
// - The data-theme of the element gives the colour of the dot: green when
//   all the services are up, pink when one is down, orange for all other
//   values (for example maintenance or degraded performance). The text
//   tells which one.
// - When the request fails, or when the API does not know the status, the
//   element has no data-theme. The dot is hollow and has the colour of the
//   footer, and the text is "See status page". The element does not keep a
//   failed request, thus the next page tries again.
// - The link to the status page is always there.

import type { Theme } from '~/lib/theme';
import { WebComponent } from '~/lib/WebComponent';

export const TAG = 'status-badge';

const API_URL = 'https://status.datocms.com/api/component-status?days=1';
const STORAGE_KEY = 'statusBadgeData';
const MAX_AGE = 5 * 60 * 1000;

interface ServiceStatus {
  id: string;
  // The API can also send `unknown`, `unconfirmed_down`,
  // `degraded-performance`, `maintenance`...
  status: string;
}

interface StoredStatus {
  updatedAt: number;
  status: string;
}

function readStored(): StoredStatus | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as StoredStatus) : null;
    return data && Date.now() - data.updatedAt < MAX_AGE ? data : null;
  } catch {
    return null;
  }
}

function writeStored(status: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ updatedAt: Date.now(), status }));
  } catch {
    // The browser blocks localStorage: the next page reads the API again.
  }
}

// It returns null when the request fails.
async function fetchStatus(): Promise<string | null> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) return null;
    const services = (await response.json()) as ServiceStatus[];
    const statuses = services.map((service) => service.status);
    // A service that is down is more important than a service that is slow.
    if (statuses.includes('down')) return 'down';
    return statuses.find((status) => status !== 'up') ?? 'up';
  } catch {
    return null;
  }
}

class StatusBadge extends WebComponent {
  async parsedCallback() {
    const text = this.$('[data-status-text]');
    const stored = readStored();
    const status = stored ? stored.status : await fetchStatus();
    if (!stored && status) writeStored(status);
    this.show(text, status);
  }

  private show(text: HTMLElement, status: string | null) {
    // The text for "up" comes from the footer data (data-up-text).
    const labels: Record<string, string> = {
      up: this.dataset.upText ?? 'All systems normal',
      down: 'Down',
      maintenance: 'Maintenance',
      'degraded-performance': 'Degraded performance',
      unconfirmed_down: 'Possible outage',
    };
    const themes: Record<string, Theme> = { up: 'green', down: 'pink' };

    this.dataset.status = status ?? 'unreachable';

    if (status === null || status === 'unknown') {
      text.textContent = 'See status page';
      delete this.dataset.theme;
      return;
    }

    text.textContent = labels[status] ?? 'Partial outage';
    this.dataset.theme = themes[status] ?? 'orange';
  }
}

export function defineStatusBadge() {
  if (!customElements.get(TAG)) customElements.define(TAG, StatusBadge);
}

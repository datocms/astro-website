// The <status-badge> element: it shows the status of the DatoCMS services
// at the end of the footer (see Component.astro).
//
// - The server renders the "checking" text. The element then reads the
//   status page API and shows the result.
// - The result stays in localStorage for 5 minutes, thus a visit to many
//   pages does one request only. When the browser blocks localStorage, the
//   element reads the API on each page.
// - The data-theme of the element gives the colour of the dot: green when
//   all the services are up, pink when one is down, orange for all other
//   values (for example maintenance or degraded performance).
// - When the request fails, the element shows "See status page". The link
//   to the status page is always there.

import type { Theme } from '~/lib/theme';

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

async function fetchStatus(): Promise<string> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) return 'unknown';
    const services = (await response.json()) as ServiceStatus[];
    return services.find((service) => service.status !== 'up')?.status ?? 'up';
  } catch {
    return 'unknown';
  }
}

class StatusBadge extends HTMLElement {
  async connectedCallback() {
    const stored = readStored();
    const status = stored?.status ?? (await fetchStatus());
    if (!stored) writeStored(status);
    this.show(status);
  }

  private show(status: string) {
    const text = this.querySelector('[data-status-text]');
    if (!text) return;

    // The text for "up" comes from the footer data (data-up-text).
    const labels: Record<string, string> = {
      up: this.dataset.upText ?? 'All systems normal',
      down: 'Down',
    };
    const themes: Record<string, Theme> = { up: 'green', down: 'pink' };

    text.textContent = labels[status] ?? 'See status page';
    this.dataset.theme = themes[status] ?? 'orange';
    this.dataset.status = status;
  }
}

export function defineStatusBadge() {
  if (!customElements.get(TAG)) customElements.define(TAG, StatusBadge);
}

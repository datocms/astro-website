type PostHogLike = { capture: (event: string, properties?: Record<string, unknown>) => void };

function getPostHog(): PostHogLike | null {
  if (typeof window === 'undefined') return null;
  const ph = (window as unknown as { posthog?: PostHogLike }).posthog;
  return ph && typeof ph.capture === 'function' ? ph : null;
}

export function capture(event: string, properties?: Record<string, unknown>): void {
  getPostHog()?.capture(event, properties);
}

export function isPostHogReady(): boolean {
  return getPostHog() !== null;
}

export function makeSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

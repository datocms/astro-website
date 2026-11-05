const ordinal = (day: number): string => {
  const rest = day % 100;
  if (rest >= 11 && rest <= 13) return `${day}th`;
  return `${day}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[day % 10] ?? 'th'}`;
};

/** Format an ISO date or date-time like "August 19th, 2026". */
export function formatLongDate(iso: string): string {
  const date = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  return `${month} ${ordinal(date.getUTCDate())}, ${date.getUTCFullYear()}`;
}

/** Format an ISO date or date-time like "Tuesday 19th", for a list in groups by month. */
export function formatDayOfMonth(iso: string): string {
  const date = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  const weekday = date.toLocaleString('en-US', { weekday: 'long', timeZone: 'UTC' });
  return `${weekday} ${ordinal(date.getUTCDate())}`;
}

/** Format an ISO date or date-time like "August 2026". */
export function formatMonth(iso: string): string {
  const date = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

const DAY = 24 * 60 * 60 * 1000;

/**
 * Format an ISO date-time as a time before `now`, in sentence case:
 * "Yesterday", "4 days ago", "A week ago". Use it only in markup that the
 * server renders for each request: a cached page shows an old value.
 */
export function formatRelativeDate(iso: string, now = new Date()): string {
  const days = Math.max(0, Math.floor((now.getTime() - new Date(iso).getTime()) / DAY));
  const ago = (count: number, unit: string) =>
    count === 1 ? `A ${unit} ago` : `${count} ${unit}s ago`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return ago(Math.floor(days / 7), 'week');
  if (days < 365) return ago(Math.floor(days / 30), 'month');
  return ago(Math.floor(days / 365), 'year');
}

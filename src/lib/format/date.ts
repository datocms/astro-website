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

const DAY = 24 * 60 * 60 * 1000;

/**
 * Format an ISO date-time as a time before `now`: "Yesterday",
 * "4 Days Ago", "A Week Ago". Use it only in markup that the server renders
 * for each request: a cached page shows an old value.
 */
export function formatRelativeDate(iso: string, now = new Date()): string {
  const days = Math.max(0, Math.floor((now.getTime() - new Date(iso).getTime()) / DAY));
  const ago = (count: number, unit: string) =>
    count === 1 ? `A ${unit} Ago` : `${count} ${unit}s Ago`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} Days Ago`;
  if (days < 30) return ago(Math.floor(days / 7), 'Week');
  if (days < 365) return ago(Math.floor(days / 30), 'Month');
  return ago(Math.floor(days / 365), 'Year');
}

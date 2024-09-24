import { format, parse } from 'date-fns';

export function formatDate(isoDate: string): string {
  const date = parse(isoDate, "yyyy-MM-dd'T'HH:mm:ssxxx", new Date());
  return format(date, 'MMMM do, yyyy');
}

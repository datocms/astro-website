import { format, parse } from 'date-fns';

const si = [
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'G' },
];

export function formatNumberInMetricSystem(num: number) {
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;

  for (i = si.length - 1; i > 0; i -= 1) {
    if (num >= si[i]!.value) {
      break;
    }
  }

  return (num / si[i]!.value).toFixed(0).replace(rx, '$1') + si[i]!.symbol;
}

const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];

export function formatNumberInBytes(num: number) {
  if (Number.isNaN(num)) {
    return '-';
  }

  if (num === 0) {
    return '0 bytes';
  }

  const number = Math.floor(Math.log(num) / Math.log(1024));

  return `${(num / 1024 ** Math.floor(number)).toFixed(0)}${units[number]}`;
}

export function formatNumber(x: string | number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatDate(isoDate: string): string {
  const date = parse(isoDate, "yyyy-MM-dd'T'HH:mm:ssxxx", new Date());
  return format(date, 'MMMM do, yyyy');
}

export function formatVideoDuration(seconds: number | null) {
  if (typeof seconds !== 'number') {
    return '—';
  }

  const hours = Math.floor(seconds / 3600);
  const remainingSecondsAfterHours = seconds % 3600;
  const minutes = Math.floor(remainingSecondsAfterHours / 60);
  const remainingSeconds = remainingSecondsAfterHours % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
}

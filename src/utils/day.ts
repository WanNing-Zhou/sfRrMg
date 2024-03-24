import dayjs from 'dayjs';

export function formatToDay(time: any, locale?: string): string {
  if (locale) {
    dayjs.locale(locale);
  }

  return dayjs(time).format('YYYY/MM/DD'); // '25/01/2019'
}

export function formatTime(): string {
  return '';
}

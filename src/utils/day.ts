import dayjs from 'dayjs';

export function formatToDay(time: any, locale?: string): string {
  if (locale) {
    dayjs.locale(locale);
  }

  return dayjs(time).format('YYYY/MM/DD'); // '25/01/2019'
}

export function formatToDateTime(time: any): string {
  return dayjs(time).format('YYYY/MM/DD HH:mm:ss');
}

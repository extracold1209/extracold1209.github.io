import dayjs from 'dayjs';
import { config } from '../../data';

const { maxPostsInPage } = config;

// Prevent webpack window problem
const isBrowser = () => typeof window !== 'undefined';

const getPageNumber = () => {
  if (isBrowser()) {
    const pageMatch = window.location.pathname.match(/page[/](\d)/);
    return pageMatch ? +pageMatch[1] : -1;
  }
};

const getCurrentPage = () => {
  if (isBrowser()) {
    const str = window.location.pathname;
    if (str.indexOf('page') !== -1) {
      // Return the last pathname in number
      return getPageNumber();
    }
  }

  return 0;
};

const getPath = () => (isBrowser() ? window.location.pathname : '');

const getMaxPages = (amount: number = 0) => Math.ceil(amount / maxPostsInPage);

// Array.fill() is added by trial and error
const getPages = (amount: number) => new Array(amount).fill(undefined).map((_, index) => `/page/${index + 1}`);

const overflow = () => getCurrentPage() === getMaxPages();

const parseDate = (date: string) => dayjs(date).format('YYYY/MM/DD HH:mm');

export {
  isBrowser,
  getCurrentPage,
  getMaxPages,
  getPages,
  overflow,
  parseDate,
  getPath,
  getPageNumber,
};

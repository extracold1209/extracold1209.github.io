import { navigate } from 'gatsby';
import dayjs from 'dayjs';

const getUrl = ({ createdDate, url }: { createdDate: string; url: string; }) => `/${dayjs(createdDate).format('YYYY/MM/DD')}/${url}`;

const gotoPage = async (url: string, show = false) => {
    if (show) {
        // @ts-ignore
        await window.$('.collapse').collapse('show');
    } else {
        // @ts-ignore
        await window.$('.collapse').collapse('hide');
    }

    await navigate(url);
};

// @ts-ignore
const parseMarkdownUrl = (date: string, rawUrl: string) => `/${date}/${rawUrl.match(/_posts[/](.*).md/)[1]}/`;

const parseUrl = (date: string, rawUrl: string) => {
    if (rawUrl === 'about') {
        return '/about/';
    }
    return `/${date}/${rawUrl}/`;
};

const minusOnePage = (currentPage: number) => {
    if (currentPage - 1 >= 1) {
        return currentPage - 1;
    }

    return -1;
};

const addOnePage = (currentPage = 0, maxPages = 1) => {
    if (currentPage + 1 < maxPages) {
        return currentPage + 1;
    }
    return -1;
};

const parsePageUrl = (index: number) => {
    if (index > 0) {
        return `/page/${index}`;
    }
    if (index === 0) {
        return '/';
    }
    return -1;
};

const handlePreviousPage = (pageNumber: number) => {
    const index = minusOnePage(+pageNumber);

    return parsePageUrl(index);
};

const handleNextPage = (pageNumber: number, maxPages: number) => {
    const index = addOnePage(+pageNumber, maxPages);

    return parsePageUrl(index);
};

export {
    getUrl,
    parseMarkdownUrl,
    parseUrl,
    handlePreviousPage,
    handleNextPage,
    gotoPage,
};

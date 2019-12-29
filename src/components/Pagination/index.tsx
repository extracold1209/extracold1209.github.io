import React from 'react';
import { Link } from 'gatsby';

import Dropdown from './Dropdown';

import { getPages } from '../../api';
import { handleNextPage, handlePreviousPage } from '../../api/url';

const PageItem: React.FC<{number: string | number; content: string}> = ({ number, content }) => (
  <li className={`page-item${number < 0 ? ' disabled' : ''}`}>
    <Link className="page-link" to={`${number}`}>
      {content || number}
    </Link>
  </li>
);

const getPageNumber = (pathname: string) => pathname.split('/')[2];

const Pagination: React.FC<{pathname: string; pageCount: number}> = ({ pathname, pageCount }) => {
  const currentPageNumber = getPageNumber(pathname);
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        <PageItem
          number={handlePreviousPage(currentPageNumber)}
          content="Previous"
        />
        <li className="page-item">
          <Dropdown pages={getPages(pageCount)} text={currentPageNumber} />
        </li>
        <PageItem
          number={handleNextPage(currentPageNumber, pageCount)}
          content="Next"
        />
      </ul>
    </nav>
  );
};

export default Pagination;

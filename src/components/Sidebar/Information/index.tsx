import React from 'react';

import Friend from '../Friend';
import LatestPost from '../LatestPost';
import './index.scss';

// eslint-disable-next-line react/prop-types
const Information: React.FC<{totalCount: number; posts: any[]}> = ({ totalCount, posts = [] }) => (
  <div className="d-none d-lg-block information my-2">
    <hr />
    <p>
      Total&nbsp;
      {totalCount}
      &nbsp;posts
    </p>
    <hr />
    <LatestPost posts={posts} />
    <hr />
    <Friend />
  </div>
);

export default Information;

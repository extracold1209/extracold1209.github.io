import React from 'react';
import { take } from 'lodash';
import { Link } from 'gatsby';

import { maxRecentPostsCount } from '../../../../data/config.json';
import './index.scss';

const LatestPost: React.FC<{ posts: any }> = ({ posts }) => (
    <div className="latest-post">
        <p>Recent Post</p>
        {
            take<any>(posts, maxRecentPostsCount || 5).map(({node}: { node: any }) => (
                <Link
                    to={node.frontmatter.url || node.frontmatter.slug || node.fields.slug}
                    key={node.frontmatter.url || node.frontmatter.slug || node.fields.slug}
                >
                    {node.frontmatter.title}
                </Link>
            ))
        }
    </div>
);

export default LatestPost;

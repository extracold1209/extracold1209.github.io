import React from 'react';

import { Link } from 'gatsby';

import './index.scss';

const LatestPost: React.FC<{ posts: any }> = ({ posts }) => (
    <div className="latest-post">
        <p>Recent Post</p>
        {posts.map(({ node }: { node: any }) => (
            <Link
                to={node.frontmatter.url || node.frontmatter.slug || node.fields.slug}
                key={node.frontmatter.url || node.frontmatter.slug || node.fields.slug}
            >
                {node.frontmatter.title}
            </Link>
        ))}
    </div>
);

export default LatestPost;

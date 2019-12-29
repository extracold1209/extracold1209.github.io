import React from 'react';
import { countBy, entries, flatten, flow, get, identity, map } from 'lodash/fp';

import Friend from '../Friend';
import LatestPost from '../LatestPost';
import './index.scss';
import { graphql, Link, useStaticQuery } from "gatsby";


const SidebarGraphqlQuery = graphql`
    query SidebarQuery {
      data: allMarkdownRemark {
        totalCount
        posts: nodes {
          frontmatter {
            tags
          }
        }
      }
      recent: allMarkdownRemark(sort: {order: DESC, fields: frontmatter___date}, limit: 6) {
        latestPosts: edges {
          node {
            fields {
              slug
            }
            frontmatter {
              id
              title
              url: slug
              date
              tags
              description
              headerImage
            }
          }
        }
      }
    }
`;

const Information: React.FC = () => {
    const { data, recent } = useStaticQuery(SidebarGraphqlQuery);
    const { totalCount, posts } = data;
    const tagList = flow(
        map(get(['frontmatter', 'tags'])),
        flatten,
        countBy(identity),
        entries,
    )(posts);

    const { latestPosts } = recent;
    return (
        <div className="d-none d-lg-block information my-2">
            <hr/>
            <p>
                Total&nbsp;
                {totalCount}
                &nbsp;posts
            </p>
            <hr/>
            <p>Categories</p>
            {
                tagList.map(([tagName, count]: [string, number]) => {
                    return <Link to={`/tag/${tagName}`}>
                        <div>{tagName} ({count})
                        </div>
                    </Link>
                })
            }
            <hr/>
            <LatestPost posts={latestPosts}/>
            <hr/>
            <Friend/>
        </div>
    )
};

export default Information;

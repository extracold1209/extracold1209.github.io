/* eslint-disable react/prop-types */
import React from 'react';

import { graphql, Link, useStaticQuery } from 'gatsby';

const NotFoundPage: React.FC = () => {
    const { allSitePage } = useStaticQuery(graphql`
      query getAllPages {
        allSitePage {
          edges {
            node {
              path
            }
          }
        }
      }
    `);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h4>Could not find your web page, all pages of this site are:</h4>
                    {allSitePage.edges.map((page: any) => (
                        <Link to={page.node.path} key={page.node.path}>
                            <li>{page.node.path}</li>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;

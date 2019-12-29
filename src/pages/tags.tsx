import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import Sidebar from '../components/Sidebar';
import Tag from '../components/Tag';
import SEO from '../components/SEO';

const TagPage: React.FC = () => {
    const { allMarkdownRemark } = useStaticQuery(graphql`
      query getAllTags {
        allMarkdownRemark {
          edges {
            node {
              frontmatter {
                tags
              }
            }
          }
        }
      }
    `);

    const mapping: any = {};

    allMarkdownRemark.edges.forEach(({ node }: { node: any }) => {
        const { tags } = node.frontmatter;
        tags.forEach((name: string) => {
            if (mapping[name]) {
                mapping[name] += 1;
            } else {
                mapping[name] = 1;
            }
        });
    });

    const tags = Array.from(Object.keys(mapping)).sort(
        (b, a) => mapping[a] - mapping[b],
    );

    return (
        <div className="container">
            <div
                className="row"
                style={{
                    margin: 15,
                }}
            >
                <Sidebar/>
                <div className="col order-2">
                    {tags.map((item) => (
                        <Tag name={item} key={item} count={mapping[item]}/>
                    ))}
                </div>
            </div>
            <SEO
                title="Labels"
                url="/tags/"
                siteTitleAlt="Calpa's Blog"
                isPost={false}
                description="Tags Page"
                image="/images/foobar.jpg"
            />
        </div>
    );
};

export default TagPage;

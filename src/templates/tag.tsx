import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Card from '../components/Card';
import SEO from '../components/SEO';
import Sidebar from '../components/Sidebar';

const TagPage: React.FC<{ pageContext: any }> = ({ pageContext }) => {
    const { allMarkdownRemark } = useStaticQuery(graphql`
      query tagQuery($tag: [String!]) {
        allMarkdownRemark(
          sort: { order: DESC, fields: frontmatter___date }
          filter: { frontmatter: { tags: { in: $tag } } }
        ) {
          edges {
            node {
              id
              frontmatter {
                id
                url: slug
                title
                date
                tags
                headerImage
                description
              }
            }
          }
        }
      }
    `);

    console.log('tag pagecontext', pageContext);
    const { edges } = allMarkdownRemark;
    const { tag } = pageContext;
    return (
        <div className="container">
            <div
                className="row"
                style={{
                    margin: 15,
                }}
            >
                <Sidebar/>

                <div className="col-xl-10 col-lg-7 col-md-12 col-xs-12 order-2">
                    <div
                        className="col-12"
                        style={{
                            fontSize: 20,
                            margin: 15,
                        }}
                    >
                        {edges.length}
                        &nbsp;Articles in&nbsp;
                        {tag}
                    </div>
                    {edges.map(({ node }: { node: any }) => (
                        <Card {...node.frontmatter} key={node.id}/>
                    ))}
                </div>

                <div className="col-xl-2 col-lg-1 order-3"/>
            </div>

            <SEO
                title={tag}
                url={`/tag/${tag}`}
                siteTitleAlt="Extracold's Blog"
                isPost={false}
                description={tag}
                image="/assets/profile-250x250.jpg"
            />
        </div>
    );
};

export default TagPage;

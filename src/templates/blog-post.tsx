// Components
import React, { useEffect } from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import 'gitalk/dist/gitalk.css';

import { parseDate } from '../api';
import Sidebar from '../components/Sidebar';
import Content from '../components/Content';
import SEO from '../components/SEO';

import Header from '../components/Header';
// import TableOfContent from '../components/TableOfContent';
import ShareBox from '../components/ShareBox';

import config from '../../data/config.json';
// Styles
import './blog-post.scss';

const { name, iconUrl, gitalk } = config;

// Prevent webpack window problem
const isBrowser = typeof window !== 'undefined';
const Gitalk = isBrowser ? require('gitalk') : undefined;

const blogPostQuery = graphql`
  fragment post on MarkdownRemark {
    fields {
      slug
    }
    frontmatter {
      id
      title
      slug
      date
      headerImage
    }
  }

  query BlogPostQuery($index: Int) {
    content: allMarkdownRemark(
      sort: { order: DESC, fields: frontmatter___date }
      skip: $index
      limit: 1
    ) {
      edges {
        node {
          id
          html
          excerpt
          ...post
        }

        previous {
          ...post
        }

        next {
          ...post
        }
      }
    }
  }
`;

const BlogPost: React.FC = () => {
    const {content} = useStaticQuery(blogPostQuery);
    const firstNode = content.edges[0].node;
    const {html, frontmatter, fields, excerpt, id: graphqlId} = firstNode;
    const {slug} = fields;
    const {date, headerImage,title, id} = frontmatter;

    useEffect(() => {
        const GitTalkInstance = new Gitalk({
            ...gitalk,
            title,
            id: id || graphqlId,
        });
        GitTalkInstance.render('gitalk-container');
    }, []);

    return (
        <div className="row post order-2">
            <Header
                img={headerImage || 'https://picsum.photos/1900/450'}
                title={title}
                authorName={name}
                authorImage={iconUrl}
                subTitle={parseDate(date)}
            />
            <Sidebar />
            <div className="col-xl-7 col-lg-6 col-md-12 col-sm-12 order-10 content">
                <Content post={html} />
                <div id="gitalk-container" />
            </div>

            <ShareBox url={slug as string} />

            <SEO
                title={title}
                url={slug}
                siteTitleAlt="Calpa's Blog"
                isPost={false}
                description={excerpt}
                image={headerImage || 'https://i.imgur.com/M795H8A.jpg'}
            />
        </div>
    );
};

export default BlogPost;

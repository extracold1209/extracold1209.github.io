import React from 'react';

import ExternalLink from '../ExternalLink';
import config from '../../../data/config.json';

import './index.scss';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="row">
        <div className="col-sm-12 text-center">
          <p className="architecture">
            Build with&nbsp;
            <ExternalLink href="https://www.gatsbyjs.org/" title="GatsbyJS" />
            &nbsp;and&nbsp;
            <ExternalLink
              href="https://reactjs.org/"
              title={`React ${React.version}`}
            />
            <br />
            The blog is open source and based on&nbsp;
            <ExternalLink
              href="https://github.com/calpa/gatsby-starter-calpa-blog"
              title="calpa/gatsby-starter-calpa-blog"
            />
          </p>
          <p className="copyright">
            Copyright&nbsp;
            <ExternalLink href="https://calpa.me/" title="&copy;Calpa" />
            &nbsp;{new Date().getFullYear()}
            &nbsp;{config.title}
            &nbsp;Theme by Calpa Liu
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

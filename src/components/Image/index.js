import React from 'react';

import './index.scss';

const Image = ({ href, title, text }) => (
  <img
    className="lozad mb-3 align-self-center resized"
    data-src={href}
    title={title || text}
    alt={title || text}
  />
);

export default Image;

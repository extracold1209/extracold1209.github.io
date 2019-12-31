import React from 'react';
import { Link } from 'gatsby';

import Tag from '../Tag';

import './index.scss';

interface IProps {
  title: string;
  date: string;
  url: string
  headerImage?: string
  headerBackgroundColor?: string;
  description?: string;
  tags?: string[];
}

const CardHeader: React.FC<{url: string, image: string; backgroundColor: string}> = ({ url, image, backgroundColor }) => (
  <Link to={url}>
    <div className="wrapper" style={{
      backgroundSize: 'cover',
      backgroundColor: `#${backgroundColor}`,
      backgroundImage: `url(${image})`,
    }}/>
  </Link>
);

// @ts-ignore
// @ts-ignore
const Card: React.FC<IProps> = ({
  title,
  date,
  url,
  headerImage,
  headerBackgroundColor,
  description,
  tags = [],
}) => (
  <div className="col-sm-12 pb-4">
    <div className="custom-card">
      {headerImage && (
        <CardHeader
          url={url}
          image={headerImage}
          backgroundColor={headerBackgroundColor || 'FFFFFF'}
        />
      )}
      <div className="data">
        <div className="content">
          <div className="stats">
            <span className="date">{date.split('T')[0]}</span>
            {tags.map((name: string) => (
              <Tag name={name} key={name}/>
            ))}
          </div>
          <Link to={url}>
            <h4 className="title">{title}</h4>
            <p>{description}</p>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Card;

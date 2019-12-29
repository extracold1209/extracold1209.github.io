import React from 'react';

const Tag: React.FC<{
    name: string;
    count?: string | number;
}> = ({ name, count = '' }) => (
    <a href={`/tag/${name}`} className="header-tag">
        {name}
        &nbsp;
        {count}
    </a>
);

export default Tag;

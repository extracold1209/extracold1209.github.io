import React from 'react';

import ExternalLink from '../../ExternalLink';

import config from '../../../../data/config.json';

import './index.scss';

const { friends = [] }: { friends: any[] } = config;

const Friend: React.FC = () => (
    <div className="friend">
        <p>Links</p>
        {friends.map(friend => (
            <ExternalLink
                href={friend.href}
                title={friend.title}
                key={friend.title}
                rel="noopener"
            />
        ))}
    </div>
);

export default Friend;

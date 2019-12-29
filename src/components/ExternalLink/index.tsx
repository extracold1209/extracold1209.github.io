import React from 'react';

interface IProps {
    href: string;
    title: string;
    target?: string;
    className?: string;
    rel?: string;
}

const ExternalLink: React.FC<IProps> = (
    {
        href,
        title,
        target = '_blank',
        className = '',
        rel = 'external nofollow noopener',
    }
) => (<a href={href} rel={rel} target={target} className={className}>{title}</a>);

export default ExternalLink;

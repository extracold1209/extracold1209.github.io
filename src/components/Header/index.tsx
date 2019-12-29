import React from 'react';
import './index.scss';

interface IProps {
    img: string;
    title?: string;
    subTitle?: string;
    authorName?: string;
    authorImage?: string;
}

const Header: React.FC<IProps> = (
    {
        img,
        title = '',
        subTitle = '',
        authorImage = '',
        authorName = '',
    }
) => (
    <div className="col-12 header" style={{ padding: 0 }} id="header">
        <div
            className="img-container"
            style={{
                backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ), url(${img})`,
                marginTop: -58,
            }}
        >
            {title && <h1 className="u-title">{title}</h1>}
            {subTitle && (
                <div className="u-subtitle">
                    <div className="m-left">
                        {authorImage && (
                            <img
                                src={authorImage}
                                className="author-image"
                                alt={authorName}
                            />
                        )}
                        <span className="author-name">{authorName}</span>
                    </div>
                    <span className="text">{subTitle}</span>
                </div>
            )}
        </div>
    </div>
);


export default Header;

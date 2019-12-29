import React from 'react';

import ReactGA from 'react-ga';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './index.scss';

interface IProps {
    url: string;
    hasCommentBox?: boolean;
}

const CommentButton: React.FC = () => (
    <a
        className="share-button"
        style={{
            lineHeight: '1.7rem',
            color: '#337ab7',
            paddingLeft: '0.15rem',
        }}
        href="#gitalk-container"
        onClick={() =>
            ReactGA.event({
                category: 'User',
                action: 'Goto Comment Box',
            })
        }
    >
        <FontAwesomeIcon icon={['far', 'comment']}/>
    </a>
);

const ShareBox: React.FC<IProps> = ({ url, hasCommentBox = true }) => (
    <div className="m-share-box">
        {hasCommentBox && <CommentButton/>}
        <a
            className="share-button"
            href="#header"
            onClick={() => {
                ReactGA.event({
                    category: 'User',
                    action: 'Scroll to Top',
                });
            }}
            style={{
                lineHeight: '1.7rem',
                paddingLeft: '0.1rem',
            }}
        >
            <FontAwesomeIcon icon={['fas', 'chevron-up']}/>
        </a>
    </div>
);

export default ShareBox;

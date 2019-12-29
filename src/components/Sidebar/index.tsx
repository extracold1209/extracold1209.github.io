import React from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import config from '../../../data/config.json';

import Information from './Information';

import './index.scss';
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const {
    wordings = [],
    githubUsername,
    email,
    iconUrl,
    about,
} = config;

const Icon: React.FC<{
    href: string;
    icon: IconProp;
}> = ({ href, icon }) => (
    <a
        target="_blank"
        href={href}
        rel="external nofollow noopener noreferrer"
        className="custom-icon"
    >
    <span className="fa-layers fa-fw fa-2x">
      <FontAwesomeIcon icon={icon}/>
    </span>
    </a>
);

const Sidebar: React.FC = () => {
    return (
        <header className="intro-header site-heading text-center col-xl-2 col-lg-3 col-xs-12 order-lg-1">
            <div className="about-me">
                <Link to={about} className="name">
                    <img className="avatar" src={iconUrl} alt="extracold1209"/>
                    <h4>ExtraCold</h4>
                </Link>
                <p className="mb-1">{wordings[0]}</p>
                <p className="mb-3">{wordings[1]}</p>
                <Icon
                    href={`https://github.com/${githubUsername}`}
                    icon={['fab', 'github']}
                />
                <Icon href={`mailto:${email}`} icon={['far', 'envelope']}/>
                <Information/>
            </div>
        </header>
    );
};

export default Sidebar;

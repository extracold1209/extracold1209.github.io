import React from 'react';
import { Link } from 'gatsby';
import ReactGA from 'react-ga';

import Dropdown from './Dropdown';
import { gotoPage } from '../../../api/url';

import './index.scss';

interface IProps {
    url: string;
    name: string;
    list: { title: string; href: string; }[]
}

const NavItem: React.FC<IProps> = ({ url, name, list = [] }) => {
    if (list.length === 0) {
        return (
            <Link
                className="nav-btn btn btn-link"
                to={url}
                onClick={() => {
                    ReactGA.event({
                        category: 'User',
                        action: `Click nav-menu: ${name}`,
                    });
                    gotoPage(url);
                }}
            >
                {name}
            </Link>
        );
    }

    return <Dropdown title={name} list={list}/>;
};

export default NavItem;

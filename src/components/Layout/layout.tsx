/* eslint-disable react/prop-types */
import React from 'react';

import Transition from '../Transition';
import Navbar from '../Navbar';
import Head from './Head';
import Footer from '../Footer';
import './index.scss';

if (typeof window !== 'undefined') {
  // Make scroll behavior of internal links smooth
  // eslint-disable-next-line global-require
  require('smooth-scroll')('a', { offset: 60 });
}

const Layout: React.FC = ({ children }) => (
    <div className="layout">
        <Head/>
        <Navbar/>
        <Transition location={location}>
            <div className="container-fluid">{children}</div>
        </Transition>
        <Footer/>
    </div>
);

export default Layout;

import React from 'react';
import './toc.scss';

const TableOfContent: React.FC<{ __html: string }> = ({ __html }) => (
    <div className="col-lg-2 col-md-2 d-none d-lg-block order-11 toc-wrap">
        <ul>
            <div dangerouslySetInnerHTML={{ __html }}/>
        </ul>
    </div>
);

export default TableOfContent;

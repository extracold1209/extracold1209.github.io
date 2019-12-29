import React from 'react';
import { Transition as ReactTransition, TransitionGroup } from 'react-transition-group';

const transitionDelay = 100;

const getTransitionStyles: { [key: string]: React.CSSProperties } = {
    entering: {
        position: 'absolute',
        opacity: 0,
    },
    entered: {
        transition: `opacity ${transitionDelay}ms ease-in-out`,
        opacity: 1,
    },
    exiting: {
        transition: `all ${transitionDelay}ms ease-in-out`,
        opacity: 0,
    },
};

const Transition: React.FC = ({ children }) => (
    <TransitionGroup>
        <ReactTransition
            key={location.pathname}
            timeout={
                { enter: transitionDelay, exit: transitionDelay } // duration of transition
            }
        >
            {// Styles depends on the status of page(entering, exiting, entered) in the DOM
                (status) => {
                    const currentStyle = getTransitionStyles[status];
                    return <div style={currentStyle}>{children}</div>
                }}
        </ReactTransition>
    </TransitionGroup>
);

export default Transition;

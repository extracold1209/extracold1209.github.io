import React, { Component } from 'react';
import lozad from 'lozad';

import { isBrowser } from '../../api';

interface IProps {
  post: string;
}

class Content extends Component<IProps> {
  private post: string;

  constructor(props: Readonly<IProps>) {
    super(props);
    const { post } = this.props;
    this.post = post;
  }

  componentDidMount() {
    // lazy loads elements with default selector as '.lozad'
    // Prevent WebPack build fail
    if (isBrowser()) {
      // Initialize library
      const observer = lozad('.lozad', {
        load(el: HTMLImageElement) {
          el.src = el.dataset.src || '';
          el.onload = () => {
            el.classList.add('animated');
            el.classList.add('fadeIn');
          };
          /* eslint-enable */
        },
      });
      observer.observe();
    }
  }

  render() {
    const { post } = this.props;
    return (
      <div
        dangerouslySetInnerHTML={{ __html: post }}
        style={{
          padding: 30,
          background: 'white',
        }}
      />
    );
  }
}

export default Content;

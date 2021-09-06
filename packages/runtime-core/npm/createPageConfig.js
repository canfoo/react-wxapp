import * as React from 'react';
import Container from './container';
import render from './render';

export default function createPageConfig(Page) {
  const config = {
    data: {
      root: {
        children: [],
      }
    },
    onLoad() {
      this.container = new Container(this, 'root');
      const pageElement = React.createElement(Page, {
        page: this,
      });

      this.element = render(pageElement, this.container);
    }
  };

  return config;
}

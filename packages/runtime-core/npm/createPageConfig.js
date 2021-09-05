import * as React from 'react';
import Container from './Container';
import render from './render';

let idCounter = 0;

function generatePageId() {
  const id = idCounter;
  const pageId = 'page_' + id;
  idCounter += 1;
  return pageId;
}

function createPageWrapper(Page) {
  return class PageWrapper extends React.Component {
    // 页面组件的实例
    pageComponentInstance = null;

    callbacks = new Map();

    constructor(props) {
      super(props);

      // Object.keys(Lifecycle).forEach(phase => {
      //   const callback = callbackName(phase);
      //   (this)[callback] = (...args) => {
      //     return this.callLifecycle(phase, ...args);
      //   };
      // });
    }

    callLifecycle(phase, ...args) {
      const callback = callbackName(phase);
      if (this.pageComponentInstance && typeof this.pageComponentInstance[callback] === 'function') {
        return this.pageComponentInstance[callback](...args);
      }
    }

    render() {
      const props = {
        location: {
          query: this.props.query || {},
        },
      };
      return React.createElement(Page, props)
    }
  };
}

export default function createPageConfig(Page) {
  const config = {
    data: {
      root: {
        children: [],
      }
    },

    lifecycleCallback: {},

    onLoad(query) {
      const PageWrapper = createPageWrapper(Page);
      this.pageId = generatePageId();

      this.lifecycleCallback = {};

      this.query = query;
      this.container = new Container(this, 'root');
      const pageElement = React.createElement(PageWrapper, {
        page: this,
        query,
      });

      this.element = render(pageElement, this.container);
    }
  };


  return config;
}

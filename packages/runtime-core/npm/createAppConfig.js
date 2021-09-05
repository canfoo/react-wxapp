import * as React from 'react';
import render from './render';
import AppContainer from './AppContainer';

export default function createAppConfig(App) {
  const createConfig = (AppComponent) => {
    const config = {
      _container: new AppContainer(),

      _pages: [],

      _instance,

      onLaunch(options) {
        this._container.context = this;

        this._render();

      },

      _mount(pageInstance) {
        /**
         * 飞书开发者工具的问题，这里的 this 跟 getApp 拿到的不是同一个实例
         */
        if (!this._container.context) {
          this._container.context = this;
        }
        this._pages.push(pageInstance);
        this._render();
      },

      _unmount(pageInstance) {
        this._pages.splice(this._pages.indexOf(pageInstance), 1);
        this._render();
      },

      _render() {
        const props = {};
        return render(
          React.createElement(
            AppComponent,
            props,
            this._pages.map((p) => p.element)
          ),
          this._container
        );
      },

    };



    return config;
  };

  return createConfig(App);
}

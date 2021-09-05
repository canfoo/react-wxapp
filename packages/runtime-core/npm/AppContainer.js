import VNode from './VNode';
import { generate } from './util';

export default class AppContainer {
  constructor() {
    this.root = new VNode({
      id: generate(),
      type: 'root',
      container: this,
    });
    this.root.mounted = true;
  }

  requestUpdate(path, start, deleteCount, ...items) {
    // ignore
  }

  applyUpdate() {
    this.context._pages.forEach((page) => {
      page.container.applyUpdate();
      page.modalContainer.applyUpdate();
    });
  }

  createCallback(name, fn) {
    this.context[name] = fn;
  }

  appendChild(child) {
    this.root.appendChild(child);
  }

  removeChild(child) {
    this.root.removeChild(child);
  }

  insertBefore(child, beforeChild) {
    this.root.insertBefore(child, beforeChild);
  }
}

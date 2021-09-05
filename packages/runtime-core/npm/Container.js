import VNode from './VNode';
import { generate } from './util';

export default class Container {
  constructor(context, rootKey = 'root') {
    this.context = context;
    this.updateQueue = []
    this.root = new VNode({
      id: generate(),
      type: 'root',
      container: this,
    });
    this.root.mounted = true;
    this.rootKey = rootKey;
  }

  applyUpdate() {
 

    console.log('this.root', this.root)
    // this.context.setData(updatePayload, () => {
    // });
  }

  clearUpdate() {
    this.stopUpdate = true;
  }

  createCallback(name, fn) {
    // this.context[name] = (...args) => {
    //   return unstable_batchedUpdates(args => {
    //     return fn(...args);
    //   }, args);
    // };
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

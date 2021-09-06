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

  toJson(nodes ,data) {
    const json = data || []
    nodes.forEach(node => {
      const nodeData = {
        type: node.type,
        props: node.props || {},
        text: node.text,
        id: node.id,
        children: []
      }
      if (node.children) {
        this.toJson(node.children, nodeData.children)
      }
      json.push(nodeData)
    })
    return json
  }

  applyUpdate() {
    console.log('this.root', this.root)
    const root = this.toJson([this.root])[0]
    console.log('json', root)
    this.context.setData({ root});
  }

  clearUpdate() {
    this.stopUpdate = true;
  }

  createCallback(name, fn) {
    this.context[name] = fn
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

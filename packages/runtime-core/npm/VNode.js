export default class VNode {
  constructor({ id, type, props, container }) {
    this.id = id;
    this.container = container;
    this.type = type;
    this.props = props;
  }

  appendChild(node) {
    this.removeChild(node);

    node.parent = this;
    node.deleted = false; // 交换节点时删除的节点会被复用

    if (!this.firstChild) {
      this.firstChild = node;
    }

    if (this.lastChild) {
      this.lastChild.nextSibling = node;
      node.previousSibling = this.lastChild;
    }

    this.lastChild = node;
  }

  removeChild(node) {
    const { previousSibling, nextSibling } = node;

    if (node.parent !== this) {
      return;
    }

    if (this.firstChild === node) {
      this.firstChild = node.nextSibling;
    }

    if (this.lastChild === node) {
      this.lastChild = node.previousSibling;
    }

    if (previousSibling) {
      previousSibling.nextSibling = nextSibling;
    }

    if (nextSibling) {
      nextSibling.previousSibling = previousSibling;
    }

    node.previousSibling = null;
    node.nextSibling = null;
    node.deleted = true;
  }

  insertBefore(node, referenceNode) {
    this.removeChild(node);

    node.parent = this;
    node.deleted = false;

    if (referenceNode === this.firstChild) {
      this.firstChild = node;
    }

    if (referenceNode.previousSibling) {
      referenceNode.previousSibling.nextSibling = node;
      node.previousSibling = referenceNode.previousSibling;
    }

    referenceNode.previousSibling = node;
    node.nextSibling = referenceNode;
  }

  update(payload) {
    if (this.type === 'text' || !payload) {

      return;
    }

  }

  isMounted() {
    return this.parent ? this.parent.isMounted() : this.mounted;
  }

  isDeleted() {
    return this.deleted === true ? this.deleted : this.parent?.isDeleted() ?? false;
  }
}

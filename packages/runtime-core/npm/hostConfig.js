import * as scheduler from 'scheduler';
import { TYPE_TEXT } from './constants';
import { generate } from './util';
import VNode from './VNode';

const METHOD = '$REACT_FN'

const {
  unstable_scheduleCallback: scheduleDeferredCallback,
  unstable_cancelCallback: cancelDeferredCallback,
  unstable_shouldYield: shouldYield,
  unstable_now: now,
} = scheduler;


function processProps(newProps, node, id) {
  const props = {};
  for (const propKey of Object.keys(newProps)) {
    if (typeof newProps[propKey] === 'function') {
      const contextKey = `${METHOD}_${id}_${propKey}`;
      node.container.createCallback(contextKey, newProps[propKey]);
      props[propKey] = contextKey;
    } else if (propKey === 'style') {
      props[propKey] = newProps[propKey] || '';
    } else if (propKey === 'children') {
      // pass
    } else {
      props[propKey] = newProps[propKey];
    }
  }

  return props;
}

const rootHostContext = {};
const childHostContext = {};

export default {
  now,

  getPublicInstance: (inst) => {
    return inst;
  },

  getRootHostContext: () => {
    return rootHostContext;
  },

  shouldSetTextContent(type) {
    return type === 'stub-block';
  },

  prepareForCommit: () => {
    return null;
  },

  preparePortalMount: () => {
    // nothing to do
  },

  clearContainer: () => {
    // nothing to do
  },

  resetAfterCommit: (container) => {
    container.applyUpdate();
  },

  getChildHostContext: () => {
    return childHostContext;
  },

  createInstance(type, newProps, container) {
    const id = generate();
    const node = new VNode({
      id,
      type,
      props: {},
      container,
    });
    node.props = processProps(newProps, node, id);

    return node;
  },

  createTextInstance(text, container) {
    const id = generate();
    const node = new VNode({
      id,
      type: TYPE_TEXT,
      props: null,
      container,
    });
    node.text = text;
    return node;
  },

  commitTextUpdate(node, oldText, newText) {
    if (oldText !== newText) {
      node.text = newText;
    }
  },

  prepareUpdate(node, type, lastProps, nextProps) {
    return lastProps
  },

  commitUpdate(node, updatePayload, type, oldProps, newProps) {
    node.props = processProps(newProps, node, node.id);
  },

  appendInitialChild: (parent, child) => {
    parent.appendChild(child);
  },

  appendChild(parent, child) {
    parent.appendChild(child);
  },

  insertBefore(parent, child, beforeChild) {
    parent.insertBefore(child, beforeChild);
  },

  removeChild(parent, child) {
    parent.removeChild(child);
  },

  finalizeInitialChildren: () => {
    return false;
  },

  appendChildToContainer(container, child) {
    container.appendChild(child);
    child.mounted = true;
  },

  insertInContainerBefore(container, child, beforeChild) {
    container.insertBefore(child, beforeChild);
  },

  removeChildFromContainer(container, child) {
    container.removeChild(child);
  },

  hideInstance(instance) {
    const originStyle = instance.props?.style;
    const newStyle = Object.assign({}, originStyle || {}, { display: 'none' });
    instance.props = Object.assign({}, instance.props || {}, { style: newStyle });
  },

  hideTextInstance(instance) {
    instance.text = '';
  },

  unhideInstance(instance, props) {
    instance.props = props;
  },

  unhideTextInstance(instance, text) {
    instance.text = text;
  },

  schedulePassiveEffects: scheduleDeferredCallback,
  cancelPassiveEffects: cancelDeferredCallback,
  shouldYield,
  scheduleDeferredCallback,
  cancelDeferredCallback,

  supportsMutation: true,
};

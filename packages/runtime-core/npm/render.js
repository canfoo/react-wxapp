import ReactReconciler from 'react-reconciler';
import hostConfig from './hostConfig';

export const ReactReconcilerInst = ReactReconciler(hostConfig);

if (process.env.NODE_ENV === 'development') {
  ReactReconcilerInst.injectIntoDevTools({
    bundleType: 1,
    version: '16.13.1',
    rendererPackageName: 'remax',
  });
}

function getPublicRootInstance(container) {
  const containerFiber = container.current;
  if (!containerFiber.child) {
    return null;
  }
  return containerFiber.child.stateNode;
}

export default function render(rootElement, container) {
  if (!container._rootContainer) {
    container._rootContainer = ReactReconcilerInst.createContainer(container, 0, false, null);
  }

  ReactReconcilerInst.updateContainer(rootElement, container._rootContainer, null, () => {
  });

  return getPublicRootInstance(container._rootContainer);
}

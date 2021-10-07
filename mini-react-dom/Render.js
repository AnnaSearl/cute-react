let wipRoot = null;

// element 就是虚拟dom，即 vnode
function render(element, container) {
  wipRoot = {
    type: 'div',
    props: {
      children: [element],
    },
    stateNode: container,
  };

  nextUnitOfWork = wipRoot;
}

function FiberNode(parent = null, type = null, props = null) {
  this.type = type;
  this.props = props;
  this.stateNode = null;
  this.child = null;
  this.sibling = null;
  this.return = parent;
}

function reconcileChildren(fiber, fiberChildren) {
  if (fiberChildren === null || fiberChildren === undefined) {
    return;
  }

  const children = Array.isArray(fiberChildren)
    ? fiberChildren
    : [fiberChildren];

  // 下面的操作就是拼接 fiber 链表
  let prevFiber = null;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    let newFiber = null;
    if (typeof child === 'string' || typeof child === 'number') {
      newFiber = new FiberNode(fiber, 'TEXT_ELEMENT', { nodeValue: child });
    } else {
      newFiber = new FiberNode(fiber, child.type, child.props);
    }

    if (i === 0) {
      fiber.child = newFiber;
    } else {
      prevFiber.sibling = newFiber;
    }

    prevFiber = newFiber;
  }
}

function createDom(workInProgress) {
  const { type, props } = workInProgress;
  const node =
    type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(type);

  for (const key in props) {
    if (Object.hasOwnProperty.call(props, key)) {
      if (key !== 'children') {
        // node.setAttribute(key, props[key]); // 文本节点没有 setAttribute 这个方法，所以不能用
        node[key] = props[key];
      }
    }
  }

  return node;
}

function updateHostComponent(workInProgress) {
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = createDom(workInProgress);
  }
  if (workInProgress.props) {
    reconcileChildren(workInProgress, workInProgress.props.children);
  }
}

function updateFunctionComponent(workInProgress) {
  const { type, props } = workInProgress;
  const children = [type(props)];

  reconcileChildren(workInProgress, children);
}

function updateClassComponent(workInProgress) {
  const { type, props } = workInProgress;
  const instance = new type(props);
  const children = instance.render();

  reconcileChildren(workInProgress, children);
}

let nextUnitOfWork = null;

function performUnitOfWork(workInProgress) {
  // 更新 dom
  if (typeof workInProgress.type === 'function') {
    if (workInProgress.type.prototype.isReactComponent) {
      updateClassComponent(workInProgress);
    } else {
      updateFunctionComponent(workInProgress);
    }
  } else {
    updateHostComponent(workInProgress);
  }

  console.log('workInProgress', workInProgress);

  // return next fiber
  if (workInProgress.child) {
    return workInProgress.child;
  }

  let fiber = workInProgress;
  while (fiber) {
    if (fiber.sibling) {
      return fiber.sibling;
    }
    fiber = fiber.return;
  }
}

function workLoop(deadline) {
  // && deadline.timeRemaining() > 1
  while (nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
}

requestIdleCallback(workLoop);

export default render;

/*
 **
 **
 **
 **
 **
 **
 **
 **
 **
 */

function createNode(vnode) {
  const { type } = vnode;

  let node = null;
  if (typeof type === 'string') {
    node = createNativeNode(vnode);
  } else if (typeof type === 'function') {
    if (type.prototype.isReactComponent) {
      // 类组件
      node = createClassNode(vnode);
    } else {
      // 函数组件
      node = createFunctionNode(vnode);
    }
  } else if (typeof vnode === 'string') {
    node = createNativeTextNode(vnode);
  }

  return node;
}

function createNativeNode(vnode) {
  const { type, props } = vnode;
  const node = document.createElement(type);

  for (const key in props) {
    if (Object.hasOwnProperty.call(props, key)) {
      if (key !== 'children') {
        node.setAttribute(key, props[key]);
      }
    }
  }

  reconcileChildrenNodes(vnode, props.children);

  return node;
}

function createNativeTextNode(vnode) {
  const node = document.createTextNode(vnode);
  return node;
}

function createFunctionNode(vnode) {
  const { type, props } = vnode;
  const virtualNode = type(props);
  const node = createNode(virtualNode);
  return node;
}

function createClassNode(vnode) {
  const { type, props } = vnode;
  const instance = new type(props);
  const virtualNode = instance.render();
  const node = createNode(virtualNode);
  return node;
}

function reconcileChildrenNodes(parent, vchildren) {
  const children = Array.isArray(vchildren) ? vchildren : [vchildren];

  for (const child of children) {
    // vnode --> node
    // parent append node
    if (Array.isArray(child)) {
      for (const item of child) {
        render(item, parent);
      }
    } else {
      render(child, parent);
    }
  }
}

import flatArray from '../Utils';

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

  let children = Array.isArray(fiberChildren) ? fiberChildren : [fiberChildren];

  // 拍平数组，针对 props.children 为数组这种情况
  // <div>
  //   <div></div>
  //   {props.children}
  // </div>
  children = flatArray(children);

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

  // console.log('workInProgress', workInProgress);

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
  // do task
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // commit
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
}

requestIdleCallback(workLoop);

function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

function commitWork(workInProgress) {
  // 递归终止条件
  if (!workInProgress) {
    return;
  }

  // commit self
  // 递归找到最近的含有原生 dom 的 fiber 父节点
  let parentFiber = workInProgress.return;
  while (!parentFiber.stateNode) {
    parentFiber = parentFiber.return;
  }
  const parentNode = parentFiber.stateNode;

  if (workInProgress.stateNode) {
    parentNode.appendChild(workInProgress.stateNode);
  }

  // commit child
  commitWork(workInProgress.child);

  // commit sibling
  commitWork(workInProgress.sibling);
}

export default render;

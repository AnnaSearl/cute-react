import diffFiberNode from './FiberDiff';
import { createDom } from '../mini-react-dom/Dom';
import { flatArray } from '../Utils';

function reconcileChildren(parentFiber, childrenFiber) {
  if (childrenFiber === null || childrenFiber === undefined) {
    return;
  }

  let children = Array.isArray(childrenFiber) ? childrenFiber : [childrenFiber];

  // 拍平数组，针对 props.children 为数组这种情况
  // <div>
  //   <div></div>
  //   {props.children}
  // </div>
  children = flatArray(children);

  let oldChildFiber = parentFiber.alternate && parentFiber.alternate.child;

  // 下面的操作就是拼接 fiber 链表
  let prevFiber = null;
  for (let i = 0; i < children.length || oldChildFiber !== null; i++) {
    const child = children[i];

    const newFiber = diffFiberNode(oldChildFiber, child, parentFiber);

    if (i === 0) {
      parentFiber.child = newFiber;
    } else {
      prevFiber.sibling = newFiber;
    }

    if (oldChildFiber) {
      oldChildFiber = oldChildFiber.sibling;
    }
    prevFiber = newFiber;
  }
}

function updateHostComponent(workInProgress) {
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = createDom(workInProgress);
  }
  if (workInProgress.props) {
    reconcileChildren(workInProgress, workInProgress.props.children);
  }
}

let wipFiber = null;
let hookIndex = null;

function updateFunctionComponent(workInProgress) {
  wipFiber = workInProgress;
  hookIndex = 0;
  wipFiber.hooks = [];

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

function getWorkInProgressFiber() {
  return wipFiber;
}

function getHookIndex() {
  return hookIndex;
}

function setHookIndex(index) {
  hookIndex = index;
}

export {
  updateHostComponent,
  updateFunctionComponent,
  updateClassComponent,
  getWorkInProgressFiber,
  getHookIndex,
  setHookIndex,
};

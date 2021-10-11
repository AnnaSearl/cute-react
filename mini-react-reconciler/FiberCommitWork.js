import { updateDom } from '../cute-react-dom/Dom';

function commitDeletion(fiber, parentNode) {
  if (fiber.stateNode) {
    parentNode.removeChild(fiber.stateNode);
  } else {
    commitDeletion(fiber.child, parentNode);
  }
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
    if (workInProgress.effectTag === 'UPDATE') {
      updateDom(
        workInProgress.stateNode,
        workInProgress.alternate.props,
        workInProgress.props
      );
    }

    if (workInProgress.effectTag === 'PLACEMENT') {
      parentNode.appendChild(workInProgress.stateNode);
    }
  }

  if (workInProgress.effectTag === 'DELETION') {
    commitDeletion(workInProgress, parentNode);
  }

  // commit child
  commitWork(workInProgress.child);

  // commit sibling
  commitWork(workInProgress.sibling);
}

export default commitWork;

import {
  updateHostComponent,
  updateFunctionComponent,
  updateClassComponent,
} from './FiberWork';
import commitWork from './FiberCommitWork';

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

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

let currentRoot = null; // 存储过去的 fiber 树，从而可以将现在的 fiber 树和过去的 fiber 树进行 diff
let wipRoot = null;
let nextUnitOfWork = null;

let deletions = null;

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

function triggerRequestIdle(workInProgress) {
  wipRoot = workInProgress;
  wipRoot.alternate = currentRoot;

  nextUnitOfWork = workInProgress;
  requestIdleCallback(workLoop);

  deletions = [];
}

function getCurrentRoot() {
  return currentRoot;
}

function addDeletion(fiber) {
  deletions.push(fiber);
}

export { triggerRequestIdle, getCurrentRoot, addDeletion };

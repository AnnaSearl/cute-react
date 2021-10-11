import FiberNode from './FiberNode';
import { triggerRequestIdle, getCurrentRoot } from './FiberWorkLoop';
import {
  getWorkInProgressFiber,
  getHookIndex,
  setHookIndex,
} from './FiberWork';

function useState(initialState) {
  const wipFiber = getWorkInProgressFiber();
  const hookIndex = getHookIndex();

  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];

  const hook = {
    state: oldHook ? oldHook.state : initialState,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = typeof action === 'function' ? action(hook.state) : action;
  });

  const setState = (action) => {
    // 1. 加入队列
    hook.queue.push(action);

    // 2. 调度更新
    const currentRoot = getCurrentRoot();
    const wipRoot = new FiberNode(currentRoot.type, currentRoot.props, null);
    wipRoot.stateNode = currentRoot.stateNode;

    triggerRequestIdle(wipRoot); // 这里触发更新
  };

  wipFiber.hooks.push(hook);
  setHookIndex(hookIndex + 1);

  return [hook.state, setState];
}

export { useState };

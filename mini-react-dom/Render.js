import { FiberNode, triggerRequestIdle } from '../mini-react-reconciler';

// element 就是虚拟dom，即 vnode
function render(element, container) {
  const wipRoot = new FiberNode(
    container.nodeName,
    {
      children: [element],
    },
    null
  );
  wipRoot.stateNode = container;

  // 触发 reconciler
  triggerRequestIdle(wipRoot);
}

export default render;

import FiberNode from './FiberNode';
import { addDeletion } from './FiberWorkLoop';

function updateFiberNode(oldFiber, element, parentFiber) {
  const newFiber = new FiberNode(oldFiber.type, element.props, parentFiber);
  newFiber.stateNode = oldFiber.stateNode;
  newFiber.alternate = oldFiber;
  newFiber.effectTag = 'UPDATE';

  return newFiber;
}

function replaceFiberNode(oldFiber, element, parentFiber) {
  let newFiber;

  // delete the oldFiber's node
  if (oldFiber) {
    oldFiber.effectTag = 'DELETION';
    addDeletion(oldFiber);
  }

  // add the newFiber's node
  if (element) {
    newFiber = new FiberNode(element.type, element.props, parentFiber);
    newFiber.effectTag = 'PLACEMENT';
    // 注意：新增的 fiber 节点，alternate 为 null
  }

  return newFiber;
}

function diffFiberNode(oldFiber, element, parentFiber) {
  let ele = element;
  if (typeof element === 'string' || typeof element === 'number') {
    ele = { type: 'TEXT_ELEMENT', props: { nodeValue: element } };
  }

  // 进过上一步对 ele 的赋值，ele 只可能是对象，或者 null，或者 undefined
  // const bothAreNullValue = !oldFiber && !ele; // 不可能出现同时都是空值的状况，因为空值是不会创建fiber节点的，只有可能是其中一个为空值

  const sameType = oldFiber && ele && ele.type === oldFiber.type;

  let newFiber = null;
  if (sameType) {
    newFiber = updateFiberNode(oldFiber, ele, parentFiber);
  }

  if (!sameType) {
    newFiber = replaceFiberNode(oldFiber, ele, parentFiber);
  }

  return newFiber;
}

export default diffFiberNode;

// element 就是虚拟dom，即 vnode
function render(element, container) {
  const node = createNode(element);
  if (Array.isArray(node)) {
    for (const nodeItem of node) {
      container.appendChild(nodeItem);
    }
  } else {
    container.appendChild(node);
  }
}

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
  } else if (Array.isArray(vnode)) {
    node = [];
    for (const vnodeItem of vnode) {
      node.push(createNode(vnodeItem));
    }
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

  reconcileChildren(node, props.children);

  return node;
}

function reconcileChildren(parent, vchildren) {
  const children = Array.isArray(vchildren) ? vchildren : [vchildren];
  for (const child of children) {
    // vnode --> node
    // parent append node
    render(child, parent);
  }
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

export default render;

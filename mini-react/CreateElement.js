function createElement(type, props, ...children) {
  if (typeof type === 'string') {
    // 原生节点
    return createNativeNode(type, props, children);
  } else {
    if (type.prototype.isReactComponent) {
      // 类组件
      const instance = new type({ ...props, children: children });
      return instance.render();
    } else {
      // 函数组件
      return type({ ...props, children: children });
    }
  }
}

function createNativeNode(tagName, attributes, children) {
  let e = document.createElement(tagName);

  for (const key in attributes) {
    if (Object.hasOwnProperty.call(attributes, key)) {
      e.setAttribute(key, attributes[key]);
    }
  }

  insertChildren(children, e);

  return e;
}

function insertChildren(pChildren, parent) {
  for (let child of pChildren) {
    if (typeof child === 'string') {
      child = document.createTextNode(child);
    }

    if (Array.isArray(child)) {
      insertChildren(child, parent);
    } else {
      parent.appendChild(child);
    }
  }
}

export default createElement;

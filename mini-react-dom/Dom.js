function createDom(workInProgress) {
  const { type, props } = workInProgress;
  const node =
    type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(type);

  updateDom(node, {}, props);

  return node;
}

// 是否为事件
function isEvent(key) {
  return key.startsWith('on');
}

// 是否为属性
function isProperty(key) {
  return key !== 'children' && !isEvent(key);
}

// 是否是新属性
// eslint-disable-next-line no-unused-vars
function isNewProperty(nextKey, prevProps) {
  return !(nextKey in prevProps);
}

// 是否是旧属性
function isOldProperty(prevKey, nextProps) {
  return !(prevKey in nextProps);
}

// 属性的值是否改变
function isPropertyValueChanged(prevProps, nextProps, key) {
  return prevProps[key] !== nextProps[key];
}

function updateDom(dom, oldProps, newProps) {
  // 如果是旧的 event，去掉
  // 如果 event 的值改变，去掉
  Object.keys(oldProps)
    .filter(isEvent)
    .filter((key) => {
      return (
        isOldProperty(key, newProps) ||
        isPropertyValueChanged(oldProps, newProps, key)
      );
    })
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, oldProps[name]);
    });

  // 添加新的事件
  Object.keys(newProps)
    .filter(isEvent)
    .filter((key) => {
      // return (
      //   isNewProperty(key, oldProps) ||
      //   isPropertyValueChanged(oldProps, newProps, key)
      // );

      // 不用上面这张写法是因为 isPropertyValueChanged 这个判断已经包含了 isNewProperty 这种情况
      // 如果是新增的事件的话，那么同样 prevProps[key] !== nextProps[key]
      return isPropertyValueChanged(oldProps, newProps, key);
    })
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, newProps[name]);
    });

  // 去除旧属性
  Object.keys(oldProps)
    .filter(isProperty)
    .filter((key) => {
      return isOldProperty(key, newProps);
    })
    .forEach((name) => {
      dom[name] = '';
    });

  // 新增新添加的属性
  Object.keys(newProps)
    .filter(isProperty)
    .filter((key) => {
      return isPropertyValueChanged(oldProps, newProps, key);
    })
    .forEach((name) => {
      // node.setAttribute(key, props[key]); // 文本节点没有 setAttribute 这个方法，所以不能用
      dom[name] = newProps[name];
    });
}

export { createDom, updateDom };

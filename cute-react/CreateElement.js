// 返回虚拟dom，即 vnode
function createElement(type, props, ...children) {
  return {
    type: type,
    props: {
      ...props,
      children: children,
    },
  };
}

export default createElement;

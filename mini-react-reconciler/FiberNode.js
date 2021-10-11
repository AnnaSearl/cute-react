function FiberNode(type = null, props = null, parent = null) {
  this.type = type;
  this.props = props;
  this.stateNode = null;

  this.child = null;
  this.sibling = null;
  this.return = parent;

  this.alternate = null;

  this.hooks = null;
}

export default FiberNode;

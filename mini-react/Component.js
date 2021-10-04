// class Component {
//   constructor(props) {
//     this.props = props;
//   }
// }

function Component(props) {
  this.props = props;
}

Component.prototype.isReactComponent = true;

export default Component;

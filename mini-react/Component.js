// class Component {
//   constructor(props) {
//     this.props = props;
//   }
// }

function Component(props) {
  this.props = props;
}

Component.prototype.isReactComponent = true;

Component.prototype.setState = function (state, callback) {};

export default Component;

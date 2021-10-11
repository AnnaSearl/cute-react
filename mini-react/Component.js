// class Component {
//   constructor(props) {
//     this.props = props;
//   }
// }

function Component(props) {
  this.props = props;
}

Component.prototype.isReactComponent = true;

// eslint-disable-next-line no-unused-vars
Component.prototype.setState = function (state, callback) {};

export default Component;

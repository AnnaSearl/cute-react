/*eslint-disable*/

import { createElement, Component, useState } from './cute-react';
import { render } from './cute-react-dom';

function Header() {
  return (
    <div id="a" class="bbb">
      <div>header</div>
      <div></div>
      <div></div>
    </div>
  );
}

class Body extends Component {
  render() {
    return (
      <div id="c" class="ddd">
        <div>body</div>
      </div>
    );
  }
}

function App(props) {
  const [num, setNum] = useState(10);

  const handleNumber = () => {
    console.log('increase num');
    setNum((c) => c + 1);
  };

  return (
    <div id="a" class="bbb">
      <Header />
      <Body />
      <h1 onClick={handleNumber}>{num}</h1>
      {props.children}
    </div>
  );
}

render(
  <App>
    <div>First</div>
    <div>Second</div>
    <div>Third</div>
  </App>,
  document.body
);

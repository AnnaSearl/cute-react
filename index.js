import { createElement } from './mini-react';
import { render } from './mini-react-dom';

function Header() {
  return (
    <div id="a" class="bbb">
      <div>header</div>
      <div></div>
      <div></div>
    </div>
  );
}

function Body() {
  return (
    <div id="c" class="ddd">
      <div>body</div>
      <div></div>
      <div></div>
    </div>
  );
}

function App(props) {
  return (
    <div id="a" class="bbb">
      <div>abc11</div>
      <Header />
      <div>dddddd</div>
      <Body />
      <div></div>
      {props.children}
    </div>
  );
}

render(
  <App>
    <div>aaaassss</div>
  </App>,
  document.body
);

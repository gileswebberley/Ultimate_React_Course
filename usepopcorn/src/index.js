import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
import StarRating from './StarRating';
import TextExpanderApp from './textExpander';

const root = ReactDOM.createRoot(document.getElementById('root'));
function testRating(rating) {
  console.log(rating);
}
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating maxRating={10} colour="#ff0000" size={24} />
    <StarRating maxRating={5} onSetRating={testRating} />
    <TextExpanderApp />
  </React.StrictMode>
);

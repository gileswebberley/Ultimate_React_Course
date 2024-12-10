import React from 'react';
import ReactDOM from 'react-dom/client';
//Now we will tie together the redux with the react using the react-redux package
import { Provider } from 'react-redux';
import './index.css';
import App from './App';

//make our redux store available throughout
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Now we wrap the App in the redux Provider and pass our store to it, now the two are connected */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

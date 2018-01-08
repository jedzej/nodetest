import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import './styles/normalize.css';
import './styles/skeleton.css';
import './containers/index.css';
import './styles/app.css';
import App from './containers/App';
import store from "./store";

import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();

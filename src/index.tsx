import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorker from './serviceWorker';
import {App} from "app/App";
import {Provider} from "react-redux";
import {store} from "app/store";
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
export {useAppDispatch} from "utils/redux-utils";
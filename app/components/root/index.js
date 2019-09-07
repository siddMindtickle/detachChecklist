import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
// import { ConnectedRouter } from "react-router-redux";
import createHistory from "history/createBrowserHistory";

import configureStore from "@core/store";

import Application from "@components/application";

const history = createHistory();

const initialState = {};
const store = configureStore(initialState, history);

const Root = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Application />
      </Router>
    </Provider>
  );
};

export default Root;

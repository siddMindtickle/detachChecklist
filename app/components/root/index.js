import React from "react";
//import { Provider } from "react-redux";
//import { Router } from "react-router-dom";
// import { ConnectedRouter } from "react-router-redux";
import UserAuthProvider from "mt-ui-core/containers/UserAuthProvider";
//import createHistory from "history/createBrowserHistory";

//import configureStore from "@core/store";

import Application from "@components/App";

//const history = createHistory();

//const initialState = {};
//const store = configureStore(initialState, history);

const Root = () => {
  return (
    <UserAuthProvider>
      <Application />
    </UserAuthProvider>
  );
};

export default Root;

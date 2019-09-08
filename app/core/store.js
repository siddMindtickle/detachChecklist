import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware } from "react-router-redux";

import { getGlobalReducers } from "./reducer";

import loggerMiddleware from "./middlewares/logger";

//import mixpanelSaga from "./sagas/mixpanel";

export default (initialState, history) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware, routerMiddleware(history), loggerMiddleware];

  const enhancers = [];

  let composeEnhancers = compose;

  const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  if (typeof composeWithDevToolsExtension === "function") {
    composeEnhancers = composeWithDevToolsExtension;
  }

  const { globalReducer, globalReducerList } = getGlobalReducers();

  const store = createStore(
    globalReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares), ...enhancers)
  );

  store.runSaga = sagaMiddleware.run;

  store.injectedReducers = {};
  store.injectedSagas = {};
  store.globalReducers = { ...globalReducerList };

  // store.runSaga(mixpanelSaga);

  if (module.hot) {
    module.hot.accept("./reducer", () => {
      const reducers = require("./reducer").default;
      store.replaceReducer(reducers(store.injectedReducers));
    });
  }
  window.store = store;
  return store;
};

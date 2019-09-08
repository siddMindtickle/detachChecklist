import { combineReducers } from "redux";

const injectReducer = (store, { name, reducer }) => {
  if (Object.hasOwnProperty.call(store.injectedReducers, name)) return;

  store.injectedReducers[name] = reducer;
  store.replaceReducer(combineReducers({ ...store.globalReducers, ...store.injectedReducers }));
};

export const ejectReducer = (store, { name }) => {
  if (Object.hasOwnProperty.call(store.injectedReducers, name)) {
    delete store.injectedReducers[name];
    store.replaceReducer(combineReducers({ ...store.globalReducers, ...store.injectedReducers }));
  }
};

export const injectMultipleReducer = (store, reducers = []) => {
  for (let { name, reducer } of reducers) {
    if (!Object.hasOwnProperty.call(store.injectedReducers, name)) {
      injectReducer(store, { name, reducer });
    }
  }
};

export default injectReducer;

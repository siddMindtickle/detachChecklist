import { combineReducers } from "redux";
import routeReducer from "./reducers/route";

export const getGlobalReducers = () => {
  const reducers = {
    route: routeReducer
  };
  return {
    globalReducer: combineReducers(reducers),
    globalReducerList: reducers
  };
};

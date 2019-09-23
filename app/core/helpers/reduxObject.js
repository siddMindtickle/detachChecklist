import CreateReducer from "./createReducers_learner";
import { getActionObjects } from "./createActions_learner";

class ReduxObject extends CreateReducer {
  constructor(actionTypes, options, customError) {
    super(actionTypes, options, customError);
    this.actions = getActionObjects(actionTypes);
  }
}

// window.ReduxObject = ReduxObject;

export * from "./createActions_learner";
export * from "./createReducers_learner";
export default ReduxObject;

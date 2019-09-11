import { combineReducers } from "redux";

import buildReducer from "./buildReducer";
import moduleDetailReducer from "./moduleDetailReducer";
import trackReducer from "./trackReducer";
import mixpanelReducer from "./mixpanelReducer";

export default combineReducers({
  build: buildReducer,
  details: moduleDetailReducer,
  track: trackReducer,
  mixpanel: mixpanelReducer
});

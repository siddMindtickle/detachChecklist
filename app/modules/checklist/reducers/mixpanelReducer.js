import { createReducers } from "@core/helpers";

import { MIXPANEL } from "../actionTypes";

const mixpanelReducer = createReducers(MIXPANEL);

export default mixpanelReducer;

import { createReducers } from "@core/helpers";
import { deepmerge } from "@utils";

import { LOAD_DATA, UPDATE_RULES, FETCH_RULE, MANIPULATE_DATA, UPDATE_STATUS } from "./actionTypes";

const dontMerge = (destination, source) => source;
const processRules = (state = {}, { payload }) =>
  deepmerge(state, payload, { arrayMerge: dontMerge });

const rulesReducer = createReducers([
  {
    name: LOAD_DATA,
    options: {
      async: true
    }
  },
  {
    name: UPDATE_RULES,
    options: {
      key: "rules",
      processor: processRules
    }
  },
  {
    name: FETCH_RULE,
    options: {
      key: "ruleStatus",
      async: true
    }
  },
  {
    name: MANIPULATE_DATA,
    options: {
      async: true,
      key: "operationStatus"
    }
  },
  {
    name: UPDATE_STATUS,
    options: {
      key: "status"
    }
  }
]);

export default rulesReducer;

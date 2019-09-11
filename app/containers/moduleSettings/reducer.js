import { createReducers } from "@core/helpers";

import {
  GET_SETTINGS,
  MANIPULATE_SETTINGS,
  UPDATE_SETTINGS,
  RESET_SETTINGS,
  SET_CONTEXT
} from "./actionTypes";

const settingReducer = createReducers(
  [
    {
      name: GET_SETTINGS,
      options: {
        async: true
      }
    },
    {
      MANIPULATE_SETTINGS,
      options: {
        key: "operationStatus",
        async: true
      }
    },
    {
      name: UPDATE_SETTINGS,
      options: {
        key: "settings"
      }
    },
    {
      name: SET_CONTEXT,
      options: {
        key: "context"
      }
    }
  ],
  {
    resetActionType: RESET_SETTINGS
  }
);

export default settingReducer;

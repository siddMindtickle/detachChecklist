import { createReducers } from "@core/helpers";

import {
  GET_PUBLISH_HISTORY,
  RESET_PUBLISH_HISTORY,
  UPDATE_PUBLISH_SUMMARY,
  MANIPULATE_DATA,
  SET_CONTEXT
} from "./actionTypes";

const reducer = createReducers(
  [
    {
      name: GET_PUBLISH_HISTORY,
      options: {
        async: true,
        key: "history"
      }
    },
    {
      name: UPDATE_PUBLISH_SUMMARY,
      options: {
        key: "summary"
      }
    },
    {
      name: MANIPULATE_DATA,
      options: {
        key: "operationStatus",
        async: true
      }
    },
    {
      name: SET_CONTEXT,
      options: {
        key: "context"
      }
    }
  ],
  { resetActionType: RESET_PUBLISH_HISTORY }
);

export default reducer;

import { createReducers } from "@core/helpers";

import {
  GET_CHECKLIST_DATA,
  UPDATE_UNPUBLISHED_CHANGES_FLAG,
  MANIPULATE_CHECKLIST_DATA,
  UPDATE_STATIC,
  UPDATE_SERIES
} from "../actionTypes";

const moduleDetailReducer = createReducers([
  {
    name: GET_CHECKLIST_DATA,
    options: {
      async: true
    }
  },
  {
    name: UPDATE_STATIC,
    options: {
      key: "staticData"
    }
  },
  {
    name: UPDATE_SERIES,
    options: {
      key: "series"
    }
  },
  {
    name: MANIPULATE_CHECKLIST_DATA,
    options: {
      key: "operationStatus",
      async: true
    }
  },
  {
    name: UPDATE_UNPUBLISHED_CHANGES_FLAG,
    options: {
      key: "unpublishedChanges"
    }
  }
]);

export default moduleDetailReducer;

import { createReducers } from "@core/helpers";

import {
  GET_CHECKLIST_BUILD_DATA,
  MANIPULATE_BUILD_DATA,
  RESET_BUILD_DATA,
  UPDATE_SECTIONS,
  UPDATE_LEVELS,
  UPDATE_TASKS
} from "../actionTypes";

const buildReducer = createReducers(
  [
    {
      name: GET_CHECKLIST_BUILD_DATA,
      options: {
        async: true
      }
    },
    {
      name: UPDATE_LEVELS,
      options: {
        key: "levels"
      }
    },
    {
      name: UPDATE_SECTIONS,
      options: {
        key: "sections"
      }
    },
    {
      name: UPDATE_TASKS,
      options: {
        key: "tasks"
      }
    },
    {
      name: MANIPULATE_BUILD_DATA,
      options: {
        key: "operationStatus",
        async: true
      }
    }
  ],
  { resetActionType: RESET_BUILD_DATA }
);

export default buildReducer;

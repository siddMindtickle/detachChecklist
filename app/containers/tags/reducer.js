import { createReducers } from "@core/helpers";

import {
  GET_APPLIED_TAGS,
  UPDATE_APPLIED_TAGS,
  UPDATE_SEARCH_TAGS,
  UPDATE_CATEGORIES,
  UPDATE_TAGS,
  MANIPULATE_DATA,
  GET_SUGGESTED_TAGS
} from "./actionTypes";

const reducer = createReducers([
  {
    name: GET_APPLIED_TAGS,
    options: { async: true }
  },
  {
    name: UPDATE_TAGS,
    options: { key: "tags" }
  },
  {
    name: UPDATE_CATEGORIES,
    options: { key: "categories" }
  },
  {
    name: UPDATE_APPLIED_TAGS,
    options: { key: "appliedTags" }
  },
  {
    name: UPDATE_SEARCH_TAGS,
    options: { key: "searchedTags" }
  },
  {
    name: MANIPULATE_DATA,
    options: {
      key: "operationStatus",
      async: true
    }
  },
  {
    name: GET_SUGGESTED_TAGS,
    options: {
      key: "suggestedTags",
      async: true
    }
  }
]);

export default reducer;

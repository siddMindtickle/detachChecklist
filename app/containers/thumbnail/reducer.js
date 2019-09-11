import { createReducers } from "@core/helpers";

import { GET_THUMBNAILS, MANIPULATE_DATA, UPDATE_THUMBNAILS } from "./actionTypes";

const reducer = createReducers([
  {
    name: GET_THUMBNAILS,
    options: { async: true }
  },
  {
    name: UPDATE_THUMBNAILS,
    options: { key: "thumbDetails" }
  },
  {
    name: MANIPULATE_DATA,
    options: {
      key: "operationStatus",
      async: true
    }
  }
]);

export default reducer;

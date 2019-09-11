import { createReducers } from "@core/helpers";

import { GET_TODOS, TOGGLE_TODOS } from "./actionTypes";

const reducer = createReducers([
  {
    name: GET_TODOS,
    options: { async: true, merge: false }
  },
  {
    name: TOGGLE_TODOS
  }
]);

export default reducer;

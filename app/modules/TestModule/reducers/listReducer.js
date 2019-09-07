import { createReducers } from "@mt-ui-core/core/helpers";

import { GET_DATA } from "../actionTypes";

const reducer = createReducers([
  {
    name: GET_DATA,
    options: {
      async: true
    }
  }
]);

export default reducer;

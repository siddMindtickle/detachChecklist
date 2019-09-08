import { AUTH, LOGOUT } from "./actionTypes";

import { createReducers } from "@core/helpers";

const authReducer = () => {
  return createReducers([
    {
      name: AUTH,
      options: {
        async: true
      }
    },
    {
      name: LOGOUT,
      options: {
        async: true,
        key: "logout"
      }
    }
  ]);
};

export default authReducer();

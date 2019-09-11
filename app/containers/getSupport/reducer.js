import { TOGGLE_HELP_MODAL, SEND_FEEDBACK } from "./actionTypes";
import { createReducers } from "@core/helpers";

const initialState = {
  showModal: false
};
export default createReducers(
  [
    TOGGLE_HELP_MODAL,
    {
      name: SEND_FEEDBACK,
      options: {
        async: true
      }
    }
  ],
  { initialState }
);

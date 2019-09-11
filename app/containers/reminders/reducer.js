import { createReducers } from "@core/helpers";

import {
  UPDATE_MAIL_TEMPLATE,
  UPDATE_LEARNER_STATUS,
  UPDATE_REMINDERS,
  MANIPULATE_DATA,
  GET_REMINDER_DATA
} from "./actionTypes";

const reducer = createReducers([
  {
    name: GET_REMINDER_DATA,
    options: {
      async: true
    }
  },
  {
    name: UPDATE_MAIL_TEMPLATE,
    options: {
      key: "mailTemplates"
    }
  },
  {
    name: UPDATE_LEARNER_STATUS,
    options: {
      key: "learnerStatus"
    }
  },
  {
    name: UPDATE_REMINDERS,
    options: {
      key: "mailReminders"
    }
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

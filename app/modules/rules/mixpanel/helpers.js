import { OPERATIONS } from "../config/constants";

export const getRuleId = (op, response) => {
  if (op === OPERATIONS.UPDATE_RULE) {
    return Object.keys(response)[0];
  }
  return response.id;
};

export const getRuleStatus = (op, response) => {
  if (op === OPERATIONS.UPDATE_RULE) {
    return Object.values(response)[0].status;
  }
  return response.status;
};

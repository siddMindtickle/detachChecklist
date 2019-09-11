import moment from "moment";
import { ACTIONS_ACCESS_MAP } from "../config/permissions";

export const formatCreatedAt = epoch => {
  const momentObj = moment(epoch);
  return `${momentObj.format("MMM DD, YYYY")}`;
};

export const getAllowedActionsByPermissions = ({ ALLOW: allow }) => {
  return Object.keys(ACTIONS_ACCESS_MAP).reduce((allowedActions, action) => {
    const accessMap = ACTIONS_ACCESS_MAP[action] || [];
    allowedActions[action] = accessMap
      ? ACTIONS_ACCESS_MAP[action].some(actionPerm => allow.includes(actionPerm))
      : true;
    return allowedActions;
  }, {});
};

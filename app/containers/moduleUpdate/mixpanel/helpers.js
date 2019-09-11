import { UPDATE_OPTION } from "@mixpanel/enums";

export const getUpdateOption = (op, res) => {
  return UPDATE_OPTION[res.inviteLearner];
};

export const getMailOption = (op, res) => {
  return res.notify;
};

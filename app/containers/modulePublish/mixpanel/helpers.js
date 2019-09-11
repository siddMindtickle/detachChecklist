import { INVITE_TYPE } from "@mixpanel/enums";

export const getSendMail = (op, postData = {}) => {
  return postData.notify ? "Yes" : "No";
};

export const getInviteType = (op, postData = {}) => {
  return INVITE_TYPE[postData.type];
};

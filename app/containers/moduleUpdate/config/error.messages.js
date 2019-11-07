import { Defaults } from "@config/env.config";

export const ERROR_CODES = {
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  PUBLISH_IN_PROGRESS: "PUBLISH_IN_PROGRESS"
};

const ERROR_MESSAGES = {
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: "Some Error Occurred",
  [ERROR_CODES.PUBLISH_IN_PROGRESS]: "Other publish is in progress. Please try again later."
};

const GET_ERROR_MESSAGES = ({ errorCode }) => {
  return ERROR_MESSAGES[ERROR_CODES[errorCode]] || Defaults.errorMessage;
};

export default GET_ERROR_MESSAGES;

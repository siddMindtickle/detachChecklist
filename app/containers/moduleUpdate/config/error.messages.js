import { Defaults } from "@config/env.config";

export const ERROR_CODES = {
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR"
};

const ERROR_MESSAGES = {
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: "Some Error Occurred"
};

const GET_ERROR_MESSAGES = ({ errorCode }) => {
  return ERROR_MESSAGES[ERROR_CODES[errorCode]] || Defaults.errorMessage;
};

export default GET_ERROR_MESSAGES;

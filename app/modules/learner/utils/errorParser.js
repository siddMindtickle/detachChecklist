import { ErrorApiCodes } from "@config/error.codes";
import { reload } from "@utils";
import Routes from "@config/base.routes";

const errorParser = ({ errorCode }, { intl }) => {
  const parsedError = {
    message: "",
    options: {
      okBtnText: intl.formatMessage({ id: "BTN_RELOAD" }),
      callback: () => location.reload()
    }
  };
  switch (errorCode) {
    case ErrorApiCodes.INTERNAL_SERVER_ERROR:
      parsedError.message = intl.formatMessage({ id: "HM_MSG_SERVER_ERR" });
      parsedError.options.okBtnText = intl.formatMessage({
        id: "GOTO_DASHBOARD"
      });
      parsedError.options.callback = () => {
        reload(Routes.base);
      };
      break;
    case ErrorApiCodes.ENTITY_LEARNER_UPGRADED:
      parsedError.message = intl.formatMessage({
        id: "RM_CHECKLIST_UPGRADED_MESSAGE"
      });
      break;
    case ErrorApiCodes.ENTITY_LEARNER_EXPIRED:
      parsedError.message = intl.formatMessage({
        id: "RM_CHECKLIST_EXPIRED_ENTITY"
      });
      break;
    case ErrorApiCodes.ENTITY_RESET:
      parsedError.message = intl.formatMessage({
        id: "RM_CHECKLIST_ENTITY_RESET"
      });
      break;
    case ErrorApiCodes.INVALID_AUTHENTICATION:
      parsedError.message = intl.formatMessage({ id: "RM_ENTITY_NOT_FOUND" });
      parsedError.options.okBtnText = intl.formatMessage({
        id: "GOTO_DASHBOARD"
      });
      parsedError.options.callback = () => {
        reload(Routes.base);
      };
  }
  return parsedError;
};

export default errorParser;

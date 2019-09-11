import { post } from "@utils/apiUtils";
import ApiUrls from "../config/api.config";
import QueryString from "query-string";
const FeedbackService = {};

FeedbackService.postFeedback = ({
  fieldsInfo,
  email,
  currentUrl,
  browserStatus,
  html,
  styles,
  script,
  appState
}) => {
  let body = {
    log_msg: browserStatus,
    url: currentUrl,
    msg: fieldsInfo,
    main: html,
    user: email,
    style: styles,
    script: script,
    appStateObj: JSON.stringify(appState)
  };
  return post(ApiUrls.postFeedback(), {
    body: QueryString.stringify(body),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export default FeedbackService;

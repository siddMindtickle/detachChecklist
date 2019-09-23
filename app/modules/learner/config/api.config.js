import { processQueryString } from "@utils/apiUtils";
const apiUrls = {
  initData() {
    return {
      url: "/wapi/module/:moduleId/info",
      mock: "checklistInitData"
    };
  },
  reportCard() {
    return {
      url: "/reportcard/:moduleId/:userId",
      mock: "checklistReportcard"
    };
  },
  getTaskDetails() {
    return {
      url: "/entity/:moduleId/:taskId",
      mock: "loData"
    };
  }
};

export default processQueryString(apiUrls);

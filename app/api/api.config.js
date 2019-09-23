import { processQueryString } from "@utils/apiUtils";
const apiUrls = {
  startEntity() {
    return {
      url: "/entity/:moduleId/start",
      mock: "checklistInitEntity"
    };
  },
  updateEntity() {
    return {
      url: "/wapi/entity/:entityId/:loId",
      mock: "checklistUpdateEntity"
    };
  }
};

export default processQueryString(apiUrls);

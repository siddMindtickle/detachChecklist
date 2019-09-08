import { handleQueryStringForApi } from "@utils";
let apiUrls = {
  getDetails({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/static`,
      mock: "getStatic",
      mockType: "success"
    };
  },
  modifyDetails({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/static`,
      mock: "updateDetails",
      mockType: "success"
    };
  },
  getMaxScore({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/data`,
      mock: "maxScore",
      mockType: "success"
    };
  },
  discard({ moduleId, companyId }) {
    return {
      url: `/${companyId}/${moduleId}/deleteDraft`,
      mock: "discard",
      mockType: "success"
    };
  },
  archive({ moduleId, companyId }) {
    return {
      url: `/${companyId}/${moduleId}/archive`,
      mock: "archive",
      mockType: "success"
    };
  }
};

export default handleQueryStringForApi(apiUrls);

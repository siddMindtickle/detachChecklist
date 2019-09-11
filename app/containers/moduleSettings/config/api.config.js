import { handleQueryStringForApi } from "@utils";
let apiUrls = {
  getSettings({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/settings`,
      mock: "getSettings",
      mockType: "success"
    };
  },
  modifySettings({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/settings`,
      mock: "updateSettings",
      mockType: "success"
    };
  }
};

export default handleQueryStringForApi(apiUrls);

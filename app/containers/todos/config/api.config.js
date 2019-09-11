import { handleQueryStringForApi } from "@utils";
let apiUrls = {
  getTodos({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/todos`,
      mock: "getTodos",
      mockType: "success"
    };
  }
};

export default handleQueryStringForApi(apiUrls);

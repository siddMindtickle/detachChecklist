import { handleQueryStringForApi } from "@utils";
let apiUrls = {
  getThumbnails({ companyId }) {
    return {
      url: `/${companyId}/media/images`,
      mock: "getThumbnails",
      mockType: "success"
    };
  },
  removeThumbnail({ companyId, thumbId }) {
    return {
      url: `/${companyId}/media/${thumbId}/hide`
    };
  },
  renameThumbnail({ companyId, thumbId }) {
    return {
      url: `/${companyId}/media/${thumbId}`
    };
  }
};

export default handleQueryStringForApi(apiUrls);

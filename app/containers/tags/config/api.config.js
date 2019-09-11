import { handleQueryStringForApi } from "@utils";
let apiUrls = {
  getAppliedTags({ moduleId, companyId }) {
    return {
      url: `/${companyId}/${moduleId}/tags`,
      mock: "getAppliedTags",
      mockType: "success"
    };
  },
  getTags({ companyId }) {
    return {
      url: `/${companyId}/categories/tags`,
      mock: "getAppliedTags",
      mockType: "success"
    };
  },
  createTag({ companyId, categoryId }) {
    return {
      url: `/${companyId}/categories/${categoryId}/tag`
    };
  },
  removeTag({ companyId, moduleId }) {
    return {
      url: `/${companyId}/${moduleId}/tags`
    };
  },
  applyTags({ companyId, moduleId }) {
    return {
      url: `/${companyId}/${moduleId}/tags`
    };
  },
  getSuggestedTags({ companyId }) {
    return {
      url: `/${companyId}/tags/suggest`
    };
  }
};

export default handleQueryStringForApi(apiUrls);

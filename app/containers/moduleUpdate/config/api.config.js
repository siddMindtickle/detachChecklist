import { handleQueryStringForApi } from "@utils";
let apiUrls = {
  getHistory({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/publish_history`,
      mock: "publishHistory",
      mockType: "success"
    };
  },
  getSummary({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/publish_summary`,
      mock: "publishSummary",
      mockType: "success"
    };
  },
  discardChanges({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/discard_unpublished_changes`,
      mock: "discardUnpublished",
      mockType: "success"
    };
  },
  getInvitedLearnerCounts({ companyId }) {
    return {
      url: `/${companyId}/learners/module_states`
    };
  },
  publishChanges({ companyId, moduleId }) {
    return {
      url: `/${companyId}/${moduleId}/publish`
    };
  },
  getTodos({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/todos`,
      mock: "getTodos",
      mockType: "success"
    };
  }
};

export default handleQueryStringForApi(apiUrls);

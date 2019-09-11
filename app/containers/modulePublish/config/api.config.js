import { handleQueryStringForApi } from "@utils";

let apiUrls = {
  getInvitedLearnersCount({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/inviteTypeAggs`,
      mock: "getInvitedLearnersCount",
      mockType: "success"
    };
  },
  getTodos({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/todos`,
      mock: "getTodos",
      mockType: "success"
    };
  },
  getLearners({ companyId }) {
    return {
      url: `/${companyId}/learners/search`,
      mock: "getFullLearners",
      mockType: "success"
    };
  },
  getSelectedLearners({ companyId, seriesId }) {
    return {
      url: `/${companyId}/series/${seriesId}/learners`,
      mock: "getFullLearners",
      mockType: "success"
    };
  },
  getGroups({ companyId }) {
    return {
      url: `/${companyId}/learners/groups`,
      mock: "getGroups",
      mockType: "success"
    };
  },
  getProfileFields({ companyId }) {
    return {
      url: `/${companyId}/profile_fields`,
      mock: "getProfileFields",
      mockType: "success"
    };
  },
  getProfileKeyData({ companyId }) {
    return {
      url: `/${companyId}/analytics/getProfileKeyData`,
      mock: "getProfileKeyData",
      mockType: "success"
    };
  },
  publishData({ companyId, moduleId }) {
    return {
      url: `/${companyId}/${moduleId}/publish`,
      mock: "publishData",
      mockType: "success"
    };
  }
};

export default handleQueryStringForApi(apiUrls);

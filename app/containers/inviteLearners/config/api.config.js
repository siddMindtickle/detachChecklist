import { handleQueryStringForApi } from "@utils";
let apiUrls = {
  getLearners({ companyId }) {
    return {
      url: `/${companyId}/learners/search`,
      mock: "getLearners",
      mockType: "success"
    };
  },
  checkExistingLearner({ companyId }) {
    return {
      url: `/${companyId}/learners/exists`,
      mock: "checkExistingLearner",
      mockType: "success"
    };
  },
  addToPlatform({ companyId }) {
    return {
      url: `/${companyId}/learners/addToPlatform`,
      mock: "addToPlatform",
      mockType: "success"
    };
  },
  pollStatus({ companyId, processId }) {
    return {
      url: `/${companyId}/poll-process-status/${processId}`,
      mock: "pollProcessStatus",
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
  getManagerFields({ companyId }) {
    return {
      url: `/${companyId}/manager_fields`,
      mock: "managerFields",
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
  inviteAll({ companyId, moduleId }) {
    return {
      url: `/${companyId}/${moduleId}/learners/invite_all_matching_to_module`,
      mock: "inviteAll",
      mockType: "success"
    };
  },
  inviteAllToSeries({ companyId }) {
    return {
      url: `/${companyId}/learners/invite_all_matching_to_series`,
      mock: "inviteAllToSeries",
      mockType: "success"
    };
  },
  getProfileKeyData({ companyId }) {
    return {
      url: `/${companyId}/analytics/getProfileKeyData`,
      mock: "getProfileKeyData",
      mockType: "success"
    };
  }
};

export default handleQueryStringForApi(apiUrls);

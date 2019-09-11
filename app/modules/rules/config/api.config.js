import { handleQueryStringForApi } from "@utils";
const apiUrls = {
  fetchRulesStatus({ companyId }) {
    return {
      url: `/automation-rules/v1/company/${companyId}/rules/main-switch`,
      mock: "getRulesStatus",
      mockType: "success"
    };
  },
  fetchRules({ companyId }) {
    return {
      url: `/automation-rules/v1/company/${companyId}/rules`,
      mock: "getRules",
      mockType: "success"
    };
  },
  fetchRule({ ruleId, companyId }) {
    return {
      url: `/automation-rules/v1/company/${companyId}/rules/${ruleId}`,
      mock: "getRule",
      mockType: "success"
    };
  },
  updateRule({ ruleId, companyId }) {
    return {
      url: `/automation-rules/v1/company/${companyId}/rules/${ruleId}`,
      mock: "updateRule",
      mockType: "success"
    };
  },
  changeRulesStatus({ companyId }) {
    return {
      url: `/automation-rules/v1/company/${companyId}/rules/main-switch`,
      mock: "changeRulesStatus",
      mockType: "success"
    };
  }
};

export default handleQueryStringForApi(apiUrls);

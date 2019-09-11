import { handleQueryStringForApi } from "@utils";
let apiUrls = {
  getMailTemplates({ companyId }) {
    return {
      url: `/${companyId}/mail/templates`,
      mock: "reminderTemplates",
      mockType: "success"
    };
  },
  getReminderAutomations({ moduleId, companyId }) {
    return {
      url: `/${companyId}/mail/automation/${moduleId}`,
      mock: "reminderAutomation",
      mockType: "success"
    };
  },
  operateReminders({ moduleId, companyId }) {
    return {
      url: `/${companyId}/mail/automation/${moduleId}`,
      mock: "reminderAutomationUpdate",
      mockType: "success"
    };
  }
};

export default handleQueryStringForApi(apiUrls);

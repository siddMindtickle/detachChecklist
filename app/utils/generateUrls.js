import { MT_MODULES } from "@config/global.config";

const typeUrlMap = {
  [MT_MODULES.CHECKLIST]: "ui/checklist",
  [MT_MODULES.ILT]: "ui/ilt",
  AUTOMATION_RULES: "ui/rules",
  PROFILE_FIELD_MANAGEMENT: "ui/profile-management",
  ANALYTICS: "betaanalytics",
  ACCOUNT_SETTING: "account_settings",
  SWITCH_LS: "choose",
  PROFILE: "profile",
  MANAGE_TAGS: "ui/tags/manage",
  HELP_CENTER: "helpdesk/login"
};

export const ACCESS_LINK_URL = {
  ANALYTICS: "ANALYTICS",
  ACCOUNT_SETTING: "ACCOUNT_SETTING",
  SWITCH_LS: "SWITCH_LS",
  PROFILE: "PROFILE",
  AUTOMATION_RULES: "AUTOMATION_RULES",
  PROFILE_FIELD_MANAGEMENT: "PROFILE_FIELD_MANAGEMENT",
  MANAGE_TAGS: "MANAGE_TAGS",
  HELP_CENTER: "HELP_CENTER"
};

export const getSeriesUrl_learner = seriesId => {
  if (seriesId) {
    return `/#/courses/series/${seriesId}?series=${seriesId}`;
  }
  return null;
};

export const getSeriesUrl = (seriesId, isNewDashboard) => {
  if (!seriesId) return null;

  if (isNewDashboard) return ["ui", "program", seriesId, "modules"].join("/");

  return ["dashboard#series", seriesId, "all"].join("/");
};

export const getModuleUrl = (lsDomain, type, moduleId, seriesId) => {
  const partialUrl = typeUrlMap[type];
  if (lsDomain && partialUrl && moduleId && seriesId) {
    return [`${window.location.protocol}/`, lsDomain, partialUrl, seriesId, moduleId].join("/");
  }
  return;
};

export const getIltSessionUrl = ({ companyUrl, moduleType, moduleId, seriesId }, iltSessionId) => {
  const moduleUrl = getModuleUrl(companyUrl, moduleType, moduleId, seriesId);
  if (moduleUrl && iltSessionId) {
    return [moduleUrl, "session", iltSessionId].join("/");
  }
  return;
};

export const getAnalyticsUrl = (type, moduleId) => {
  const partialUrl = typeUrlMap[type];
  const domain = location.origin;
  if (partialUrl && moduleId) {
    return [domain, partialUrl, "modules", moduleId, "learners"].join("/");
  }
  return null;
};

export const getStaticUrl = type => {
  const partialUrl = typeUrlMap[type];
  const domain = location.origin;
  if (partialUrl) {
    return [domain, partialUrl].join("/");
  }
  return null;
};

export const getDownloadUrl = (cname, param) => {
  const domain = location.origin;
  let url = [domain, cname, "download_sample"].join("/");
  url = `${url}?${param}`;
  return url;
};

export const getUserProfileUrl = userId => {
  const domain = location.origin;
  return [domain, `learners#/${userId}/learnerInsight`].join("/");
};

//import defaultMessages from "@locale/en.json";
export const LIFECYCLE_STAGES = {
  BUILD: "build",
  SETTINGS: "settings",
  PUBLISH: "publish",
  INVITE: "invite"
};
export const Defaults = {
  locale: "en",
  localeName: "English",
  supportEmail: "support@mindtickle.com",
  mindtickleUrl: "www.mindtickle.com",
  mindtickle: "MindTickle",
  mtLoginType: "MINDTICKLE",
  loaderMessage: "",
  errorMessage: "Some Error Occurred",
  //translations: defaultMessages,
  moduleLifeCycle: {
    [LIFECYCLE_STAGES.BUILD]: "Build",
    [LIFECYCLE_STAGES.SETTINGS]: "Settings",
    [LIFECYCLE_STAGES.PUBLISH]: "Publish",
    [LIFECYCLE_STAGES.INVITE]: "Invite & Track"
  },
  helpDeskUrl: "admin.mindtickle.com/helpdesk/login", //TODO url review
  privacy: "Privacy",
  privacyUrl: "www.mindtickle.com/privacy-policy/", //TODO
  knowledgeBase: "KnowledgeBase",
  knowledgeBaseUrl: "help.mindtickle.com/support/home", //TODO
  copyRightMindtickle: "© MindTickle",
  siteOwnerRole: "_default.role.learning_site_owner"
};

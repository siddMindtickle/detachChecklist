import defaultMessages from "@locale_learner/en.json";
export const LIFECYCLE_STAGES = {
  BUILD: "build",
  SETTINGS: "settings",
  PUBLISH: "publish",
  INVITE: "invite"
};

export const Defaults_learner = {
  locale: "en",
  localeName: "English",
  companyBanner:
    "//s3-ap-southeast-1.amazonaws.com/mtapps-cdn.mindtickle.com/mtcdn2/allaboard4.0/images/comp_bg.jpg",
  companyName: "",
  companyTagLine: "Join your colleagues in the amazing learning experience!",
  supportEmail: "support@mindtickle.com",
  mindtickleUrl: "www.mindtickle.com",
  mindtickle: "MindTickle",
  mtLoginType: "MINDTICKLE",
  defaultLoaderMessage: "",
  localeCookieName: "_locale",
  translations: defaultMessages,
  mtWebview: "MTWebView",
  nonHashUrl: ["/nh", "/ui"]
};

export const SupportedSocialLogins = {
  GOOGLE: {
    name: "GOOGLE",
    login: "HM_SIGN_IN_SOCIAL_BTN_TXT",
    signup: "HM_SIGN_UP_SOCIAL_BTN_TXT"
  },
  SALESFORCE: {
    name: "SALESFORCE",
    login: "HM_BTN_SSO_SIGN_IN_SALESFORCE",
    signup: "HM_BTN_SSO_SIGN_UP_SALESFORCE"
  },
  SAML: {
    name: "SAML",
    login: "HM_BTN_SSO_SIGN_IN_COMPANY",
    signup: "HM_BTN_SSO_SIGN_UP_COMPANY"
  },
  SIMPLESSO: {
    name: "SIMPLESSO",
    login: "HM_BTN_SSO_SIGN_IN_COMPANY",
    signup: "HM_BTN_SSO_SIGN_UP_COMPANY"
  },
  OPENID_CONNECT: {
    name: "OPENID_CONNECT",
    login: "HM_BTN_SSO_SIGN_IN_COMPANY",
    signup: "HM_BTN_SSO_SIGN_UP_COMPANY"
  }
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

export const ENTITY_COMPLETION_STATES = {
  ADDED: "ADDED",
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  LOCKED: "LOCKED"
};

export const API_ENTITY_COMPLETION_STATES_MAP = {
  ADDED: ENTITY_COMPLETION_STATES.ADDED,
  NOT_STARTED: ENTITY_COMPLETION_STATES.NOT_STARTED,
  IN_PROGRESS: ENTITY_COMPLETION_STATES.IN_PROGRESS,
  COMPLETED: ENTITY_COMPLETION_STATES.COMPLETED,
  LOCKED: ENTITY_COMPLETION_STATES.LOCKED
};

export const OVERVIEW_ID = "overiew_0"; // just a random id must string

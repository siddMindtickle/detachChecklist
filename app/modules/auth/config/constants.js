export const CONTENT_ACCESS_TABS = {
  CONTENT: "content",
  LEARNERS: "learner",
  ANALYTICS: "analytics",
  REVIEWS: "review"
};
export const CONTENT_ACCESS_TAB_NAME = {
  [CONTENT_ACCESS_TABS.ANALYTICS]: "Analytics",
  [CONTENT_ACCESS_TABS.LEARNERS]: "Learners",
  [CONTENT_ACCESS_TABS.CONTENT]: "Content",
  [CONTENT_ACCESS_TABS.REVIEWS]: "Reviews"
};

export const PROFILE_KEY = {
  PROFILE: "PROFILE",
  SIGN_OUT: "SIGN_OUT"
};

export const BURGER_MENU_KEY = {
  VIEW_LS: "VIEW_LS",
  SETTING: "SETTING",
  SWITCH_LS: "SWITCH_LS",
  VIEW_AR: "VIEW_AR",
  VIEW_PMH: "VIEW_PMH",
  MANAGE_TAGS: "MANAGE_TAGS"
};

export const USER_PROFILE_OPTIONS = [
  {
    text: "My Profile",
    icon: "Profile",
    value: PROFILE_KEY.PROFILE
  },
  {
    text: "Sign Out",
    icon: "sign_out",
    value: PROFILE_KEY.SIGN_OUT
  }
];

export const DROPDOWN_TYPES = {
  HELP: "HELP",
  MENU: "MENU"
};

export const HELP_MENU_KEY = {
  HELP_CENTER: "HELP_CENTER",
  REPORT_ISSUE: "REPORT_ISSUE",
  GUIDE_ME: "GUIDE_ME"
};

export const HELP_MENU_OPTIONS = [
  {
    text: "Help Center",
    value: HELP_MENU_KEY.HELP_CENTER
  },
  {
    text: "Report an Issue",
    value: HELP_MENU_KEY.REPORT_ISSUE
  },
  {
    text: "Guide Me",
    value: HELP_MENU_KEY.GUIDE_ME
  }
];

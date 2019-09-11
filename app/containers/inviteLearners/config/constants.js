export const INVITE_TYPE = {
  ADD_INVITE_NEW: "inviteNew",
  UPLOAD_LIST: "inviteByUpload",
  INVITE_EXISTING: "inviteExisting",
  INVITE_GROUP: "inviteGroup"
};

export const RELEVANCE_SETTING_ENUM = {
  ALL: "ALL",
  GROUP: "GROUP",
  USER: "USER"
};

export const INVITE_TO = {
  MODULE: "module",
  SERIES: "series"
};

export const OPERATIONS = {
  [INVITE_TYPE.ADD_INVITE_NEW]: {
    ADD_TO_LIST: "ADD_TO_LIST",
    ADD_ALL: "ADD_ALL",
    GET_LEARNERS: "GET_NEW_LEARNERS"
  },
  [INVITE_TYPE.UPLOAD_LIST]: {},
  [INVITE_TYPE.INVITE_EXISTING]: {
    SEARCH: "search",
    LOAD_MORE: "load_more",
    UPDATE: "update"
  },
  [INVITE_TYPE.INVITE_GROUP]: {}
};

export const POLL_STATUS = {
  SUCCESS: "SUCCESS"
};

export const INVITE_TYPE_DETAILS = {
  [INVITE_TYPE.ADD_INVITE_NEW]: {
    title: "Add & Invite New"
  },
  [INVITE_TYPE.UPLOAD_LIST]: {
    title: "Upload List"
  },
  [INVITE_TYPE.INVITE_EXISTING]: {
    title: "Invite Existing"
  },
  [INVITE_TYPE.INVITE_GROUP]: {
    title: "Invite Groups"
  }
};

export const INVITE_TO_OPTIONS = moduleType => {
  return {
    [INVITE_TO.SERIES]: "To Series",
    [INVITE_TO.MODULE]: `To ${moduleType} only`
  };
};

export const FILE_HEADER = ["name", "email"];

export const CSV_CONSTANTS = {
  SAMPLE_FILE_NAME: "sample_user_list.csv",
  CONTENT_TYPE: "application/csv",
  BASE_FIELDS: "Name,Email",
  PROFILE: "profile.",
  MANGAERS: "managers.",
  MODULE_RELEVANCE: "moduleRelevance"
};

export const DEFAULT_INPUT_WAIT = 500;
export const PROFILE_FIELDS_DELIMITER = "_#_";
export const INVITE_EXISTING_SORT_ON = "companies.added_on";

export const POLLING_DELAY = 2000;
export const POLLING_STATUS = {
  SUCCESS: 1,
  RUNNING: 0,
  FAILED: -1
};

export const MESSAGES = {
  INVITE_LEARNER: {
    LOADING() {
      return "Inviting Learners...";
    },
    SUCCESS({ successCount, failCount }) {
      if (failCount == 0) {
        return `${successCount} Learner${successCount > 1 ? "s" : ""} invited successfully`;
      } else {
        `${successCount} Learner${
          successCount > 1 ? "s" : ""
        } invited successfully. ${failCount} Learner${
          failCount > 1 ? "s" : ""
        } could not be invited.`;
      }
    },
    ERROR() {
      return `Learners could not be invited from the Module. Please try again later. `;
    }
  }
};

export const RELEVANCE_KEY = {
  ALL: "ALL"
};

export const MODULE_RELEVANCE_DROPDOWN_OPTIONS = [
  { value: "REQ", text: "Required" },
  { value: "OPT", text: "Optional" },
  { value: "NONE", text: "Unmarked" }
];

export const MODULE_RELEVANCE_KEYS = {
  REQUIRED: "REQ",
  OPTIONAL: "OPT",
  UNMARKED: "NONE"
};

export const MODULE_RELEVANCE_VALUES = {
  REQ: "Required",
  OPT: "Optional",
  NONE: "Unmarked"
};

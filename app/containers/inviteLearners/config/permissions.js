import { INVITE_TO, INVITE_TYPE } from "./constants";

export const INVITE_PERMISSIONS = {
  INVITE_TYPE: {
    [INVITE_TYPE.ADD_INVITE_NEW]: {
      allow: ["LEARNER_MANAGEMENT"],
      deny: []
    },
    [INVITE_TYPE.UPLOAD_LIST]: {
      allow: ["LEARNER_MANAGEMENT"],
      deny: []
    },
    [INVITE_TYPE.INVITE_EXISTING]: {
      allow: [],
      deny: []
    },
    [INVITE_TYPE.INVITE_GROUP]: {
      allow: ["CONTENT_SHARING_VIA_GROUP", "GROUP_ADMINISTRATION"],
      deny: []
    }
  },
  INVITE_TO: {
    [INVITE_TO.SERIES]: {
      allow: ["SERIES_MANAGEMENT"],
      deny: []
    },
    [INVITE_TO.MODULE]: {
      allow: ["SERIES_MANAGEMENT", "MODULE_SHARING"],
      deny: []
    }
  }
};

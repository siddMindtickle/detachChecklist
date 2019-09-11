import * as actionTypes from "../actionTypes";
import { INVITE_TO, INVITE_TYPE } from "../config/constants";
import { getLoadingActions } from "@core/helpers";

const MixpanelEvents = {
  [getLoadingActions(actionTypes.MANIPULATE_INVITE).SUCCESS]: {
    [INVITE_TYPE.ADD_INVITE_NEW]: {
      [INVITE_TO.SERIES]: {
        event: "Share Series with Learners",
        data: {
          Location: { value: "Inside Content" },
          Method: { value: "Invite New" }
        }
      },
      [INVITE_TO.MODULE]: {
        event: "Share Content with Learners",
        data: {
          Location: { value: "Inside Content" },
          Method: { value: "Invite New" }
        }
      }
    },
    [INVITE_TYPE.UPLOAD_LIST]: {
      [INVITE_TO.SERIES]: {
        event: "Share Series with Learners",
        data: {
          Location: { value: "Inside Content" },
          Method: { value: "Upload List" }
        }
      },
      [INVITE_TO.MODULE]: {
        event: "Share Content with Learners",
        data: {
          Location: { value: "Inside Content" },
          Method: { value: "Upload List" }
        }
      }
    },
    [INVITE_TYPE.INVITE_EXISTING]: {
      [INVITE_TO.SERIES]: {
        event: "Share Series with Learners",
        data: {
          Location: { value: "Inside Content" },
          Method: { value: "Invite from existing" }
        }
      },
      [INVITE_TO.MODULE]: {
        event: "Share Content with Learners",
        data: {
          Location: { value: "Inside Content" },
          Method: { value: "Invite from existing" }
        }
      }
    },
    [INVITE_TYPE.INVITE_GROUP]: {
      [INVITE_TO.SERIES]: {
        event: "Share Series with Learners",
        data: {
          Location: { value: "Inside Content" },
          Method: { value: "Invite from Group" }
        }
      },
      [INVITE_TO.MODULE]: {
        event: "Share Content with Learners",
        data: {
          Location: { value: "Inside Content" },
          Method: { value: "Invite from Group" }
        }
      }
    }
  }
};

export default MixpanelEvents;

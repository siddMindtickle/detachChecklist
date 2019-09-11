import { createReducers } from "@core/helpers";
import { isUndefined } from "@utils";

import {
  INVITE_POLLING,
  UPDATE_LEARNERS,
  UPDATE_SEARCH_LEARNERS,
  UPDATE_PROFILE_FIELDS,
  UPDATE_MANAGER_FIELDS,
  GET_PROFILE_KEY_DATA,
  UPDATE_GROUPS,
  INITIAL_INVITE_BY_UPLOAD,
  INITIAL_INVITE_EXISTING,
  INITIAL_INVITE_GROUP,
  MANIPULATE_INVITE,
  MANIPULATE_INVITE_NEW,
  MANIPULATE_INVITE_EXISTING,
  SET_CONTEXT
} from "./actionTypes";
import { combineReducers } from "redux";

const processData = (stateData, newData) => {
  if (isUndefined(stateData)) {
    return newData;
  } else if (Array.isArray(stateData) && Array.isArray(newData)) {
    return [...stateData, ...newData];
  }
  return newData;
};

const updateProcessor = (state = {}, { payload, meta: { replace } = {} }) => {
  return {
    ...state,
    ...payload,
    data: replace ? payload.data : processData(state.data, payload.data)
  };
};

const inviteNewReducer = createReducers({
  name: MANIPULATE_INVITE_NEW,
  options: {
    async: true,
    key: "status"
  }
});

const inviteGroupsReducer = createReducers([
  {
    name: INITIAL_INVITE_GROUP,
    options: {
      async: true
    }
  }
]);

const inviteExistingReducer = createReducers([
  {
    name: MANIPULATE_INVITE_EXISTING,
    options: {
      key: "status",
      async: true
    }
  },
  {
    name: INITIAL_INVITE_EXISTING,
    options: {
      async: true
    }
  }
]);

const inviteCommon = createReducers([
  {
    name: UPDATE_LEARNERS,
    options: {
      key: "learners"
    }
  },
  {
    name: UPDATE_SEARCH_LEARNERS,
    options: {
      key: "searchedLearners",
      processor: updateProcessor
    }
  },
  {
    name: UPDATE_PROFILE_FIELDS,
    options: {
      key: "profileFields"
    }
  },
  {
    name: UPDATE_MANAGER_FIELDS,
    options: {
      key: "managerFields"
    }
  },
  {
    name: UPDATE_GROUPS,
    options: {
      key: "groups",
      merge: false
    }
  },
  {
    name: GET_PROFILE_KEY_DATA,
    options: {
      key: "profileKeyData",
      async: true
    }
  },
  {
    name: SET_CONTEXT,
    options: {
      key: "context"
    }
  }
]);

const inviteStatus = createReducers([
  {
    name: MANIPULATE_INVITE,
    options: {
      key: "inviteStatus",
      async: true,
      merge: false
    }
  }
]);

const inviteByUpload = createReducers([
  {
    name: INITIAL_INVITE_BY_UPLOAD,
    options: {
      async: true
    }
  }
]);

const invitePolling = createReducers([
  {
    name: INVITE_POLLING,
    options: {
      async: true
    }
  }
]);

export default combineReducers({
  inviteNew: inviteNewReducer,
  inviteGroups: inviteGroupsReducer,
  inviteExisting: inviteExistingReducer,
  inviteCommon: inviteCommon,
  inviteStatus: inviteStatus,
  inviteByUpload: inviteByUpload,
  invitePolling: invitePolling
});

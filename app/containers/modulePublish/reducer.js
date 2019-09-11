import { createReducers } from "@core/helpers";
import { isUndefined, deepmerge } from "@utils";

import {
  LOAD_DATA,
  GET_PUBLISH_DATA,
  GET_ALL_LEARNERS,
  GET_FULL_LEARNERS,
  GET_SELECTED_LEARNERS,
  UPDATE_LEARNERS,
  UPDATE_GROUPS,
  UPDATE_PROFILE_FIELDS,
  GET_PROFILE_KEY_DATA,
  UPDATE_SEARCH_LEARNERS,
  UPDATE_ALL_LEARNERS,
  UPDATE_FULL_LEARNERS,
  UPDATE_SELECTED_LEARNERS,
  MANIPULATE_PUBLISH_DATA,
  PUBLISH_DATA,
  SET_CONTEXT
} from "./actionTypes";

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

const dontMerge = (destination, source) => source;
const processLearners = (state = {}, { payload }) =>
  deepmerge(state, payload, { arrayMerge: dontMerge });

const publishReducer = createReducers([
  {
    name: GET_PUBLISH_DATA,
    options: {
      async: true
    }
  },
  {
    name: LOAD_DATA,
    options: {
      async: true,
      key: "count"
    }
  },
  {
    name: GET_ALL_LEARNERS,
    options: {
      key: "all",
      async: true
    }
  },
  {
    name: GET_FULL_LEARNERS,
    options: {
      key: "full",
      async: true
    }
  },
  {
    name: GET_SELECTED_LEARNERS,
    options: {
      key: "selected",
      async: true
    }
  },
  {
    name: UPDATE_LEARNERS,
    options: {
      key: "learners",
      processor: processLearners
    }
  },
  {
    name: UPDATE_GROUPS,
    options: {
      key: "groups"
    }
  },
  {
    name: UPDATE_PROFILE_FIELDS,
    options: {
      key: "profileFields"
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
    name: MANIPULATE_PUBLISH_DATA,
    options: {
      key: "operationStatus",
      async: true
    }
  },
  {
    name: UPDATE_SEARCH_LEARNERS,
    options: {
      key: "searchLearners",
      processor: updateProcessor
    }
  },
  {
    name: UPDATE_ALL_LEARNERS,
    options: {
      key: "allLearners",
      processor: updateProcessor
    }
  },
  {
    name: UPDATE_FULL_LEARNERS,
    options: {
      key: "fullLearners",
      processor: updateProcessor
    }
  },
  {
    name: UPDATE_SELECTED_LEARNERS,
    options: {
      key: "selectedLearners",
      processor: updateProcessor
    }
  },
  {
    name: PUBLISH_DATA,
    options: {
      async: true,
      key: "publish"
    }
  },
  {
    name: SET_CONTEXT,
    options: {
      key: "context"
    }
  }
]);

export default publishReducer;

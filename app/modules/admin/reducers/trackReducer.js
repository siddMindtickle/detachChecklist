import { createReducers } from "@core/helpers";

import {
  TRACK_GET_DATA,
  TRACK_POLLING,
  TRACK_MANIPULATE_DATA,
  TRACK_UPDATE_LEARNERS_DETAILS,
  TRACK_UPDATE_SEARCH_LEARNERS,
  TRACK_UPDATE_IN_PROGRESS_LEARNERS,
  TRACK_UPDATE_COMPLETED_LEARNERS,
  TRACK_UPDATE_ADDED_LEARNERS,
  TRACK_UPDATE_ALL_LEARNERS,
  TRACK_UPDATE_GROUPS,
  TRACK_UPDATE_LEARNER_COUNT
} from "../actionTypes";

const trackReducer = createReducers([
  {
    name: TRACK_GET_DATA,
    options: {
      async: true
    }
  },
  {
    name: TRACK_POLLING,
    options: {
      async: true,
      key: "poll"
    }
  },
  {
    name: TRACK_MANIPULATE_DATA,
    options: {
      key: "operationStatus",
      async: true
    }
  },
  {
    name: TRACK_UPDATE_LEARNERS_DETAILS,
    options: {
      key: "learners"
    }
  },
  {
    name: TRACK_UPDATE_SEARCH_LEARNERS,
    options: {
      key: "searchedLearners"
    }
  },
  {
    name: TRACK_UPDATE_IN_PROGRESS_LEARNERS,
    options: {
      key: "inProgress"
    }
  },
  {
    name: TRACK_UPDATE_COMPLETED_LEARNERS,
    options: {
      key: "completed"
    }
  },
  {
    name: TRACK_UPDATE_ADDED_LEARNERS,
    options: {
      key: "added"
    }
  },
  {
    name: TRACK_UPDATE_ALL_LEARNERS,
    options: {
      key: "all"
    }
  },
  {
    name: TRACK_UPDATE_GROUPS,
    options: {
      key: "groups"
    }
  },
  {
    name: TRACK_UPDATE_LEARNER_COUNT,
    options: {
      key: "counts"
    }
  }
]);

export default trackReducer;

export const SUPPORTED_FILTERS = {
  GROUPS: "applyGroups",
  SEARCH: "search",
  LEARNER_TYPE: "learnerStatusType",
  MODULE_RELEVANCE: "moduleRelevance"
};
export const SUPPORTED_SORTINGS = {
  NAME: "name",
  INVITED_ON: "invitenOn",
  SCORE: "score",
  STATUS: "completionStatus",
  MODULE_RELEVANCE: "moduleRelevance"
};
export const LEARNER_TYPES = {
  ALL: "all",
  COMPLETED: "completed",
  IN_PROGRESS: "inProgress",
  ADDED: "added"
};

export const RELEVANCE_TYPE = {
  REQ: "REQ",
  OPT: "OPT",
  NONE: "NONE"
};

export const OPERATIONS = {
  SORT_LEARNERS: "sortLearners",
  SEARCH_LEARNERS: "searchLearners",
  PAGINATE_LEARNERS: "paginateLearners",
  GET_LEARNERS: "getLearners",
  RESET_PROGRESS: "resetProgress",
  SEND_REMINDERS: "sendReminders",
  REMOVE_LEARNERS: "removeLearners",
  VIEW_LEARNER_PROFILE: "viewProfile",
  CHANGE_RELEVANCE: "changeRelevance"
};
export const SORTING_ORDER = {
  DESC: "desc",
  ASC: "asc"
};
export const DEFAULT_LEARNERS_TYPE = LEARNER_TYPES.ALL;

export const DEFAULT_LEARNERS_SORT = {
  type: SUPPORTED_SORTINGS.STATUS,
  order: SORTING_ORDER.DESC
};

export const DEFAULT_PAGINATION = {
  start: 0,
  rows: 50
};

export const SUPPORTED_SORTINGS_API_KEY = {
  [SUPPORTED_SORTINGS.NAME]: "name",
  [SUPPORTED_SORTINGS.INVITED_ON]: "added_on",
  [SUPPORTED_SORTINGS.SCORE]: "doc.totalScore",
  [SUPPORTED_SORTINGS.STATUS]: "doc.percentageCompletion"
};

export const SUPPORTED_FILTERS_API_KEY = {
  [SUPPORTED_FILTERS.GROUPS]: "groups",
  [SUPPORTED_FILTERS.SEARCH]: "query",
  [SUPPORTED_FILTERS.LEARNER_TYPE]: "state",
  [SUPPORTED_FILTERS.MODULE_RELEVANCE]: "moduleRelevance"
};

export const LEARNER_TYPE_FILTER_VALUES = {
  [LEARNER_TYPES.ALL]: "ALL",
  [LEARNER_TYPES.COMPLETED]: "COMPLETED",
  [LEARNER_TYPES.IN_PROGRESS]: "ACTIVE",
  [LEARNER_TYPES.ADDED]: "ADDED"
};

export const MODULE_RELEVANCE_FILTER_VALUES = {
  [RELEVANCE_TYPE.REQ]: "Required",
  [RELEVANCE_TYPE.OPT]: "Optional",
  [RELEVANCE_TYPE.NONE]: "Unmarked"
};

export const LEARNER_TYPE_STORE_KEYS = {
  [LEARNER_TYPES.ALL]: "all",
  [LEARNER_TYPES.COMPLETED]: "completed",
  [LEARNER_TYPES.IN_PROGRESS]: "inProgress",
  [LEARNER_TYPES.ADDED]: "added"
};

export const GET_FILTERS = (filters = []) => {
  return filters.reduce((result, { type, value }) => {
    result[SUPPORTED_FILTERS_API_KEY[type]] = value;
    return result;
  }, {});
};

export const GET_STATUS_DISPLAY_NAME = ({ status, completed, total }) => {
  switch (status) {
    case LEARNER_TYPES.ADDED:
      return "Did Not Start";
    default:
      return `${completed} / ${total} completed`;
  }
};

export const MODULE_RELEVANCE_DD_OPTIONS = [
  {
    value: "REQ",
    text: "Required"
  },
  {
    value: "OPT",
    text: "Optional"
  },
  {
    value: "NONE",
    text: "Unmarked"
  }
];

export const GET_DISPLAY_SCORE = ({ score, maxScore }) => {
  return score !== -1 ? `${score} / ${maxScore}` : "----";
};

export const GET_LEARNER_TYPE_BY_VALUE = status => {
  for (const [type, value] of Object.entries(LEARNER_TYPE_FILTER_VALUES)) {
    if (status.toUpperCase() == value) return type;
  }
};

export const GET_MODULE_RELEVANCE_BY_VALUE = relevance => {
  return MODULE_RELEVANCE_FILTER_VALUES[relevance];
};

export const GET_LEARNER_COUNT_DISPLAY_NAME = ({ count, percentage, type }) => {
  switch (type) {
    case LEARNER_TYPES.ALL:
      return `${count} Invited Learners`;
    case LEARNER_TYPES.ADDED:
      return `${count} Did Not Start (${percentage}%)`;
    case LEARNER_TYPES.COMPLETED:
      return `${count} Completed (${percentage}%)`;
    case LEARNER_TYPES.IN_PROGRESS:
      return `${count} Pending (${percentage}%)`;
  }
};

export const POLLING_DELAY = 2000;
export const DEBOUNCE_TIME = 200;
export const POLLING_STATUS = {
  SUCCESS: 1,
  RUNNING: 0,
  FAILED: -1
};

export const RESET_PROGRESS_VALUES = currentStatus => {
  if (currentStatus == LEARNER_TYPES.ADDED) {
    return {};
  }
  return {
    score: 0,
    completed: 0,
    status: LEARNER_TYPES.IN_PROGRESS
  };
};

export const MESSAGES = {
  [OPERATIONS.REMOVE_LEARNERS]: {
    LOADING() {
      return "Removing Learners ...";
    },
    SUCCESS({ successCount, failCount }) {
      if (failCount == 0) {
        return `${successCount} Learner${successCount > 1 ? "s" : ""} removed successfully`;
      } else {
        `${successCount} Learner${
          successCount > 1 ? "s" : ""
        } removed successfully. ${failCount} Learner${
          failCount > 1 ? "s" : ""
        } could not be removed.`;
      }
    },
    ERROR() {
      return `Learners could not be removed from the Module. Please try again later. `;
    }
  },
  [OPERATIONS.CHANGE_RELEVANCE]: {
    LOADING() {
      return "Changing Module Relevance For Learners ...";
    },
    SUCCESS() {
      return `Changed Module Relevance of selected Learner(s)`;
    },
    ERROR() {
      return `Could not change Module Relevance For Learner(s). Please try again later. `;
    }
  }
};

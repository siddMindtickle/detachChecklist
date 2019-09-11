import moment from "moment";

export const DISPLAY_NAME_SUFFIX = {
  CONTENT: "changes",
  SETTINGS: "Overall changes"
};

export const DRAFT_VERSION_DETAILS = {
  version: 0,
  displayName: "Unpublished Changes"
};

export const OPERATIONS = {
  DISCARD: "discard_draft_version",
  PUBLISH: "publish_draft_version",
  GET_SUMMARY: "get_published_summary",
  GET_HISTORY: "get_published_history",
  GET_TODOS: "get_todos",
  GET_INVITED_LEARNER_COUNT: "get_invited_learner_count"
};

export const INVITE_TYPES = {
  INVITE_ALL: "InviteAll",
  INVITE_ACTIVE: "InviteActive",
  INVITE_NONE: "InviteNone"
};

export const INVITE_TYPES_DETAILS = {
  [INVITE_TYPES.INVITE_ALL]: {
    title: moduleType => `all, including those who have completed the ${moduleType}`,
    value: "ALL",
    message: moduleType =>
      `These changes will be published for all Learners who are invited to this ${moduleType}`,
    getWarningText: (count, moduleType) =>
      `The learners(${
        count
          ? (count["completed"] ? count["completed"] : 0) +
            (count["added"] ? count["added"] : 0) +
            (count["active"] ? count["active"] : 0)
          : 0
      }), who have completed the ${moduleType}, will also have to redo the updated part. This might also affect the ${moduleType} analytics.`
  },
  [INVITE_TYPES.INVITE_ACTIVE]: {
    title: moduleType => `only those who have not completed the ${moduleType}`,
    value: "ACTIVE",
    message: moduleType =>
      `These changes will be published for all Learners who have not completed this ${moduleType}`,
    getWarningText: (count, moduleType) =>
      `The learners(${
        count ? (count["added"] ? count["added"] : 0) + (count["active"] ? count["active"] : 0) : 0
      }), who have not completed the ${moduleType}, will have to redo the updated part. This might also affect the ${moduleType} analytics.`
  },
  [INVITE_TYPES.INVITE_NONE]: {
    title: () => "only those who will be invited hereafter",
    value: "NONE",
    message: () => "These changes will be published for all Learners who will be invited hereafter",
    getWarningText: () => ""
  }
};

export const INVITE_OPTIONS = [
  INVITE_TYPES.INVITE_ALL,
  INVITE_TYPES.INVITE_ACTIVE,
  INVITE_TYPES.INVITE_NONE
];

export const GET_VERSION_DISPLAY_NAME = value => {
  return moment(value).format("DD MMM YYYY");
};
export const GET_TITLE = time => {
  if (time) {
    return `Changes published on ${GET_VERSION_DISPLAY_NAME(time)} `;
  }
  return "Unpublished Changes";
};

export const MESSAGES = {
  [OPERATIONS.PUBLISH]: {
    success: "published....",
    loading: "publishing...."
  },
  [OPERATIONS.DISCARD]: {
    confirm: "Are you sure, you want to discard."
  }
};

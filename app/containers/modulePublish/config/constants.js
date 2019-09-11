import { isUndefined } from "@utils";

export const OPERATIONS = {
  UPDATE: "update",
  SEARCH: "search",
  LOAD_MORE: "loadMore"
};

export const LEARNER_TYPES = {
  ALL: "ALL",
  FULL: "FULL",
  SELECTED: "SELECTED",
  NONE: "NONE"
};

export const MODES = {
  VIEW: "view",
  SELECT: "select"
};

export const LEARNERS_CONFIG = {
  [LEARNER_TYPES.ALL]: {
    mode: MODES.VIEW,
    subtitle: "Learners who are invited to atleast one Module in the Series.",
    title: "All learners invited in the Series",
    getSelectedText: num => `All ${num} learner${num > 1 ? "s" : ""}`,
    getOptions: count => ({
      text: `All ${count} learner${count > 0 ? "s" : ""} invited in this series.`,
      subText: "Learners who are invited to atleast one Module in the Series."
    }),
    countKey: "allCount",
    menuItemKey: "All"
  },
  [LEARNER_TYPES.FULL]: {
    mode: MODES.VIEW,
    subtitle: "Learners who are invited to All the Modules in the Series.",
    title: "Fully invited in the Series",
    getSelectedText: num => `${num} fully invited learner${num > 1 ? "s" : ""}`,
    getOptions: count => ({
      text: `${count} Fully Invited learner${count > 0 ? "s" : ""}.`,
      subText: "Learners who are invited to All the Modules in the Series."
    }),
    countKey: "fullCount",
    menuItemKey: "Full"
  },
  [LEARNER_TYPES.SELECTED]: {
    mode: MODES.SELECT,
    title: "Select learners to invite in",
    getFooter: numOfUsers => `${numOfUsers} Learner${numOfUsers > 1 ? "s" : ""} Selected`,
    getSelectedText: num => `${num} selected learner${num > 1 ? "s" : ""}`,
    getOptions: () => ({
      text: "Select Learners",
      subText: "Select from all the learners invited in the Series."
    }),
    menuItemKey: "Selected"
  }
};

// messages
export const getNotificationMessage = numOfLearners =>
  `An email notification has been sent to ${numOfLearners} learners. Track the progress of the invited Learners from `;
export const getConfirmationMessage = (count, moduleType) => {
  if (isUndefined(count)) {
    return `Are you sure you want to publish this ${moduleType}?`;
  }
  return `There are ${count} learners who are subscribed to this Public Series.`;
};

// API constants
export const INPUT_WAIT = 500;
export const GROUPS_TO_FETCH = 500;
export const LEARNERS_TO_FETCH = 20;
export const LEARNERS_START = 0;

export const PUBLISH_FAIL_MESSAGE = "Error in Publishing. Please try again.";

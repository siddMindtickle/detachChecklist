export const LEARNER_OPERATIONS = {
  REMOVE_LEARNERS: "removeLearner",
  RESET_PROGRESS: "resetProgress",
  VIEW_PROFILE: "viewProfile",
  CHANGE_RELEVANCE: "changeRelevance"
};

export const LEARNER_OPERATIONS_DD_OPTIONS = [
  { text: "View Learner Profile", value: LEARNER_OPERATIONS.VIEW_PROFILE },
  { text: "Reset Progress", value: LEARNER_OPERATIONS.RESET_PROGRESS },
  { text: "Remove Learner", value: LEARNER_OPERATIONS.REMOVE_LEARNERS },
  {
    text: "Change Module Relevance",
    value: LEARNER_OPERATIONS.CHANGE_RELEVANCE
  }
];

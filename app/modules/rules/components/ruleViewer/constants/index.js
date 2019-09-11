export const CONDITION_TYPES = {
  USER_ACTIVITY_IN_MODULE_MATCHES: "USER_ACTIVITY_IN_MODULE_MATCHES",
  USER_PROFILE_MATCHES: "USER_PROFILE_MATCHES",
  USER_IN_GROUP: "USER_IN_GROUP"
};

export const TYPE_TO_GROUP_CONFIG = {
  [CONDITION_TYPES.USER_ACTIVITY_IN_MODULE_MATCHES]: ["identifiers", "triads"],
  [CONDITION_TYPES.USER_PROFILE_MATCHES]: ["description", "triads"],
  [CONDITION_TYPES.USER_IN_GROUP]: ["description", "identifiers"]
};

export const OPERATOR_DISPLAY_NAME = {
  EQ: {
    DEFAULT: "=",
    STRING: "is",
    BOOLEAN: "is"
  },
  GT: {
    DEFAULT: ">",
    NUMBER: ">",
    STRING: "is greater than",
    DATETIME: "is after"
  },
  LT: {
    DEFAULT: "<",
    NUMBER: "<",
    STRING: "is lesser than",
    DATETIME: "is before"
  },
  LIKE: {
    DEFAULT: "is like"
  },
  LTE: {
    DEFAULT: "<=",
    NUMBER: "<=",
    STRING: "is lesser than or equal to",
    DATETIME: "is before"
  },
  GTE: {
    DEFAULT: ">=",
    NUMBER: ">=",
    STRING: "is greater than or equal to",
    DATETIME: "is after"
  },
  CONTAINS: {
    DEFAULT: "contains"
  },
  HAS_FIELD: {
    DEFAULT: "has field"
  }
};

export const ACTION_DISPLAY_NAME = {
  ADD: {
    MODULE: "Assign to module",
    SERIES: "Assign to series",
    GROUP: "Add to group"
  },
  REMOVE: {
    MODULE: "Remove from module",
    SERIES: "Remove from series",
    GROUP: "Remove from group"
  }
};

export const GROUPING_DISPLAY = {
  ANY: "Any of these",
  ALL: "All of these"
};

export const IDENTIFIER_TYPES = {
  MODULE: "MODULE",
  TAG: "TAG",
  GROUP: "GROUP",
  SERIES: "SERIES"
};

export const RULE_TABS = {
  CONDITION: "CONDITION",
  ACTION: "ACTION"
};

export const TAB_CONFIG = {
  [RULE_TABS.CONDITION]: {
    title: "Conditions",
    description: "Select the Users who meet the following conditions:"
  },
  [RULE_TABS.ACTION]: {
    title: "Actions",
    description:
      "Complete the following actions on the Users who meet the conditions mentioned above:"
  }
};

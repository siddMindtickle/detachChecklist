export const OPERATIONS = {
  UPDATE_RULE: "UPDATE_RULE",
  UPDATE_MAIN_SWITCH: "UPDATE_MAIN_SWITCH"
};

export const RULE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PAUSED: "PAUSED"
};

export const RULE_ENTITIES = {
  NAME: "name",
  DESCRIPTION: "description",
  STATUS: "status"
};

export const STATUS_CONFIG = {
  [RULE_STATUS.ACTIVE]: {
    switchDisplay: "On",
    switchInfo: "Disable Automation Rules",
    accessDeniedInfo: "Please contact support to get permissions to disable Automation Rules",
    displayName: "Active",
    displayInfo: "Status of the Rule: Active",
    buttonName: "Deactivate",
    toggleMode: RULE_STATUS.INACTIVE,
    confirm: "Are you sure you want to deactivate this Rule?"
  },
  [RULE_STATUS.INACTIVE]: {
    switchDisplay: "Off",
    switchInfo: "Enable Automation Rules",
    accessDeniedInfo: "Please contact support to get permissions to enable Automation Rules",
    displayName: "Inactive",
    displayInfo: "Status of the Rule: Inactive",
    buttonName: "Activate",
    toggleMode: RULE_STATUS.ACTIVE,
    confirm: "Are you sure you want to activate this Rule?"
  },
  [RULE_STATUS.PAUSED]: {
    displayName: "Paused"
  }
};

export const RULES_ACTIONS = {
  TOGGLE_MAIN_SWITCH: "TOGGLE_MAIN_SWITCH",
  TOGGLE_META_DATA: "TOGGLE_META_DATA"
};

// display messages
export const AR_LEFT_HEADER = "Automation Rules";
export const AR_MAIN_SWITCH_DISABLED =
  "Automation Rules are disabled. Toggle this button to enable them so that Active Rules may complete actions.";

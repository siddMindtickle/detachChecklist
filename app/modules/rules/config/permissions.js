import { RULES_ACTIONS as ACTIONS } from "./constants";

export const ACTIONS_ACCESS_MAP = {
  [ACTIONS.TOGGLE_META_DATA]: ["MANAGE_AUTOMATION_RULES", "EDIT_AUTOMATION_RULES"],
  [ACTIONS.TOGGLE_MAIN_SWITCH]: ["MANAGE_AUTOMATION_RULES"]
};

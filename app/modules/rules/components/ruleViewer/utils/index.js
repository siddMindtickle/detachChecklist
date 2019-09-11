import { OPERATOR_DISPLAY_NAME, ACTION_DISPLAY_NAME, GROUPING_DISPLAY } from "../constants";

export const getOperatorDisplayName = (operator, dataType) => {
  const operatorConfig = OPERATOR_DISPLAY_NAME[operator];
  return operatorConfig ? operatorConfig[dataType] || operatorConfig.DEFAULT || operator : operator;
};

export const getActionDisplayName = (entityType, operation) => {
  return ACTION_DISPLAY_NAME[operation][entityType];
};

export const getGroupingDisplayName = grouping => GROUPING_DISPLAY[grouping];

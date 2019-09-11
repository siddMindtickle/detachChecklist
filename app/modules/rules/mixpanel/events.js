import * as actionTypes from "../actionTypes";
import { OPERATIONS, RULE_ENTITIES } from "../config/constants";
import { getLoadingActions } from "@core/helpers";
import * as processor from "./helpers";

export default {
  [getLoadingActions(actionTypes.LOAD_DATA).LOADING]: {
    event: "Click Automation Rules",
    data: {}
  },
  [getLoadingActions(actionTypes.FETCH_RULE).SUCCESS]: {
    event: "Click Rule",
    data: {
      ruleId: { value: "", processor: processor.getRuleId }
    }
  },
  [getLoadingActions(actionTypes.MANIPULATE_DATA).SUCCESS]: {
    [OPERATIONS.UPDATE_RULE]: {
      [RULE_ENTITIES.NAME]: {
        event: "Change Rule Name",
        data: {
          ruleId: {
            value: OPERATIONS.UPDATE_RULE,
            processor: processor.getRuleId
          }
        }
      },
      [RULE_ENTITIES.DESCRIPTION]: {
        event: "Change Rule description",
        data: {
          ruleId: {
            value: OPERATIONS.UPDATE_RULE,
            processor: processor.getRuleId
          }
        }
      },
      [RULE_ENTITIES.STATUS]: {
        event: "Change rule status",
        data: {
          ruleId: {
            value: OPERATIONS.UPDATE_RULE,
            processor: processor.getRuleId
          },
          Status: {
            value: OPERATIONS.UPDATE_RULE,
            processor: processor.getRuleStatus
          }
        }
      }
    },
    [OPERATIONS.UPDATE_MAIN_SWITCH]: {
      event: "Automation Main Switch",
      data: {
        Status: { value: "", processor: processor.getRuleStatus }
      }
    }
  }
};

import * as actionTypes from "../actionTypes";
import { OPERATIONS } from "../config/constants";

import { getLoadingActions } from "@core/helpers";
import * as processor from "./helpers";

const MixpanelEvents = {
  [getLoadingActions(actionTypes.MANIPULATE_DATA).SUCCESS]: {
    [OPERATIONS.COMPLETE]: {
      event: ["mark_task_checklist", "complete_checklist"],
      data: {
        taskStatus: {
          value: OPERATIONS.COMPLETE,
          processor: processor.getTaskStatus
        },
        moduleStatus: {
          value: OPERATIONS.COMPLETE,
          processor: processor.getModuleStatus
        }
      }
    },
    [OPERATIONS.SELECT]: {
      event: "View content",
      data: {
        "Visit Type": {
          value: "Start"
        }
      }
    },
    [OPERATIONS.START]: {
      event: "View content",
      data: {
        "Visit Type": {
          value: "Start"
        }
      }
    }
  }
};

export default MixpanelEvents;

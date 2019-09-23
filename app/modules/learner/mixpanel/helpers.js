import { OPERATIONS } from "../config/constants";
import { CHECKLIST_STATUS } from "@mixpanel/enums";

export const getTaskStatus = (op, response) => {
  let isCompleted = response.taskData.isCompleted;
  switch (op) {
    case OPERATIONS.COMPLETE:
      return isCompleted ? CHECKLIST_STATUS.COMPLETED : CHECKLIST_STATUS.INCOMPLETE;
  }
};

export const getModuleStatus = (op, response) => {
  let isCompleted = response.moduleState.isCompleted;
  switch (op) {
    case OPERATIONS.COMPLETE:
      return isCompleted ? CHECKLIST_STATUS.COMPLETED : CHECKLIST_STATUS.INCOMPLETE;
  }
};

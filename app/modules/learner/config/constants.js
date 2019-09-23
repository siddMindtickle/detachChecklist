export const OPERATIONS = {
  SELECT: "select",
  COMPLETE: "markComplete",
  START: "startModule"
};
export const NODE_TYPE = {
  OVERVIEW: "overview",
  TASK: "task"
};

export const MESSAGES = {
  TOOLTIPS: {
    LOCKED_TASK:
      "This task can't be marked as complete because you have not completed a previous task. Tasks in this Checklist can only be completed in a sequential order",
    FROZEN_TASK: "This content is no longer accessible because it is past its due date."
  }
};

export const TASK_NAVIGATION = {
  NEXT: "NEXT",
  EXIT: "EXIT"
};

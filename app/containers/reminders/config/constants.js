import moment from "moment";
import { secondsToMiliseconds } from "@utils";
import { getTimezone } from "@utils/timezone";

export const SIZE = 500;
export const START = 0;
export const noop = () => null;

export const OPERATIONS = {
  UPDATE: "updateReminder",
  ADD: "createReminder",
  REMOVE: "removeReminder"
};

export const LEARNER_STATUS_ID_MAP = {
  INVITATION: "_invitation",
  COMPLETION: "_completion",
  NOT_COMPLETED: "_reminder_not_completed",
  NOT_STARTED: "_reminder_not_started",
  ENROLLED: "_marked_ilt_session_attendance",
  NOT_ENROLLED: "_reminder_not_enrolled_in_session"
};

export const EMAIL_SETTINGS_WARNING_MESSAGES = {
  ONLY_INVITE_DISABLED:
    "Note: Module Invitation emails have been switched off from Series Settings. Your Learners will not receive invitation emails for any Module in this Series, even if the emails are scheduled here.",
  ONLY_REMINDERS_DISABLED:
    "Note: Series Reminders have been switched off. Your Learners will not receive reminder emails even if the emails are scheduled here.",
  BOTH_INVITE_AND_REMINDERS_DISABLED:
    "Note: Reminders and Module Invitation emails for this Series have been switched off from Series Settings. Your Learners will not receive reminder or invitation emails even if the emails are scheduled here."
};

export const REMINDER_TYPES = {
  AFTER_DAYS: "afterDays",
  AFTER_DAYS_START: "afterDaysStart",
  EPOCH: "specificTime",
  CONSTANT: "constant"
};

export const LEARNER_STATUS_MAP = {
  [LEARNER_STATUS_ID_MAP.INVITATION]: {
    name: "Invited",
    getCondition: noop,
    reminder: "On Invitation",
    displayIndex: 0,
    multipleReminders: false
  },
  [LEARNER_STATUS_ID_MAP.COMPLETION]: {
    name: "Completed",
    getCondition: noop,
    reminder: "On Completion",
    displayIndex: 3,
    multipleReminders: false
  },
  [LEARNER_STATUS_ID_MAP.NOT_COMPLETED]: {
    name: "In Progress",
    getCondition({ moduleId, companyId, type }) {
      switch (type) {
        case REMINDER_TYPES.AFTER_DAYS_START:
          return `joined_but_not_completed_after_start('${companyId}','${moduleId}')`;
        case REMINDER_TYPES.AFTER_DAYS:
        case REMINDER_TYPES.EPOCH:
          return `joined_but_not_completed('${companyId}','${moduleId}')`;
      }
    },
    displayIndex: 2,
    multipleReminders: true
  },
  [LEARNER_STATUS_ID_MAP.NOT_STARTED]: {
    name: "Did Not Start",
    getCondition({ moduleId, companyId }) {
      return `invited_but_not_joined('${companyId}','${moduleId}')`;
    },
    displayIndex: 1,
    multipleReminders: true
  },
  [LEARNER_STATUS_ID_MAP.ENROLLED]: {
    name: "Enrolled In Session",
    getCondition: noop,
    reminder: "When Admin Updates Session Attendance",
    displayIndex: 2,
    multipleReminders: false
  },
  [LEARNER_STATUS_ID_MAP.NOT_ENROLLED]: {
    name: "Not Enrolled In Any Session",
    getCondition({ moduleId, companyId }) {
      return `invited_but_not_enrolled('${companyId}','${moduleId}')`;
    },
    displayIndex: 1,
    multipleReminders: true
  }
};

export const REMINDER_TYPE_DISPLAY_VALUE = (type, value) => {
  if (!value) return;
  switch (type) {
    case REMINDER_TYPES.AFTER_DAYS:
    case REMINDER_TYPES.AFTER_DAYS_START:
      return [value, " days"].join("");
    case REMINDER_TYPES.EPOCH: //eslint-disable-line no-case-declarations
      const momentObj = moment(value).seconds(0);
      return `${momentObj.format("MMM DD, YYYY")} at ${momentObj.format("HH:mm")} ${getTimezone()}`;
  }
};

export const REMINDER_TYPE_VALUE_BY_CONDITION = ({
  condition,
  schedule = null,
  learnerStatus,
  templateId,
  mailJobId
}) => {
  const { CONSTANT, AFTER_DAYS, AFTER_DAYS_START, EPOCH } = REMINDER_TYPES;
  if (!condition) {
    return {
      type: CONSTANT,
      value: LEARNER_STATUS_MAP[learnerStatus].reminder,
      displayValue: LEARNER_STATUS_MAP[learnerStatus].reminder,
      templateId,
      mailJobId
    };
  }

  let value = condition.split("==")[1] || null;
  if (value) {
    value = value.split("d")[0];
    const reminderType = condition.indexOf("_after_start") > -1 ? AFTER_DAYS_START : AFTER_DAYS;
    return {
      type: reminderType,
      value,
      displayValue: REMINDER_TYPE_DISPLAY_VALUE(reminderType, value),
      templateId,
      mailJobId
    };
  } else {
    const timestamp = secondsToMiliseconds(schedule);
    return {
      type: EPOCH,
      value: timestamp,
      displayValue: REMINDER_TYPE_DISPLAY_VALUE(EPOCH, timestamp),
      templateId,
      mailJobId
    };
  }
};

export const REMINDER_TYPE_CRON_MAP = {
  [REMINDER_TYPES.AFTER_DAYS]: "0 0 0 * * ? *",
  [REMINDER_TYPES.AFTER_DAYS_START]: "0 0 0 * * ? *",
  [REMINDER_TYPES.EPOCH]: null
};

export const REMINDER_TYPE_OPTIONS_DISPLAY_NAME = {
  [LEARNER_STATUS_ID_MAP.NOT_COMPLETED]: {
    [REMINDER_TYPES.AFTER_DAYS]: "Number of days after Invitation",
    [REMINDER_TYPES.AFTER_DAYS_START]: "Number of days after start",
    [REMINDER_TYPES.EPOCH]: "Select a custom date"
  },
  [LEARNER_STATUS_ID_MAP.NOT_STARTED]: {
    [REMINDER_TYPES.AFTER_DAYS]: "Number of days after invitation",
    [REMINDER_TYPES.EPOCH]: "Select a custom date"
  },
  [LEARNER_STATUS_ID_MAP.NOT_ENROLLED]: {
    [REMINDER_TYPES.AFTER_DAYS]: "Number of days after invitation",
    [REMINDER_TYPES.EPOCH]: "Select a custom date"
  }
};

export const REMINDER_TYPE_DEFAULT_VALUE = type => {
  let result = {
    value: undefined,
    displayValue: undefined
  };
  const defaultDays = 3;
  const defaultEpoch = +moment()
    .add(defaultDays, "days")
    .seconds(0);

  switch (type) {
    case REMINDER_TYPES.AFTER_DAYS:
    case REMINDER_TYPES.AFTER_DAYS_START:
      result = {
        value: defaultDays,
        displayValue: REMINDER_TYPE_DISPLAY_VALUE(type, defaultDays)
      };
      break;
    case REMINDER_TYPES.EPOCH:
      result = {
        value: defaultEpoch,
        displayValue: REMINDER_TYPE_DISPLAY_VALUE(type, defaultEpoch)
      };
      break;
  }
  return result;
};

export const TEMPLATE_ID_DEFAULT_VALUE = learnerStatusId => {
  switch (learnerStatusId) {
    case LEARNER_STATUS_ID_MAP.NOT_STARTED:
      return "_learner_entity_reminder_not_started";
    case LEARNER_STATUS_ID_MAP.NOT_COMPLETED:
      return "_learner_entity_reminder_not_completed";
    case LEARNER_STATUS_ID_MAP.NOT_ENROLLED:
      return "_learner_ilt_reminder_not_enrolled";
    default:
      return 0;
  }
};

export const NO_TEMPLATE_OPTION = { id: "0", name: "None" };

export const GET_CONDITION_SCHEDULE_BY_REMINDER_TYPE = ({ condition, type, time }) => {
  switch (type) {
    case REMINDER_TYPES.AFTER_DAYS:
    case REMINDER_TYPES.AFTER_DAYS_START:
      return {
        condition: `${condition}==${[time, "d"].join("")}`,
        schedule: REMINDER_TYPE_CRON_MAP[type]
      };
    case REMINDER_TYPES.EPOCH:
      return { condition, schedule: time };
    default:
      return { condition: null, schedule: null };
  }
};

export const MESSAGES = {
  REMOVE_CONFIRMATION: "Are you sure you want to remove this mail?",
  INFO_P1:
    "All Module reminders, for a given Series, that are set to 'X days after invitation or X days before Due date' are combined into a single email digest and sent on the specified day.",
  INFO_P2:
    "Reminders which are set for a specific date and time are not included in the email digest. These reminder emails are sent out as separate emails."
};

export const DEFAULT_VALUE = "None";

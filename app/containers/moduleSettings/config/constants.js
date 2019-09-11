import { MT_ENTITIES } from "@config/global.config";
import React from "react";
import moment from "moment";
import { minutesToDays, milisecondsToSeconds, secondsToMiliseconds } from "@utils";
import { getTimezone } from "@utils/timezone";

export const SETTINGS = MT_ENTITIES.SETTINGS;
export const STATIC = MT_ENTITIES.STATIC;

export const OPERATIONS = {
  GET: "get",
  UPDATE: "update"
};

export const SETTING_TYPES = {
  GENERAL: "general",
  SCORING: "scoring",
  REMINDERS: "reminders"
};

export const SELECTOR_TYPE = {
  TOGGLE_SWITCH: "TOGGLE_SWITCH",
  RADIO_OPTIONS: "RADIO_OPTIONS"
};

export const SETTING_TABS = {
  [SETTING_TYPES.GENERAL]: "General",
  [SETTING_TYPES.SCORING]: "Scoring",
  [SETTING_TYPES.REMINDERS]: "Due Date & Reminders"
};

export const SCORING_SETTINGS_OPTIONS = {
  DEFAULT_SCORE: "default_score",
  DEFAULT_SESSION_SCORE: "default_session_score",
  CERTIFICATE: "certificate",
  HALL_OF_FAME: "hall_of_fame"
};

export const GENERAL_SETTINGS_OPTIONS = {
  SEQUENTIAL_ORDERING: "sequential_ordering",
  DESCRIPTION: "description",
  TAGS: "tags",
  THUMBNAIL: "thumbnail",
  MULTIPLE_ENROLLMENT: "multiple_enrollment",
  LEARNER_CNF_SSN_EMAIL: "learnerCnfSsnEmail",
  RESTRICT_LEARNER_ENROLL: "restrictLearnerEnroll",
  SHOW_LEARNER_TIMEZONE: "showLearnerTimezone",
  MODULE_RELEVANCE: "moduleRelevance"
};

export const GENERAL_SETTINGS_KEY_MAP = {
  [GENERAL_SETTINGS_OPTIONS.SEQUENTIAL_ORDERING]: "sequentialLock",
  [GENERAL_SETTINGS_OPTIONS.DESCRIPTION]: "description",
  [GENERAL_SETTINGS_OPTIONS.TAGS]: "tags",
  [GENERAL_SETTINGS_OPTIONS.THUMBNAIL]: "thumb",
  [GENERAL_SETTINGS_OPTIONS.MULTIPLE_ENROLLMENT]: "multipleEnrollment",
  [GENERAL_SETTINGS_OPTIONS.LEARNER_CNF_SSN_EMAIL]: "learnerCnfSsnEmail",
  [GENERAL_SETTINGS_OPTIONS.RESTRICT_LEARNER_ENROLL]: "restrictLearnerEnroll",
  [GENERAL_SETTINGS_OPTIONS.SHOW_LEARNER_TIMEZONE]: "showLearnerTimezone",
  [GENERAL_SETTINGS_OPTIONS.MODULE_RELEVANCE]: "moduleRelevance"
};

export const CARD_DETAILS = {
  MULTIPLE_ENROLLMENT: {
    header: "Learners can take multiple Sessions",
    selectorType: SELECTOR_TYPE.TOGGLE_SWITCH,
    desc:
      "If YES, invited learners will be able to take more than one Session. However learners will only be able to enroll in an upcoming Session if their previously enrolled session is over."
  },
  LEARNER_CNF_SSN_EMAIL: {
    header: "Session confirmation email",
    selectorType: SELECTOR_TYPE.TOGGLE_SWITCH,
    desc:
      "Send a confirmation email to the learner whenever he/she enrolls/or join the waiting list in a Session."
  },
  RESTRICT_LEARNER_ENROLL: {
    header: "Restrict Learners from Enrolling",
    selectorType: SELECTOR_TYPE.TOGGLE_SWITCH,
    desc:
      "If ON, Learners will not be able to enroll/unenroll in the sessions from their Learning Site."
  },
  SHOW_LEARNER_TIMEZONE: {
    header: "Session Time Zone for Learners",
    selectorType: SELECTOR_TYPE.RADIO_OPTIONS,
    options: [
      {
        optionText:
          "Show Session time in the Time Zone selected by the admin while creating a session",
        value: false
      },
      {
        optionText: "Show session time in the Time Zone that is set in each Learner's Profile",
        value: true
      }
    ]
  },
  MODULE_RELEVANCE: {
    header: "Module Relevance",
    info: { type: "component", content: "ModuleRelevanceInfo" },
    desc: "Set the default Module Relevance for Learners invited henceforth to:",
    selectorType: SELECTOR_TYPE.RADIO_OPTIONS,
    footer: (
      <div style={{ fontSize: "13px" }}>
        {" "}
        <span style={{ fontWeight: "600" }}>Note:</span> The above is a default Selection and you
        can always change the Module Relevance while inviting Learners or from the Module track page
        for already invited Learners.{" "}
      </div>
    ),
    options: [
      {
        optionText: "Required",
        value: "REQ"
      },
      {
        optionText: "Optional",
        value: "OPT",
        optionWarning: {
          text:
            "As this is a Sequentially Locked Series, Learners will have to complete all Optional Modules also to proceed.",
          iconType: "warning",
          conditional: "sequentialLockingEnabled"
        },
        optionWarningConditional: "sequentialLockedSeries"
      },
      {
        optionText: "Unmark (Do not mark either Required or Optional)",
        value: "NONE"
      }
    ]
  }
};

export const REMINDER_SETTINGS_OPTIONS = {
  DUE_DATE: "duedate",
  REMINDERS: "reminders"
};

export const CUTOFF_OPTIONS = [
  {
    text: "10 %",
    value: {
      value: 10,
      unitType: "PERCENT"
    }
  },
  {
    text: "20 %",
    value: {
      value: 20,
      unitType: "PERCENT"
    }
  },
  {
    text: "30 %",
    value: {
      value: 30,
      unitType: "PERCENT"
    }
  },
  {
    text: "40 %",
    value: {
      value: 40,
      unitType: "PERCENT"
    }
  },
  {
    text: "50 %",
    value: {
      value: 50,
      unitType: "PERCENT"
    }
  },
  {
    text: "60 %",
    value: {
      value: 60,
      unitType: "PERCENT"
    }
  },
  {
    text: "70 %",
    value: {
      value: 70,
      unitType: "PERCENT"
    }
  },
  {
    text: "80 %",
    value: {
      value: 80,
      unitType: "PERCENT"
    }
  },
  {
    text: "90 %",
    value: {
      value: 90,
      unitType: "PERCENT"
    }
  },
  {
    text: "100 %",
    value: {
      value: 100,
      unitType: "PERCENT"
    }
  }
];

export const DUE_DATE_TYPE_MAP = {
  AFTER_DAYS: "NUM_MINUTES_AFTER_INVITATION",
  SPECIFIC_TIME: "SPECIFIC_DATE",
  NONE: "NONE"
};

export const DUE_DATE_TYPE_DETAILS = {
  [DUE_DATE_TYPE_MAP.AFTER_DAYS]: {
    displayName: "Number of days after invitation",
    defaultValue: 4320,
    getDisplayValue(value) {
      return `${minutesToDays(value)} Day(s) after invitation`;
    }
  },
  [DUE_DATE_TYPE_MAP.SPECIFIC_TIME]: {
    displayName: "Specific Date",
    defaultValue: milisecondsToSeconds(+moment().add(3, "days")),
    getDisplayValue(value) {
      value = secondsToMiliseconds(value);
      const momentObj = moment(value);
      return `${momentObj.format("MMM DD, YYYY")} at ${momentObj.format("HH:mm")} ${getTimezone()}`;
    }
  },
  [DUE_DATE_TYPE_MAP.NONE]: {
    defaultValue: 0
  }
};

export const DUE_DATE_ACTION = {
  NO_ACTION: {
    displayName: "Nothing happens. Learner can still complete the Checklist.",
    value: "NONE"
  },
  FREEZE: {
    displayName: "Checklist freezes. Learner can’t progress any further.",
    value: "FREEZE"
  }
};

export const SETTING_MESSAGE = {
  INFO: {
    SCORE: "All the tasks created henceforth will have this score by default.",
    SESSION_SCORE: "All the sessions created henceforth will have this score by default."
  }
};

export const API_KEY_MAP = {
  certificate: "certificate",
  passingScore: "passingScore"
};

export const GET_SETTING_TYPE_KEY = value => {
  return Object.keys(SETTING_TYPES).filter(type => SETTING_TYPES[type] == value)[0];
};

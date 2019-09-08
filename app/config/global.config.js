export const MT_ENTITIES = {
  SECTION: "section",
  TASK: "task",
  LEVEL: "level",
  SETTINGS: "settings",
  STATIC: "static",
  IMAGE: "image",
  SESSIONS: "sessions"
};

export const MT_ENTITY_TYPE_ID = {
  [MT_ENTITIES.SECTION]: {
    type: 42,
    staticType: 212
  },
  [MT_ENTITIES.TASK]: {
    type: 121,
    staticType: 241
  },
  [MT_ENTITIES.LEVEL]: {
    type: 41,
    staticType: 211
  },
  [MT_ENTITIES.IMAGE]: {
    type: 81
  },
  [MT_ENTITIES.SESSION]: {
    type: 609,
    staticType: 251
  }
};

export const MT_MODULES = {
  CHECKLIST: "Checklist",
  ILT: "ILT",
  COURSE: "Course",
  UPDATE: "Update",
  MISSION: "Mission",
  ASSESSMENT: "Assessment",
  COACHING: "Coaching"
};

export const MT_MODULES_API_KEY_MAP = {
  CHECKLIST: MT_MODULES.CHECKLIST,
  ILT: MT_MODULES.ILT,
  COURSE: MT_MODULES.COURSE,
  UPDATE: MT_MODULES.UPDATE,
  MISSION: MT_MODULES.MISSION,
  ASSESSMENT: MT_MODULES.ASSESSMENT,
  COACHING: MT_MODULES.COACHING
};

export const DRAFT_STATE = 3;

export const POLLING_STATUS = {
  SUCCESS: 1,
  RUNNING: 0,
  FAILED: -1
};
export const POLLING_DELAY = 2000;

export const API_KEY_MAP = {
  module_static: {
    id: "id",
    name: "name",
    description: "desc",
    scoring: "defaultScoringOnTask",
    score: "defaultMaxScoreOnCompletion",
    hallOfFame: "isHallofFame",
    showSections: "showSections",
    sequentialLock: "isSequentiallyLocked",
    companyId: "companyId",
    mappedSeries: "parentList",
    dueDate: "dueDate",
    dueDateExpiry: "dueDateExpiryAction",
    dueDateType: "dueDateType",
    dueDateValue: "value",
    thumb: "thumbObj",
    thumbId: "object",
    thumbTitle: "title",
    thumbUrl: "processed_path",
    thumbObj: "obj",
    thumbType: "type",
    defaultThumb: "defaultThumbObj",
    isPublished: "state_value",
    multipleEnrollment: "allowMultipleSession",
    learnerCnfSsnEmail: "learnerSessionCnfEmail",
    restrictLearnerEnroll: "restrictLearnerEnroll",
    showLearnerTimezone: "showLearnerTimezone",
    moduleRelevance: "moduleRelevance"
  }
};

import { LIFECYCLE_STAGES } from "@config/env.config";

export const STAGES_ACCESS_MAP = {
  [LIFECYCLE_STAGES.BUILD]: {
    allow: ["MODULE_MANAGEMENT", "MODULE_DEVELOPMENT"]
  },
  [LIFECYCLE_STAGES.SETTINGS]: {
    allow: ["MODULE_MANAGEMENT", "MODULE_DEVELOPMENT"]
  },
  [LIFECYCLE_STAGES.PUBLISH]: {
    allow: ["MODULE_MANAGEMENT", "MODULE_DEVELOPMENT"]
  },
  [LIFECYCLE_STAGES.INVITE]: {
    allow: ["MODULE_SHARING", "SERIES_MANAGEMENT"]
  }
};

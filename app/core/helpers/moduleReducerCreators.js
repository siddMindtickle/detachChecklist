import ReduxObject from "@core/helpers/reduxObject";
// import { ENTITY_COMPLETION_STATES } from "@config/env.config";

export const FETCH_INIT_DATA = "@@allaboard/module/FETCH_INIT_DATA";
export const UPDATE_MODULE_STATE = "@@allaboard/module/UPDATE_MODULE_STATE";
export const MANIPULATE_DATA = "@@allaboard/module/MANIPULATE_DATA";
export const UPDATE_SECTIONS = "@@allaboard/module/UPDATE_SECTIONS";
export const UPDATE_TASKS = "@@allaboard/module/UPDATE_TASKS";
export const UPDATE_LEVELS = "@@allaboard/module/UPDATE_LEVELS";
export const MIXPANEL = "@@allaboard/module/REGISTER_MIXPANEL";

export default function createModuleRedux(additionalEvents = []) {
  return new ReduxObject([
    {
      name: FETCH_INIT_DATA,
      options: { async: true }
    },
    {
      name: UPDATE_MODULE_STATE,
      options: {
        key: "moduleState"
      }
    },
    {
      name: UPDATE_SECTIONS,
      options: {
        key: "sections"
      }
    },
    {
      name: UPDATE_LEVELS,
      options: {
        key: "levels"
      }
    },
    {
      name: UPDATE_TASKS,
      options: {
        key: "tasks"
      }
    },
    {
      name: MANIPULATE_DATA,
      options: {
        key: "operationStatus",
        async: true
      }
    },
    {
      name: MIXPANEL,
      options: {
        key: "mixpanel"
      }
    },
    ...additionalEvents
  ]);
}

import { put, takeEvery, call, all, select } from "redux-saga/effects";
import { delay } from "redux-saga";
import { getActions } from "@core/helpers";
import GlobalService from "@api/index";
import { prune } from "@utils";
import ChecklistService, { parseTask } from "./api/checklist";
import { mixpanelIdentityPath } from "./mixpanel/config";

import {
  FETCH_INIT_DATA,
  UPDATE_MODULE_STATE,
  UPDATE_LEVELS,
  UPDATE_TASKS,
  UPDATE_SECTIONS,
  MANIPULATE_DATA,
  MIXPANEL
} from "./actionTypes";

import { OPERATIONS } from "./config/constants";

const { SELECT, COMPLETE, START } = OPERATIONS;
const OPERATIONS_HANDLER_MAP = {
  [SELECT]: getTaskDetails,
  [START]: startModule,
  [COMPLETE]: markTask
};

const getUpdatedTaskFields = completed => {
  // const state = completed ? ENTITY_COMPLETION_STATES.COMPLETED :  ENTITY_COMPLETION_STATES.IN_PROGRESS;
  return {
    state: completed ? "COMPLETED" : "IN_PROGRESS",
    completionState: completed ? "WRONG" : "CORRECT",
    completionStatus: completed ? "DONE" : "NOT_DONE"
  };
};

function* registerMixpanel() {
  yield put(getActions(MIXPANEL)(mixpanelIdentityPath));
}

function* getContext() {
  const {
    checklist: {
      seriesData: { id: seriesId } = {},
      moduleState: { reattempt, version } = {},
      moduleData: { id: moduleId, isSequentiallyLocked } = {},
      mixpanel = {}
    },
    auth: {
      company: {
        data: { id: companyId }
      },
      login: {
        data: {
          user: { id: userId }
        }
      }
    }
  } = yield select();
  return {
    seriesId,
    moduleId,
    companyId,
    userId,
    reattempt,
    version,
    isSequentiallyLocked,
    mixpanel
  };
}

function* markTask({ taskId, completed }) {
  const context = yield getContext();
  const {
    checklist: { tasks }
  } = yield select();
  const { userLearningObjectVo, geData: moduleState } = yield call(GlobalService.updateTask, {
    taskId,
    taskType: tasks[taskId].type,
    updatedFields: getUpdatedTaskFields(completed),
    ...context
  });
  yield put(
    getActions(UPDATE_TASKS)({
      [taskId]: { ...tasks[taskId], ...prune(parseTask(userLearningObjectVo)) }
    })
  );
  yield put(getActions(UPDATE_MODULE_STATE)(moduleState));
  return { taskId, context };
}

function* getFirstTaskId() {
  const {
    checklist: { levels = {}, sections = {} }
  } = yield select();
  const levelId = Object.keys(levels)[0];
  const fistSectionId = levels[levelId].sections[0];
  const firstTaskId = sections[fistSectionId].tasks[0];
  return firstTaskId;
}

function* startModule() {
  const context = yield getContext();
  const response = yield call(GlobalService.startEntity, { ...context });
  yield put(getActions(UPDATE_MODULE_STATE)({ ...response, isStarted: true }));
  const firstTaskId = yield call(getFirstTaskId);
  yield call(getTaskDetails, { taskId: firstTaskId });
  return { taskId: firstTaskId, context };
}

function* getTaskDetails({ taskId }) {
  const {
    checklist: { tasks, moduleState: { isStarted } = {} }
  } = yield select();
  if (!isStarted) yield startModule();
  const context = yield getContext();
  if (tasks[taskId] && tasks[taskId].loaded) {
    yield delay(0);
  } else {
    const details = yield call(ChecklistService.getTaskDetails, {
      taskId,
      sectionId: tasks[taskId].sectionId,
      ...context
    });
    const taskDetails = tasks[details.id] || {};
    yield put(
      getActions(UPDATE_TASKS)({
        [details.id]: { ...taskDetails, ...details, loaded: true }
      })
    );
  }
  return { taskId, context, moduleAlreadyStarted: isStarted };
}

function* fetchChecklistData({ payload: { moduleId, seriesId } }) {
  const fetchInitData = yield call(getActions, {
    name: FETCH_INIT_DATA,
    options: {
      async: true
    }
  });

  try {
    const context = yield call(getContext);
    const [{ seriesData, moduleData, moduleState }, { sections, tasks, levels }] = yield all([
      yield call(ChecklistService.getModuleDetails, { moduleId, seriesId }),
      yield call(ChecklistService.getReportCard, {
        ...context,
        moduleId,
        seriesId
      })
    ]);
    yield put(getActions(UPDATE_MODULE_STATE)(moduleState));
    yield put(getActions(UPDATE_LEVELS)(levels));
    yield put(getActions(UPDATE_SECTIONS)(sections));
    yield put(getActions(UPDATE_TASKS)(tasks));
    yield call(registerMixpanel);
    yield put(fetchInitData.SUCCESS({ seriesData, moduleData }));
  } catch (error) {
    yield put(fetchInitData.FAIL(error, { globalError: true }));
  }
}

function* manageOperations({ payload: { operation, data } }) {
  const { SUCCESS, FAIL } = getActions({
    name: MANIPULATE_DATA,
    options: {
      async: true
    }
  });
  const {
    checklist: { moduleState: oldModuleState }
  } = yield select();
  try {
    const {
      context: { mixpanel },
      taskId,
      moduleAlreadyStarted
    } = yield call(OPERATIONS_HANDLER_MAP[operation], {
      ...data
    });
    const {
      checklist: { moduleState, moduleData, tasks }
    } = yield select();
    yield put(
      SUCCESS({
        data: {
          taskId,
          operation,
          mixpanel,
          dontTrack: moduleAlreadyStarted,
          multipleTrack: moduleState.isCompleted !== oldModuleState.isCompleted,
          response: {
            moduleState,
            moduleData,
            taskData: tasks[taskId]
          }
        }
      })
    );
  } catch (error) {
    yield put(FAIL(error));
  }
}

function* handleOperations() {
  yield takeEvery(MANIPULATE_DATA, manageOperations);
}

function* fetchCheckList() {
  yield takeEvery(FETCH_INIT_DATA, fetchChecklistData);
}

export default function*() {
  yield all([fetchCheckList(), handleOperations()]);
}

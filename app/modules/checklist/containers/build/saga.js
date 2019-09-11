import { put, takeEvery, call, all, select } from "redux-saga/effects";

import { getActions } from "@core/helpers";
import { isEmpty, isObject, isString } from "@utils";
import ModuleService from "@api/moduleService";
import { MT_ENTITIES } from "@config/global.config";

import { getActiveLevel } from "../../utils";
import {
  HANDLE_UNPUBLISHED_CHANGES_FLAG,
  GET_CHECKLIST_BUILD_DATA,
  MANIPULATE_BUILD_DATA,
  UPDATE_SECTIONS,
  UPDATE_LEVELS,
  UPDATE_TASKS,
  UPDATE_STATIC
} from "../../actionTypes";

import ChecklistService from "../../api/checklist";
import { OPERATIONS, TREE_NODE_DEFAULT } from "../../config/constants";

const { SECTION, TASK, STATIC, LEVEL } = MT_ENTITIES;
const { ADD, REMOVE, SELECT, EXPAND, UPDATE, COPY, GET, MOVE } = OPERATIONS;

const ENTITY_TYPE_SERVICE_MAP = {
  [STATIC]: {
    [UPDATE]: ModuleService.modifyDetails
  },
  [SECTION]: {
    [GET]: ChecklistService.getSectionDetails,
    [ADD]: ChecklistService.createSection,
    [REMOVE]: ChecklistService.deleteSection,
    [UPDATE]: ChecklistService.modifySection,
    [COPY]: ChecklistService.copySections,
    [MOVE]: ChecklistService.moveSection
  },
  [TASK]: {
    [GET]: ChecklistService.getTaskDetails,
    [ADD]: ChecklistService.createTask,
    [COPY]: ChecklistService.copyTasks,
    [REMOVE]: ChecklistService.deleteTask,
    [UPDATE]: ChecklistService.modifyTask,
    [MOVE]: ChecklistService.moveTask
  },
  [LEVEL]: {
    [GET]: ChecklistService.getLevels
  }
};

const OPERATIONS_SAGA_MAP = {
  [COPY]: copyEntity,
  [ADD]: addEntity,
  [REMOVE]: removeEntity,
  [UPDATE]: updateEntity,
  [SELECT]: localUpdates,
  [EXPAND]: localUpdates,
  [MOVE]: moveEntity
};

function* getContext() {
  const {
    checklist: {
      build: { levels = {} },
      details: {
        staticData: { id: moduleId },
        series: { id: seriesId }
      },
      mixpanel
    }
  } = yield select();
  let level = getActiveLevel(levels);
  let levelId = level.data && level.data.id;
  return {
    moduleId,
    seriesId,
    levelId,
    mixpanel
  };
}

function* markTaskSelect({ levelId }) {
  const {
    checklist: {
      build: { levels: levelsMap, sections, tasks }
    }
  } = yield select();
  const { sections: sectionIds = [] } = levelsMap[levelId];
  const updatedTasks = {};
  sectionIds.forEach(sectionId => {
    if (sections[sectionId].selected) {
      const taskIds = sections[sectionId].tasks || [];
      taskIds.forEach(taskId => {
        updatedTasks[taskId] = {
          ...tasks[taskId],
          selected: true
        };
      });
    }
  });
  yield call(updateMultiple, { tasks: updatedTasks });
}

function* updateScore() {
  const {
    checklist: {
      build: { tasks = {}, levels = {}, sections = {} },
      details: {
        staticData: { maxScore: oldMaxScore }
      }
    }
  } = yield select();
  if (isEmpty(tasks)) return;

  let maxScore = 0;
  const { levelId } = yield getContext();
  const levelDetails = levels[levelId] || {};
  const sectionIds = levelDetails.sections || [];
  sectionIds.forEach(sectionId => {
    const sectionDetails = sections[sectionId] || {};
    const taskIds = sectionDetails.tasks || [];
    taskIds.forEach(taskId => {
      const { data: { maxScore: taskMaxScore = 0 } = {} } = tasks[taskId] || {};
      maxScore += taskMaxScore || 0;
    });
  });

  if (oldMaxScore !== maxScore) yield put(getActions(UPDATE_STATIC)({ maxScore }));
}

function* updateMultiple({ sections = {}, tasks = {}, levels = {}, staticData = {} }) {
  if (!isEmpty(staticData)) {
    yield put(getActions(UPDATE_STATIC)({ ...staticData }));
  }

  if (!isEmpty(levels)) {
    yield put(getActions(UPDATE_LEVELS)({ ...levels }));
    yield put(
      getActions(HANDLE_UNPUBLISHED_CHANGES_FLAG)({
        hasChanges: true
      })
    );
  }

  if (!isEmpty(sections)) {
    yield put(getActions(UPDATE_SECTIONS)(sections));
    yield updateScore();
  }

  if (!isEmpty(tasks)) {
    yield put(getActions(UPDATE_TASKS)(tasks));
    yield updateScore();
  }
}

function getNewEntityId(mapping, key) {
  if (isString(mapping[key])) return getNewEntityId(mapping, mapping[key]);
  return key;
}

function* updateId(node = {}, type) {
  const { data: { id: entityId } = {} } = node;
  if (!isObject(node) || !entityId) return node;

  const {
    checklist: { build: { tasks = {}, sections = {} } = {} }
  } = yield select();
  switch (type) {
    case TASK:
      node.data.id = getNewEntityId(tasks, entityId);
      break;
    case SECTION:
      node.data.id = getNewEntityId(sections, entityId);
  }
  return node;
}

function* getLevels({ moduleId, seriesId }) {
  const levels = yield call(ENTITY_TYPE_SERVICE_MAP[LEVEL][GET], {
    moduleId,
    seriesId
  });
  yield put(getActions(UPDATE_LEVELS)({ ...levels }));
  return levels;
}

/*** donot remove may be required in future  ***/

// function getSectionsIds({ levels }) {
//   let sectionIds = [];
//   for (const level of Object.entries(levels)) {
//     const { sections: levelSections = [] } = level[1];
//     sectionIds = sectionIds.concat(
//       levelSections.reduce((result, sectionIds) => {
//         result = result.concat(sectionIds);
//         return result;
//       }, [])
//     );
//   }
//   return sectionIds;
// }

// function* getSectionDetails({ moduleId, seriesId, sectionsIds }) {
//   if (!sectionsIds.length) return;
//   const sections = yield call(ENTITY_TYPE_SERVICE_MAP[SECTION][GET], {
//     moduleId,
//     sectionsIds,
//     seriesId
//   });
//   yield put(getActions(UPDATE_SECTIONS)({ ...sections }));
// }

// function getTaskIds({ sections = {} }) {
//   let taskIds = [];
//   for (const section of Object.entries(sections)) {
//     const { tasks: sectionTasks = [] } = section[1];
//     taskIds = taskIds.concat(
//       sectionTasks.reduce((result, taskId) => {
//         result = result.concat(taskId);
//         return result;
//       }, [])
//     );
//   }
//   return taskIds;
// }

// function* getTaskDetails({ moduleId, seriesId, taskIds }) {
//   if (!taskIds.length) return;
//   const tasks = yield call(ENTITY_TYPE_SERVICE_MAP[TASK][GET], {
//     moduleId,
//     taskIds,
//     seriesId
//   });

//   yield put(getActions(UPDATE_TASKS)({ ...tasks }));
//   return tasks;
// }

/*** donot remove may be required in future  ***/

function* getSectionDetailsByLevelId({ moduleId, seriesId, levelId }) {
  if (!levelId) return;
  const sections = yield call(ENTITY_TYPE_SERVICE_MAP[SECTION][GET], {
    moduleId,
    levelId,
    seriesId
  });
  yield put(getActions(UPDATE_SECTIONS)({ ...sections }));
}

function* getTaskDetailsByLevelId({ moduleId, seriesId, levelId }) {
  if (!levelId) return;
  const tasks = yield call(ENTITY_TYPE_SERVICE_MAP[TASK][GET], {
    moduleId,
    levelId,
    seriesId
  });

  yield put(getActions(UPDATE_TASKS)({ ...tasks }));
  return tasks;
}

function* addDummySection(params) {
  const response = yield call(ENTITY_TYPE_SERVICE_MAP[SECTION][ADD], {
    ...params,
    node: {
      data: { name: TREE_NODE_DEFAULT[0].defaultValue, displayIndex: 0 }
    }
  });
  yield updateMultiple(response);
}

function* updateShowSection({ type, showSections, ...params }) {
  if (type == SECTION) {
    const staticData = yield call(ENTITY_TYPE_SERVICE_MAP[STATIC][UPDATE], {
      ...params,
      data: { showSections: !!showSections }
    });
    yield updateMultiple({ staticData });
  }
}

function* copyEntity({ type, ...params }) {
  const {
    checklist: {
      build: { tasks: tasksMap }
    }
  } = yield select();
  let response = {};
  let context = {};
  let maxDisplayIndex = 0;
  switch (type) {
    case TASK: // eslint-disable-line no-case-declarations
      let sectionId;
      params.node = params.node.processIds.map(id => {
        params.sectionId = tasksMap[id].sectionId || sectionId;
        sectionId = params.sectionId;
        const taskData = tasksMap[id] && tasksMap[id].data;
        maxDisplayIndex = Math.max(maxDisplayIndex, taskData.displayIndex);
        return taskData;
      });
      params.node = params.node.map((data, index) => {
        data.displayIndex = maxDisplayIndex + index + 1;
        return data;
      });
      response = yield call(ENTITY_TYPE_SERVICE_MAP[type][COPY], params);
      yield updateMultiple(response);

      break;
    case SECTION:
      response = yield call(ENTITY_TYPE_SERVICE_MAP[type][COPY], params);
      yield updateMultiple(response);
      context = yield getContext();
      yield call(getTaskDetailsByLevelId, {
        ...params,
        ...context
      });
      yield call(markTaskSelect, context);
      break;
  }
}

function* moveEntity({
  type,
  moduleId,
  levelId,
  seriesId,
  data: {
    sourceParent: { data: { id: sourceParentId } = {} } = {},
    destParent: { data: { id: destParentId } = {} } = {},
    node,
    index
  }
}) {
  if (type == SECTION) {
    sourceParentId = levelId;
    destParentId = levelId;
  } else {
    const {
      checklist: {
        build: { levels }
      }
    } = yield select();
    const sectionId = getActiveLevel(levels).sections[0];
    sourceParentId = sourceParentId || sectionId;
    destParentId = destParentId || sectionId;
  }
  const params = {
    moduleId,
    seriesId,
    sourceParentId,
    destParentId,
    node,
    index
  };
  const response = yield call(ENTITY_TYPE_SERVICE_MAP[type][MOVE], params);
  yield updateMultiple(response);
  return response;
}

function* addEntity({ type, ...params }) {
  const {
    checklist: {
      build: { levels: levelsMap },
      details: {
        staticData: { showSections }
      }
    }
  } = yield select();
  const { sections } = levelsMap[params.levelId];

  switch (type) {
    case TASK:
      if (!sections.length) {
        yield call(addDummySection, params);
        const {
          checklist: {
            build: { levels: levelsMap }
          }
        } = yield select();
        const { sections } = getActiveLevel(levelsMap);
        params = {
          ...params,
          sectionId: sections[0]
        };
      }
      break;
    case SECTION:
      if (!showSections) {
        yield call(updateShowSection, { ...params, type, showSections: true });
        if (sections.length) return sections;
      }
      break;
  }
  const response = yield call(ENTITY_TYPE_SERVICE_MAP[type][ADD], params);
  yield updateMultiple(response);
  return type == TASK ? Object.keys(response.tasks) : Object.keys(response.sections);
}

function* removeEntity({ type, ...params }) {
  const response = yield call(ENTITY_TYPE_SERVICE_MAP[type][REMOVE], params);
  yield updateMultiple(response);
  const {
    checklist: {
      build: { levels: levelsMap }
    }
  } = yield select();
  const { sections } = getActiveLevel(levelsMap);
  if (!sections.length) {
    yield call(updateShowSection, { type, showSections: false, ...params });
  }
  return response;
}

function* updateEntity({ type, node = {}, ...params }) {
  const updatedNode = yield call(updateId, node, type);
  let response = yield call(ENTITY_TYPE_SERVICE_MAP[type][UPDATE], {
    ...params,
    node: updatedNode,
    data: updatedNode
  });
  if (type == STATIC) response = { staticData: { ...response } };
  yield updateMultiple(response);
}

function* localUpdates(params) {
  let response = { ...params.node };
  yield updateMultiple(response);
}

function* getData() {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: GET_CHECKLIST_BUILD_DATA,
    options: {
      async: true
    }
  });
  try {
    const { moduleId, seriesId, mixpanel } = yield getContext();
    const levels = yield call(getLevels, { moduleId, seriesId });
    const { data: { id: levelId } = {}, sections = [] } = getActiveLevel(levels);
    if (sections.length) {
      yield all([
        getSectionDetailsByLevelId({
          moduleId,
          seriesId,
          levelId
        }),
        getTaskDetailsByLevelId({
          moduleId,
          seriesId,
          levelId
        })
      ]);
    }
    yield put(SUCCESS({ mixpanel }));
  } catch (error) {
    yield put(FAIL(error, { globalError: true }));
  }
}

function* manageData({ payload: { sectionId, type, operation, ...node } }) {
  const { SUCCESS, FAIL } = getActions({
    name: MANIPULATE_BUILD_DATA,
    options: { async: true }
  });
  try {
    const { moduleId, seriesId, levelId, mixpanel } = yield getContext();
    const params = { moduleId, levelId, sectionId, seriesId, node, data: node };
    const response = yield call(OPERATIONS_SAGA_MAP[operation], {
      ...params,
      type
    });
    yield put(SUCCESS({ data: { operation, type, response, mixpanel } }));
  } catch (error) {
    yield put(FAIL({ error, operation }));
  }
}

function* handleLoad() {
  yield takeEvery(GET_CHECKLIST_BUILD_DATA, getData);
}

function* handleOperation() {
  yield takeEvery(MANIPULATE_BUILD_DATA, manageData);
}

export default function*() {
  yield all([handleLoad(), handleOperation()]);
}

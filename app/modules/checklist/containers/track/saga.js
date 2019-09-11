import { put, takeEvery, call, all, select } from "redux-saga/effects";

import { reload } from "@utils";
import { createPollingSaga, getActions } from "@core/helpers";
import { getUserProfileUrl } from "@utils/generateUrls";
import { POLLING_STATUS } from "@config/global.config";

import {
  TRACK_UPDATE_IN_PROGRESS_LEARNERS,
  TRACK_UPDATE_COMPLETED_LEARNERS,
  TRACK_POLLING,
  TRACK_UPDATE_ADDED_LEARNERS,
  TRACK_UPDATE_ALL_LEARNERS,
  TRACK_GET_DATA,
  TRACK_MANIPULATE_DATA,
  TRACK_UPDATE_SEARCH_LEARNERS,
  TRACK_UPDATE_LEARNERS_DETAILS,
  TRACK_UPDATE_GROUPS,
  TRACK_UPDATE_LEARNER_COUNT
} from "../../actionTypes";

import ChecklistTrackService from "../../api/track";

import {
  OPERATIONS,
  DEFAULT_LEARNERS_TYPE,
  LEARNER_TYPES,
  SUPPORTED_FILTERS,
  DEFAULT_PAGINATION,
  RESET_PROGRESS_VALUES,
  DEFAULT_LEARNERS_SORT,
  LEARNER_TYPE_STORE_KEYS,
  LEARNER_TYPE_FILTER_VALUES
} from "../../config/track.constants";

const {
  SORT_LEARNERS,
  SEARCH_LEARNERS,
  PAGINATE_LEARNERS,
  GET_LEARNERS,
  REMOVE_LEARNERS,
  RESET_PROGRESS,
  VIEW_LEARNER_PROFILE,
  CHANGE_RELEVANCE
} = OPERATIONS;

const LEARNER_TYPE_ACTION_MAP = {
  [LEARNER_TYPES.ALL]: TRACK_UPDATE_ALL_LEARNERS,
  [LEARNER_TYPES.IN_PROGRESS]: TRACK_UPDATE_IN_PROGRESS_LEARNERS,
  [LEARNER_TYPES.COMPLETED]: TRACK_UPDATE_COMPLETED_LEARNERS,
  [LEARNER_TYPES.ADDED]: TRACK_UPDATE_ADDED_LEARNERS
};

const { SUCCESS: POLLING_SUCCESS, FAIL: POLLING_FAIL } = getActions({
  name: TRACK_POLLING,
  options: { async: true }
});

function* getContext() {
  const {
    checklist: {
      details: {
        staticData: { id: moduleId, companyId },
        series: { id: seriesId }
      },
      mixpanel
    }
  } = yield select();
  return {
    moduleId,
    seriesId,
    companyId,
    mixpanel
  };
}

function* resetLearnerByType() {
  const learnerActionTypes = Object.values(LEARNER_TYPE_ACTION_MAP);
  for (let i = 0; i < learnerActionTypes.length; i++) {
    yield put(getActions(learnerActionTypes[i])());
  }
}

function* updateProgress(learnerIds) {
  const {
    checklist: {
      track: { learners = {} }
    }
  } = yield select();
  const updatedLearners = {};
  learnerIds.forEach(id => {
    if (learners[id]) {
      updatedLearners[id] = {
        ...learners[id],
        ...RESET_PROGRESS_VALUES(learners[id].status)
      };
    }
  });
  yield put(getActions(TRACK_UPDATE_LEARNERS_DETAILS)(updatedLearners));
}

function* updateLocalRelevance({ learnerIds, moduleRelevance }) {
  const {
    checklist: {
      track: { learners = {} }
    }
  } = yield select();
  const updatedLearners = {};
  learnerIds.forEach(id => {
    if (learners[id]) {
      updatedLearners[id] = {
        ...learners[id],
        moduleRelevance: moduleRelevance
      };
    }
  });
  yield put(getActions(TRACK_UPDATE_LEARNERS_DETAILS)(updatedLearners));
}

function* getStoreDataByLearnerType(type) {
  const {
    checklist: {
      track: { [LEARNER_TYPE_STORE_KEYS[type]]: { data = [] } = {} }
    }
  } = yield select();
  return data;
}

function* updateStoreAfterDelete({ ids: removedLearnerIds, type, params }) {
  let learners = yield call(getStoreDataByLearnerType, type);
  learners = learners.subtract(removedLearnerIds);
  yield put(getActions(LEARNER_TYPE_ACTION_MAP[type])({ data: learners }));
  yield getLearnersSummary();
  yield getLearners({ type, params });
}

function* checkDataAvailable({ type, start, rows, filtered }) {
  if (filtered || !type) return false;
  const {
    checklist: {
      track: { counts }
    }
  } = yield select();
  const totalCount = counts[LEARNER_TYPE_STORE_KEYS[type]].count;
  const availableLearner = yield getStoreDataByLearnerType(type);
  const availableCount = availableLearner.length;
  return start < availableCount && (availableCount == totalCount || availableCount - start >= rows);
}

function* resetProgress({ learnerIds, type, ...params }) {
  if (learnerIds && learnerIds.length) {
    const response = yield call(ChecklistTrackService.resetProgress, {
      learnerIds,
      type,
      ...params
    });
    yield call(getLearnersSummary);
    yield call(updateProgress, response);
  }
}

function* changeRelevance({ learnerIds, moduleRelevanceSelection, ...params }) {
  if (learnerIds && learnerIds.length) {
    const processId = yield call(ChecklistTrackService.changeRelevance, {
      learnerIds,
      moduleRelevanceSelection,
      ...params
    });

    yield put(
      getActions(TRACK_POLLING)({
        processId,
        reqLearnerIds: learnerIds,
        moduleRelevance: moduleRelevanceSelection,
        ...params
      })
    );
  }
}

function* checkPollingStatus({
  processId,
  companyId,
  type,
  operation,
  reqLearnerIds,
  moduleRelevance,
  ...params
}) {
  const { status, successIds, errorIds } = yield call(ChecklistTrackService.pollStatus, {
    processId,
    companyId
  });
  switch (status) {
    case POLLING_STATUS.FAILED:
      yield put(POLLING_FAIL({ data: { errorIds } }));
      break;
    case POLLING_STATUS.SUCCESS: //eslint-disable-line no-case-declarations
      const { mixpanel } = yield getContext();
      if (operation === OPERATIONS.CHANGE_RELEVANCE) {
        yield updateLocalRelevance({
          learnerIds: reqLearnerIds,
          moduleRelevance: moduleRelevance
        });
      } else {
        yield updateStoreAfterDelete({
          ids: successIds,
          type,
          params: { ...params, companyId }
        });
      }

      yield put(
        POLLING_SUCCESS({
          data: {
            successIds,
            errorIds,
            operation,
            response: { successIds },
            mixpanel
          }
        })
      );
      break;
  }
}

function* removeLearners({ learnerIds, ...rest }) {
  if (learnerIds && learnerIds.length) {
    const processId = yield call(ChecklistTrackService.removeLearners, {
      learnerIds,
      ...rest
    });
    yield put(getActions(TRACK_POLLING)({ processId, ...rest }));
  }
}

function* updateMultiple({ operation, type, learnerIds = [], learnerDetails = {}, filtered }) {
  const actionType = LEARNER_TYPE_ACTION_MAP[type];
  const existingLearners = yield getStoreDataByLearnerType(type);

  const updatedLearnerIds =
    operation == PAGINATE_LEARNERS ? [...existingLearners, ...learnerIds] : learnerIds;

  if (!filtered) {
    yield put(getActions(actionType)({ data: updatedLearnerIds }));
  }
  yield put(getActions(TRACK_UPDATE_LEARNERS_DETAILS)(learnerDetails));
  yield put(getActions(TRACK_UPDATE_SEARCH_LEARNERS)({ data: learnerIds }));
  return;
}

function* getAsyncLearners({ type, params }) {
  const {
    filters = [],
    pagination = DEFAULT_PAGINATION,
    sort = DEFAULT_LEARNERS_SORT,
    ...rest
  } = params;
  const { learnerIds, learnerDetails } = yield call(ChecklistTrackService.getLearners, {
    pagination,
    sort,
    filters: [
      {
        type: SUPPORTED_FILTERS.LEARNER_TYPE,
        value: LEARNER_TYPE_FILTER_VALUES[type]
      },
      ...filters
    ],
    ...rest
  });
  yield updateMultiple({
    type,
    learnerIds,
    learnerDetails,
    ...params
  });
}

function* getLocalLearners({ type, params }) {
  const {
    pagination: { start, rows }
  } = params;
  const existingLearners = yield getStoreDataByLearnerType(type);
  const learners = existingLearners.slice(start, start + rows);

  yield updateMultiple({
    type,
    learnerIds: learners,
    ...params
  });
}

function* getLearnersSummary() {
  const context = yield getContext();
  const learnersCount = yield call(ChecklistTrackService.getLearnersCount, {
    ...context
  });
  yield put(getActions(TRACK_UPDATE_LEARNER_COUNT)({ ...learnersCount }));
}

function* getGroups() {
  const context = yield getContext();
  const groups = yield call(ChecklistTrackService.getGroups, {
    ...context
  });
  yield put(getActions(TRACK_UPDATE_GROUPS)({ data: groups }));
}

function* getData({ payload: { type = DEFAULT_LEARNERS_TYPE, ...rest } = {} }) {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: TRACK_GET_DATA,
    options: {
      async: true
    }
  });
  try {
    const context = yield getContext();
    const params = {
      ...context,
      ...rest
    };
    yield getGroups();
    yield getLearnersSummary();
    yield getAsyncLearners({ type, params });
    yield put(SUCCESS());
  } catch (error) {
    yield put(FAIL(error, { globalError: false }));
  }
}

function* getLearners({ type, params }) {
  const dataAvailable = yield call(checkDataAvailable, {
    ...params.pagination,
    type,
    filtered: params.filtered
  });
  if (dataAvailable) {
    yield getLocalLearners({ type, params });
  } else {
    yield getAsyncLearners({ type, params });
  }
}

function* manageTrackDetails({
  payload: {
    operation,
    filters = [],
    type,
    sort = DEFAULT_LEARNERS_SORT,
    pagination = DEFAULT_PAGINATION,
    learnerIds = [],
    moduleRelevanceSelection
  }
}) {
  const { SUCCESS, FAIL } = getActions({
    name: TRACK_MANIPULATE_DATA,
    options: { async: true }
  });
  try {
    const { moduleId, seriesId, companyId, mixpanel } = yield getContext();
    const params = {
      operation,
      moduleId,
      seriesId,
      companyId,
      filters,
      filtered: !!filters.length,
      sort,
      pagination,
      moduleRelevanceSelection
    };
    params.pagination = operation === GET_LEARNERS ? DEFAULT_PAGINATION : params.pagination;
    switch (operation) {
      case SORT_LEARNERS:
        yield* resetLearnerByType();
        yield getAsyncLearners({ type, params });
        break;
      case GET_LEARNERS:
      case SEARCH_LEARNERS:
      case PAGINATE_LEARNERS:
        yield getLearners({ type, params });
        break;
      case RESET_PROGRESS:
        yield resetProgress({ type, learnerIds, ...params });
        break;
      case REMOVE_LEARNERS:
        yield removeLearners({ type, learnerIds, ...params });
        break;
      case VIEW_LEARNER_PROFILE:
        yield call(reload, getUserProfileUrl(learnerIds[0]));
        break;
      case CHANGE_RELEVANCE:
        yield changeRelevance({
          type,
          learnerIds,
          moduleRelevanceSelection,
          ...params
        });
        break;
    }
    yield put(
      SUCCESS({
        data: { operation, type, postData: { filters, learnerIds }, mixpanel }
      })
    );
  } catch (error) {
    yield put(FAIL({ error, operation }));
  }
}

function* handleLoad() {
  yield takeEvery(TRACK_GET_DATA, getData);
}
function* handleOperations() {
  yield takeEvery(TRACK_MANIPULATE_DATA, manageTrackDetails);
}

export default function*() {
  yield all([
    handleLoad(),
    handleOperations(),
    createPollingSaga(TRACK_POLLING, checkPollingStatus)()
  ]);
}

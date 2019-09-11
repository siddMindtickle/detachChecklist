import { put, takeEvery, call, all, select } from "redux-saga/effects";

import { getActions } from "@core/helpers";

import {
  LOAD_DATA,
  GET_PUBLISH_DATA,
  GET_FULL_LEARNERS,
  GET_SELECTED_LEARNERS,
  GET_ALL_LEARNERS,
  UPDATE_LEARNERS,
  UPDATE_GROUPS,
  UPDATE_PROFILE_FIELDS,
  GET_PROFILE_KEY_DATA,
  MANIPULATE_PUBLISH_DATA,
  UPDATE_SEARCH_LEARNERS,
  UPDATE_ALL_LEARNERS,
  UPDATE_FULL_LEARNERS,
  UPDATE_SELECTED_LEARNERS,
  PUBLISH_DATA,
  SET_CONTEXT
} from "./actionTypes";
import {
  LEARNER_TYPES,
  OPERATIONS,
  GROUPS_TO_FETCH,
  LEARNERS_TO_FETCH,
  LEARNERS_START
} from "./config/constants";

import PublishService from "./api/publish";
import { isEmpty } from "@utils";

const LEARNERS_CONFIG = {
  [LEARNER_TYPES.ALL]: {
    action: GET_ALL_LEARNERS,
    apiFunc: PublishService.getAllLearners,
    updateAction: UPDATE_ALL_LEARNERS,
    storeKey: "allLearners"
  },
  [LEARNER_TYPES.FULL]: {
    action: GET_FULL_LEARNERS,
    apiFunc: PublishService.getFullLearners,
    updateAction: UPDATE_FULL_LEARNERS,
    storeKey: "fullLearners"
  },
  [LEARNER_TYPES.SELECTED]: {
    action: GET_SELECTED_LEARNERS,
    apiFunc: PublishService.getSelectedLearners,
    updateAction: UPDATE_SELECTED_LEARNERS,
    storeKey: "selectedLearners"
  }
};

const checkIfFiltersApplied = filters =>
  Object.values(filters).every(filter => {
    if (Array.isArray(filter)) {
      return !filter.length;
    }
    return !filter;
  });

function* getContext() {
  const {
    publishDraft: { context }
  } = yield select();
  return context;
}

function* getTodosCount(context) {
  const data = yield call(PublishService.getTodos, context);
  return data;
}

function* getInvitedLearnersCount(context) {
  const data = yield call(PublishService.getInvitedLearnersCount, context);
  return data;
}

function* loadData({ payload: context }) {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: LOAD_DATA,
    options: { async: true }
  });

  try {
    yield put(getActions(SET_CONTEXT)(context));
    const learnersCount = yield getInvitedLearnersCount(context);
    const todosCount = yield getTodosCount(context);
    yield put(
      SUCCESS({
        learners: learnersCount,
        todos: todosCount
      })
    );
  } catch (error) {
    yield put(FAIL(error, { globalError: true }));
  }
}

function* getGroups() {
  const context = yield getContext();
  const groups = yield call(PublishService.getGroups, {
    ...context,
    start: 0,
    count: GROUPS_TO_FETCH
  });
  yield put(getActions(UPDATE_GROUPS)({ data: groups }));
}

function* getProfileFields() {
  const context = yield getContext();
  const profileFields = yield call(PublishService.getProfileFields, context);
  yield put(getActions(UPDATE_PROFILE_FIELDS)({ data: profileFields }));
}

function* getResources(type) {
  yield getGroups();
  if (type === LEARNER_TYPES.SELECTED) {
    yield getProfileFields();
  }
}

function* getData({ payload: { type: learnerType } }) {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: GET_PUBLISH_DATA,
    options: { async: true }
  });

  try {
    let data = yield getLearnersByType(learnerType);
    if (isEmpty(data)) {
      yield getResources(learnerType);
      data = yield call(getLearners, { type: learnerType });
      yield updateMultiple({
        response: data,
        type: learnerType
      });
    } else {
      yield put(getActions(UPDATE_SEARCH_LEARNERS)(data));
    }
    yield put(SUCCESS());
  } catch (error) {
    yield put(FAIL(error));
  }
}

function* getLearners({ type, start = LEARNERS_START, ...rest }) {
  const { apiFunc } = LEARNERS_CONFIG[type];
  const context = yield getContext();
  const { learners, ...response } = yield call(apiFunc, {
    ...context,
    start,
    count: LEARNERS_TO_FETCH,
    ...rest
  });

  yield put(
    getActions(UPDATE_LEARNERS)({
      ...learners
    })
  );

  return response;
}

function* getProfileKeyData({ payload: { profileField } }) {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: GET_PROFILE_KEY_DATA,
    options: { async: true }
  });

  try {
    const context = yield getContext();
    const data = yield call(PublishService.getProfileKeyData, {
      ...context,
      profileField
    });
    yield put(
      SUCCESS({
        data: {
          [profileField]: data
        }
      })
    );
  } catch (error) {
    yield put(FAIL(error));
  }
}

function* getLearnersByType(type) {
  const storeKey = LEARNERS_CONFIG[type].storeKey;
  const {
    publishDraft: { [storeKey]: data = {} }
  } = yield select();
  return data;
}

function* updateMultiple({
  response = { data: [], total: 0 },
  noFiltersApplied = true,
  operation = OPERATIONS.UPDATE,
  start = LEARNERS_START,
  type
}) {
  const { updateAction } = LEARNERS_CONFIG[type];
  let dataToPass = {
    data: response.data,
    total: response.total,
    hasMore: response.total > start + LEARNERS_TO_FETCH
  };
  let replace;

  switch (operation) {
    case OPERATIONS.UPDATE:
    case OPERATIONS.LOAD_MORE:
      if (noFiltersApplied) {
        yield put(getActions(updateAction)(dataToPass));
      }
      break;
    case OPERATIONS.SEARCH:
      if (noFiltersApplied) {
        dataToPass = yield getLearnersByType(type);
      }
      replace = true;
      break;
  }
  yield put(getActions(UPDATE_SEARCH_LEARNERS)(dataToPass, { replace }));
}

function* manipulateData({ payload: { operation = OPERATIONS.UPDATE, type, ...rest } }) {
  const { SUCCESS, FAIL } = getActions({
    name: MANIPULATE_PUBLISH_DATA,
    options: { async: true }
  });

  try {
    const { search, start = LEARNERS_START, groupIds, profileFields } = rest;
    let noFiltersApplied, response;
    switch (operation) {
      case OPERATIONS.SEARCH:
        noFiltersApplied = checkIfFiltersApplied({
          search,
          groupIds,
          profileFields
        });
      case OPERATIONS.UPDATE: //eslint-disable-line no-fallthrough
      case OPERATIONS.LOAD_MORE:
        if (!noFiltersApplied) {
          response = yield getLearners({
            type,
            start,
            query: search,
            groupIds,
            profileFields
          });
        }
    }

    yield updateMultiple({
      response,
      noFiltersApplied,
      operation,
      start,
      type
    });
    yield put(SUCCESS({ data: { operation, type } }));
  } catch (error) {
    yield put(FAIL({ ...error, operation, type }));
  }
}

function* publishData({ payload: options }) {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: PUBLISH_DATA,
    options: { async: true }
  });

  try {
    const context = yield getContext();
    const response = yield call(PublishService.publishData, {
      ...context,
      ...options
    });
    yield put(SUCCESS({ data: { ...response, postData: options, context } }));
  } catch (error) {
    yield put(FAIL({ ...error }));
  }
}

function* handlePublishData() {
  yield takeEvery(PUBLISH_DATA, publishData);
}

function* handleLoad() {
  yield takeEvery(LOAD_DATA, loadData);
}

function* handleGetData() {
  yield takeEvery(GET_PUBLISH_DATA, getData);
}

function* handleOperation() {
  yield takeEvery(MANIPULATE_PUBLISH_DATA, manipulateData);
}

function* handleGetProfileKeyData() {
  yield takeEvery(GET_PROFILE_KEY_DATA, getProfileKeyData);
}

export default function*() {
  yield all([
    handleLoad(),
    handleGetData(),
    handleOperation(),
    handleGetProfileKeyData(),
    handlePublishData()
  ]);
}

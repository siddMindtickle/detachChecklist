import { put, takeEvery, call, all, select } from "redux-saga/effects";

import { getActions } from "@core/helpers";

import { DRAFT_VERSION_DETAILS, OPERATIONS } from "./config/constants";

import {
  GET_PUBLISH_HISTORY,
  UPDATE_PUBLISH_SUMMARY,
  MANIPULATE_DATA,
  SET_CONTEXT
} from "./actionTypes";
import PublishHistoryService from "./api/publishHistory";
import { getLatestVersion } from "./utils";
const {
  DISCARD,
  PUBLISH,
  GET_SUMMARY,
  GET_HISTORY,
  GET_TODOS,
  GET_INVITED_LEARNER_COUNT
} = OPERATIONS;

const OPERATION_SERVICE_MAP = {
  [DISCARD]: PublishHistoryService.discardChanges,
  [PUBLISH]: PublishHistoryService.publishChanges,
  [GET_SUMMARY]: PublishHistoryService.getSummary,
  [GET_HISTORY]: PublishHistoryService.getHistory,
  [GET_INVITED_LEARNER_COUNT]: PublishHistoryService.getInvitedLearnersCount,
  [GET_TODOS]: PublishHistoryService.getTodos
};

const getCompareVersion = ({ version, publishHistory }) => {
  if (version == DRAFT_VERSION_DETAILS.version) {
    return getLatestVersion(publishHistory);
  }
  const versionDetails = publishHistory.filter(details => {
    return details.version == version;
  })[0];
  return versionDetails && versionDetails.prevVersion;
};

function* getInvitedLearnersCount({ moduleId, seriesId, companyId }) {
  const response = yield call(OPERATION_SERVICE_MAP[GET_INVITED_LEARNER_COUNT], {
    moduleId,
    companyId,
    seriesId
  });
  return response;
}

function* getTodos({ moduleId, companyId, seriesId }) {
  const response = yield call(OPERATION_SERVICE_MAP[GET_TODOS], {
    moduleId,
    companyId,
    seriesId
  });
  return response;
}

function* updateSummary({ moduleId, seriesId, newVersion, oldVersion }) {
  const {
    modulePublishHistory: { summary = {} }
  } = yield select();

  if (newVersion == DRAFT_VERSION_DETAILS.version || !summary[newVersion]) {
    const data = yield call(OPERATION_SERVICE_MAP[GET_SUMMARY], {
      moduleId,
      seriesId,
      newVersion,
      oldVersion
    });
    yield put(
      getActions(UPDATE_PUBLISH_SUMMARY)({
        [newVersion]: data
      })
    );
  }
}

function* getPublishHistory({ payload: { moduleId, seriesId, companyId, moduleType } }) {
  const { SUCCESS, FAIL } = getActions({
    name: GET_PUBLISH_HISTORY,
    options: { async: true }
  });
  const params = {
    moduleId,
    seriesId,
    companyId,
    moduleType
  };
  try {
    let learnerCounts, todos;
    yield put(getActions(SET_CONTEXT)(params));
    const history = yield call(OPERATION_SERVICE_MAP[GET_HISTORY], params);
    if (history.hasChanges) {
      learnerCounts = yield call(getInvitedLearnersCount, params);
      todos = yield call(getTodos, params);
    }
    yield put(SUCCESS({ data: { ...history, learnerCounts, todos } }));
  } catch (error) {
    yield put(FAIL(error, { globalError: true }));
  }
}

function* manageData({ payload: { operation, moduleId, seriesId, companyId, version, ...rest } }) {
  const { SUCCESS, FAIL } = getActions({
    name: MANIPULATE_DATA,
    options: { async: true }
  });
  const params = {
    moduleId,
    seriesId,
    companyId,
    newVersion: version,
    data: rest
  };
  try {
    const {
      modulePublishHistory: { history: { data: { versions: publishHistory } = {} } = {}, context }
    } = yield select();
    switch (operation) {
      case GET_SUMMARY:
        params.oldVersion = getCompareVersion({
          version,
          publishHistory
        });
        yield call(updateSummary, params);
        break;
      case DISCARD:
      case PUBLISH:
        yield call(OPERATION_SERVICE_MAP[operation], params);
        break;
    }
    yield put(SUCCESS({ data: { operation, postData: rest, context } }));
  } catch (error) {
    yield put(FAIL(error, { globalError: true }));
  }
}

function* handleOperation() {
  yield takeEvery(MANIPULATE_DATA, manageData);
}

function* handleGetPublishHistory() {
  yield takeEvery(GET_PUBLISH_HISTORY, getPublishHistory);
}

export default function*() {
  yield all([handleGetPublishHistory(), handleOperation()]);
}

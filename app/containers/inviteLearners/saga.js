import { put, takeEvery, call, all, select, take, race, delay } from "redux-saga/effects";
import { resetPagePerformanceData } from "@utils";
import getActions, { getLoadingActions } from "@core/helpers/createActions";

import {
  MANIPULATE_INVITE,
  MANIPULATE_INVITE_NEW,
  MANIPULATE_INVITE_EXISTING,
  INITIAL_INVITE_EXISTING,
  UPDATE_LEARNERS,
  UPDATE_SEARCH_LEARNERS,
  INITIAL_INVITE_BY_UPLOAD,
  UPDATE_PROFILE_FIELDS,
  UPDATE_MANAGER_FIELDS,
  UPDATE_GROUPS,
  GET_PROFILE_KEY_DATA,
  INVITE_POLLING,
  INITIAL_INVITE_GROUP,
  SET_CONTEXT
} from "./actionTypes";
import {
  OPERATIONS as ALL_OPERATIONS,
  INVITE_TYPE,
  POLLING_DELAY,
  POLLING_STATUS,
  INVITE_TO
} from "./config/constants";
import InviteService from "./api/invite";

const LEARNERS_TO_FETCH = 20;
const LEARNERS_START = 0;
const GROUPS_START = 0;
const GROUPS_TO_FETCH = 1000;

const { SUCCESS: POLLING_SUCCESS, FAIL: POLLING_FAIL } = getActions({
  name: INVITE_POLLING,
  options: { async: true }
});

function* getContext() {
  const {
    moduleInvite: {
      inviteCommon: { context }
    }
  } = yield select();
  return context;
}

function* checkPollingStatus({ processIds = [], companyId }) {
  const { status, successIds, errorIds } = yield call(InviteService.pollStatus, {
    processId: processIds[0],
    companyId
  });
  resetPagePerformanceData();
  switch (status) {
    case POLLING_STATUS.FAILED:
      yield put(POLLING_FAIL({ data: { errorIds } }));
      break;
    case POLLING_STATUS.SUCCESS:
      yield put(POLLING_SUCCESS({ data: { successIds, errorIds } }));
      break;
  }
}

function* poll(params) {
  while (true) {
    yield call(delay, POLLING_DELAY);
    yield call(checkPollingStatus, params);
  }
}

function* fetchLearners({ replace, start = LEARNERS_START, ...rest }) {
  const context = yield getContext();
  const response = yield call(InviteService.getLearners, {
    ...context,
    start,
    count: LEARNERS_TO_FETCH,
    ...rest
  });
  yield put(
    getActions(UPDATE_LEARNERS)({
      ...response.learners
    })
  );
  yield put(
    getActions(UPDATE_SEARCH_LEARNERS)(
      {
        data: response.ids,
        total: response.total,
        hasMore: response.total > start + LEARNERS_TO_FETCH,
        start: start + LEARNERS_TO_FETCH
      },
      { replace }
    )
  );
}

function* getProfileFields(context) {
  const profileFields = yield call(InviteService.getProfileFields, context);
  yield put(getActions(UPDATE_PROFILE_FIELDS)({ data: profileFields }));
}

function* getManagerFields(context) {
  const managerFields = yield call(InviteService.getManagerFields, context);
  yield put(getActions(UPDATE_MANAGER_FIELDS)({ data: managerFields }));
}

function* getProfileKeyData({ payload: { profileField } }) {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: GET_PROFILE_KEY_DATA,
    options: { async: true }
  });

  try {
    const context = yield getContext();
    const data = yield call(InviteService.getProfileKeyData, {
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
    yield put(FAIL(error, { globalError: true }));
  }
}

function* getGroups(inviteToSeries) {
  const context = yield getContext();
  const response = yield call(InviteService.getGroups, {
    ...context,
    inviteToSeries,
    start: GROUPS_START,
    count: GROUPS_TO_FETCH
  });
  yield put(getActions(UPDATE_GROUPS)(response));
}

function* setInviteContext({ payload: context }) {
  yield put(getActions(SET_CONTEXT)(context));
}

/*** initial load handling for all types of invite ***/
function* handleInviteExistingInitial({ payload: { inviteToSeries, ...rest } = {} }) {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: INITIAL_INVITE_EXISTING,
    options: { async: true }
  });

  try {
    const context = yield getContext();
    yield getProfileFields(context);
    yield call(getGroups, inviteToSeries);
    yield fetchLearners({ inviteToSeries, ...rest });
    yield put(SUCCESS());
  } catch (error) {
    yield put(FAIL({ ...error }));
  }
}

function* handleInviteGroupInitial({ payload: { inviteToSeries } = {} }) {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: INITIAL_INVITE_GROUP,
    options: { async: true }
  });
  try {
    yield call(getGroups, inviteToSeries);
    yield put(SUCCESS());
  } catch (error) {
    yield put(FAIL({ ...error }));
  }
}

function* handleInviteByUploadInitial() {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: INITIAL_INVITE_BY_UPLOAD,
    options: { async: true }
  });

  try {
    const context = yield getContext();
    yield getProfileFields(context);
    yield getManagerFields(context);
    yield put(SUCCESS());
  } catch (error) {
    yield put(FAIL({ ...error }));
  }
}

/*** operation handling for all types of invite ***/
function* handleInviteExistingOperations({ payload: { operation, ...rest } }) {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: MANIPULATE_INVITE_EXISTING,
    options: { async: true }
  });
  const OPERATIONS = ALL_OPERATIONS[INVITE_TYPE.INVITE_EXISTING];

  try {
    const { start = LEARNERS_START, ...filters } = rest;
    yield fetchLearners({
      replace: operation === OPERATIONS.SEARCH,
      start,
      ...filters
    });
    yield put(SUCCESS({ data: { operation } }));
  } catch (error) {
    yield put(FAIL({ ...error, operation }));
  }
}

function* handleInviteNewOperations({ payload: { operation, ...rest } }) {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: MANIPULATE_INVITE_NEW,
    options: { async: true }
  });
  const OPERATIONS = ALL_OPERATIONS[INVITE_TYPE.ADD_INVITE_NEW];
  let response;

  try {
    const context = yield getContext();
    switch (operation) {
      case OPERATIONS.ADD_TO_LIST:
        response = yield call(InviteService.checkExistingLearner, {
          ...context,
          email: rest.email,
          name: rest.name
        });
        break;
      case OPERATIONS.GET_LEARNERS:
        yield fetchLearners(rest);
        break;
    }
    yield put(SUCCESS({ data: response, operation }));
  } catch (error) {
    yield put(FAIL({ ...error, operation }));
  }
}

function* handleInviteOperation({ payload: { operation, inviteToSeries, ...rest } }) {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: MANIPULATE_INVITE,
    options: { async: true }
  });
  const OPERATIONS = INVITE_TYPE;

  let response;
  let seriesEntities;
  const inviteType = inviteToSeries ? INVITE_TO.SERIES : INVITE_TO.MODULE;
  try {
    const context = yield getContext();
    switch (operation) {
      case OPERATIONS.INVITE_GROUP:
        response = yield call(InviteService.inviteGroups, {
          ...context,
          groups: rest.groups,
          ...rest,
          inviteToSeries
        });
        break;
      case OPERATIONS.INVITE_EXISTING:
        response = yield call(InviteService.inviteExisiting, {
          ...context,
          ...rest,
          inviteToSeries
        });
        break;
      case OPERATIONS.UPLOAD_LIST:
      case OPERATIONS.ADD_INVITE_NEW:
        seriesEntities = [
          {
            series: context.seriesId
          }
        ];
        if (!inviteToSeries) {
          seriesEntities[0]["entities"] = [context.moduleId];
        }
        response = yield call(InviteService.addToPlatform, {
          ...context,
          inviteToSeries,
          ...rest,
          learners: rest.learners.map(learner => ({
            ...learner,
            seriesEntities: seriesEntities
          }))
        });
        response.processIds = response.processIds.map(processId => {
          return `${processId}.${context.seriesId}${inviteToSeries ? "" : "." + context.moduleId}`;
        });
        break;
    }
    yield put(getActions(INVITE_POLLING)({ ...response, ...context }));
    yield put(SUCCESS({ data: { ...response, operation, context, type: inviteType } }));
  } catch (error) {
    yield put(FAIL({ ...error, operation }));
  }
}

function* handlePolling() {
  const { SUCCESS, FAIL } = getLoadingActions(INVITE_POLLING);
  yield takeEvery(INVITE_POLLING, function*({ payload }) {
    yield race([call(poll, { ...payload }), take(SUCCESS), take(FAIL)]);
  });
}

function* handleLoad() {
  yield take(SET_CONTEXT, setInviteContext);
}

function* handleGetProfileKeyData() {
  yield takeEvery(GET_PROFILE_KEY_DATA, getProfileKeyData);
}

function* initialLoadInviteGroups() {
  yield takeEvery(INITIAL_INVITE_GROUP, handleInviteGroupInitial);
}

function* initialLoadInviteExisting() {
  yield takeEvery(INITIAL_INVITE_EXISTING, handleInviteExistingInitial);
}

function* initialLoadInviteByUpload() {
  yield takeEvery(INITIAL_INVITE_BY_UPLOAD, handleInviteByUploadInitial);
}

function* handleInvite() {
  yield takeEvery(MANIPULATE_INVITE, handleInviteOperation);
}

function* handleInviteNew() {
  yield takeEvery(MANIPULATE_INVITE_NEW, handleInviteNewOperations);
}

function* handleInviteExisting() {
  yield takeEvery(MANIPULATE_INVITE_EXISTING, handleInviteExistingOperations);
}

export default function*() {
  yield all([
    handleLoad(),
    handleGetProfileKeyData(),
    initialLoadInviteGroups(),
    initialLoadInviteExisting(),
    initialLoadInviteByUpload(),
    handlePolling(),
    handleInvite(),
    handleInviteNew(),
    handleInviteExisting()
  ]);
}

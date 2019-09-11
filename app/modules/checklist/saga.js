import { put, takeEvery, call, all, select } from "redux-saga/effects";

import { getActions } from "@core/helpers";
import ModuleService from "@api/moduleService";

import {
  GET_CHECKLIST_DATA,
  HANDLE_UNPUBLISHED_CHANGES_FLAG,
  UPDATE_UNPUBLISHED_CHANGES_FLAG,
  MANIPULATE_CHECKLIST_DATA,
  UPDATE_STATIC,
  UPDATE_SERIES,
  MIXPANEL
} from "./actionTypes";

import { OPERATIONS } from "./config/constants";

import { mixpanelIdentityPath } from "./mixpanel/config";

const { RENAME, DISCARD, ARCHIVE, REFETCH } = OPERATIONS;

function* registerMixpanel() {
  yield put(getActions(MIXPANEL)(mixpanelIdentityPath));
}

function* getContext() {
  const {
    checklist: {
      details: {
        staticData: { id: moduleId, companyId },
        series: { id: seriesId }
      },
      mixpanel
    },
    auth: {
      data: { id: userId }
    }
  } = yield select();
  return {
    userId,
    moduleId,
    seriesId,
    companyId,
    mixpanel
  };
}

function* getModuleDetails(context) {
  const { series: seriesDetails, details: moduleDetails, ...rest } = yield call(
    ModuleService.getDetails,
    context
  );
  return {
    moduleDetails,
    seriesDetails,
    ...rest
  };
}

function* getMaxScore({ moduleId, seriesId }) {
  const { maxScore } = yield call(ModuleService.getMaxScore, {
    moduleId,
    seriesId
  });
  return maxScore;
}

function* updateModuleDetails({ moduleId, seriesId, data }) {
  yield call(ModuleService.modifyDetails, { moduleId, seriesId, data });
  yield put(getActions(UPDATE_STATIC)(data));
}

function* getDetailsWithScore(context) {
  const [{ moduleDetails, seriesDetails, hasUnpubChanges }, maxScore] = yield all([
    getModuleDetails(context),
    getMaxScore(context)
  ]);
  yield put(getActions(UPDATE_STATIC)({ ...moduleDetails, maxScore }));
  yield put(getActions(UPDATE_SERIES)({ ...seriesDetails }));
  yield call(manageUnpublishedChangesFlag, {
    payload: { hasChanges: hasUnpubChanges }
  });
}

function* getData({ payload: { moduleId, seriesId } }) {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: GET_CHECKLIST_DATA,
    options: {
      async: true
    }
  });
  const {
    auth: {
      data: { id: userId, permissions }
    }
  } = yield select();
  const context = { moduleId, seriesId, userId, permissions };

  try {
    yield call(getDetailsWithScore, context);
    yield call(registerMixpanel);
    yield put(SUCCESS());
  } catch (error) {
    yield put(FAIL(error, { globalError: true }));
  }
}

function* manageChecklist({ payload: { operation, ...rest } }) {
  const { SUCCESS, FAIL } = getActions({
    name: MANIPULATE_CHECKLIST_DATA,
    options: { async: true }
  });
  try {
    const context = yield call(getContext);
    switch (operation) {
      case RENAME: //eslint-disable-line no-case-declarations
        const details = yield call(ModuleService.modifyDetails, {
          ...context,
          data: rest
        });
        yield put(getActions(UPDATE_STATIC)({ ...details }));
        break;
      case DISCARD:
        yield call(ModuleService.discardModule, context);
        break;
      case ARCHIVE:
        yield call(ModuleService.archiveModule, context);
        break;
      case REFETCH:
        yield getDetailsWithScore(context);
    }
    yield put(SUCCESS({ data: { operation, mixpanel: context.mixpanel } }));
  } catch (error) {
    yield put(FAIL({ error: { ...error, operation } }));
  }
}

function* manageUnpublishedChangesFlag({ payload: { hasChanges = false } }) {
  const {
    checklist: {
      details: {
        staticData: { isPublished }
      }
    }
  } = yield select();
  if (isPublished) {
    yield put(getActions(UPDATE_UNPUBLISHED_CHANGES_FLAG)({ hasChanges }));
  }
}

function* handleOperation() {
  yield takeEvery(MANIPULATE_CHECKLIST_DATA, manageChecklist);
}

function* handleLoad() {
  yield takeEvery(GET_CHECKLIST_DATA, getData);
}

function* handleUnpublishedChangesFlag() {
  yield takeEvery(HANDLE_UNPUBLISHED_CHANGES_FLAG, manageUnpublishedChangesFlag);
}

export default function*() {
  yield all([handleLoad(), handleOperation(), handleUnpublishedChangesFlag()]);
}
export { updateModuleDetails };

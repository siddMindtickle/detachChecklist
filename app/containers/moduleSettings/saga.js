import { put, takeEvery, call, all, select } from "redux-saga/effects";

import { getActions } from "@core/helpers";

import { GET_SETTINGS, SET_CONTEXT, MANIPULATE_SETTINGS, UPDATE_SETTINGS } from "./actionTypes";

import SettingsService from "./api";

import { OPERATIONS, SETTINGS, STATIC } from "./config/constants";

const { UPDATE } = OPERATIONS;

function* getContext() {
  const {
    moduleSettings: { context }
  } = yield select();
  return context;
}

function* updateSetting({ moduleId, seriesId, data }) {
  const response = yield call(SettingsService.modifySettings, {
    moduleId,
    seriesId,
    data
  });
  yield put(getActions(UPDATE_SETTINGS)(response));
}

function* getData({ payload: { moduleId, seriesId, companyId, moduleType } }) {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: GET_SETTINGS,
    options: {
      async: true
    }
  });
  const params = {
    moduleId,
    seriesId,
    companyId,
    moduleType
  };

  try {
    yield put(getActions(SET_CONTEXT)(params));
    const settings = yield call(SettingsService.getSettings, {
      moduleId,
      seriesId
    });
    yield put(getActions(UPDATE_SETTINGS)({ ...settings }));
    yield put(SUCCESS());
  } catch (error) {
    yield put(FAIL(error, { globalError: true }));
  }
}

function* manageSettings({ payload: { operation, type, moduleUpdater, ...data } }) {
  const { SUCCESS, FAIL } = getActions({
    name: MANIPULATE_SETTINGS,
    options: { async: true }
  });
  try {
    const { moduleId, seriesId } = yield getContext();
    const params = {
      moduleId,
      seriesId,
      data
    };
    switch (type) {
      case SETTINGS:
        if (operation == UPDATE) {
          yield call(updateSetting, params);
        }
        break;
      case STATIC:
        if (operation == UPDATE) {
          yield call(moduleUpdater, params);
        }
        break;
    }
    yield put(SUCCESS({ data: { operation, type } }));
  } catch (error) {
    yield put(FAIL({ error, operation, type }));
  }
}

function* handleLoad() {
  yield takeEvery(GET_SETTINGS, getData);
}

function* handleOperation() {
  yield takeEvery(MANIPULATE_SETTINGS, manageSettings);
}

export default function*() {
  yield all([handleLoad(), handleOperation()]);
}

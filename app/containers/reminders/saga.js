import { put, takeEvery, call, all } from "redux-saga/effects";

import { getActions } from "@core/helpers";

import {
  UPDATE_MAIL_TEMPLATE,
  UPDATE_LEARNER_STATUS,
  UPDATE_REMINDERS,
  MANIPULATE_DATA,
  GET_REMINDER_DATA
} from "./actionTypes";

import ReminderService from "./api/reminders";

function* getData({ payload: { moduleId, seriesId, companyId } }) {
  const params = { moduleId, seriesId, companyId };
  const { SUCCESS, FAIL } = getActions({
    name: GET_REMINDER_DATA,
    options: { async: true }
  });
  try {
    const templates = yield call(ReminderService.getMailTemplates, params);
    yield put(getActions(UPDATE_MAIL_TEMPLATE)({ ...templates }));
    const { learnerStatus, reminders } = yield call(ReminderService.getReminderAutomations, params);
    yield put(getActions(UPDATE_LEARNER_STATUS)({ ...learnerStatus }));
    yield put(getActions(UPDATE_REMINDERS)({ ...reminders }));

    yield put(SUCCESS());
  } catch (error) {
    yield put(FAIL(error));
  }
}

function* manipulateData({ payload: { moduleId, seriesId, companyId, operation, ...data } }) {
  const { SUCCESS, FAIL } = getActions({
    name: MANIPULATE_DATA,
    options: { async: true }
  });
  try {
    const params = {
      moduleId,
      seriesId,
      companyId,
      operation,
      data
    };

    const reminders = yield call(ReminderService.operateReminders, params);
    yield put(getActions(UPDATE_REMINDERS)({ ...reminders }));
    yield put(SUCCESS({ data: { operation } }));
  } catch (error) {
    yield put(FAIL({ ...error, operation }));
  }
}

function* handleLoadData() {
  yield takeEvery(GET_REMINDER_DATA, getData);
}

function* handleOperations() {
  yield takeEvery(MANIPULATE_DATA, manipulateData);
}

export default function*() {
  yield all([handleLoadData(), handleOperations()]);
}

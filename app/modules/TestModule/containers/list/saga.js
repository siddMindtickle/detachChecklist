import { put, takeEvery, call, all } from "redux-saga/effects";

import { getActions } from "@mt-ui-core/core/helpers";

import { GET_DATA } from "../../actionTypes";
import service from "~/modules/TestModule/api/test";

function* getData({ payload }) {
  const params = payload;
  const { SUCCESS, FAIL } = getActions({
    name: GET_DATA,
    options: { async: true }
  });
  try {
    const data = yield call(service.getData, params);

    yield put(SUCCESS(data));
  } catch (error) {
    yield put(FAIL(error));
  }
}

function* handleLoadData() {
  yield takeEvery(GET_DATA, getData);
}

export default function*() {
  yield all([handleLoadData()]);
}

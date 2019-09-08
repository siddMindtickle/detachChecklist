import { takeEvery, call, take, race } from "redux-saga/effects";
import { delay } from "redux-saga";

import { getLoadingActions } from "@core/helpers/createActions";
import { POLLING_DELAY } from "@config/global.config";

function* poll({ handler, params }) {
  while (true) {
    yield call(delay, POLLING_DELAY);
    yield call(handler, params);
  }
}

function getPollingSaga(actionType, handler) {
  return function*() {
    const { SUCCESS, FAIL } = getLoadingActions(actionType);
    yield takeEvery(actionType, function*({ payload }) {
      yield race([call(poll, { handler, params: payload }), take(SUCCESS), take(FAIL)]);
    });
  };
}

export default getPollingSaga;

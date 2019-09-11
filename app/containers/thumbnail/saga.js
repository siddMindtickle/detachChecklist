import { put, takeEvery, call, all } from "redux-saga/effects";
import { getActions } from "@core/helpers";

import { GET_THUMBNAILS, MANIPULATE_DATA, UPDATE_THUMBNAILS } from "./actionTypes";

import { OPERATIONS } from "./config/constants";
import ThumbnailService from "./api/thumbnail";

const { RENAME, REMOVE, GET, UPDATE_LIST } = OPERATIONS;
const OPERATIONS_API = {
  [GET]: ThumbnailService.getThumbnails,
  [RENAME]: ThumbnailService.renameThumbnail,
  [REMOVE]: ThumbnailService.removeThumbnail
};

function* getThumbnails({ payload: { moduleId, seriesId, companyId } }) {
  const { SUCCESS, FAIL } = getActions({
    name: GET_THUMBNAILS,
    options: { async: true }
  });
  try {
    const thumbnails = yield call(OPERATIONS_API[GET], {
      moduleId,
      companyId,
      seriesId
    });
    yield put(getActions(UPDATE_THUMBNAILS)(thumbnails));
    yield put(SUCCESS());
  } catch (error) {
    yield put(FAIL(error));
  }
}

function* manipulateData({ payload: { operation, companyId, thumb } }) {
  const { SUCCESS, FAIL } = getActions({
    name: MANIPULATE_DATA,
    options: { async: true }
  });
  const params = { companyId, thumb };
  try {
    let response;
    switch (operation) {
      case RENAME:
      case REMOVE:
        response = yield call(OPERATIONS_API[operation], params);
        yield put(getActions(UPDATE_THUMBNAILS)(response));
        break;
      case UPDATE_LIST:
        yield put(getActions(UPDATE_THUMBNAILS)(thumb));
        break;
    }
    yield put(SUCCESS({ data: { operation } }));
  } catch (error) {
    yield put(FAIL({ ...error, operation }));
  }
}
function* handleOperations() {
  yield takeEvery(MANIPULATE_DATA, manipulateData);
}
function* handleGetThumbnails() {
  yield takeEvery(GET_THUMBNAILS, getThumbnails);
}

export default function*() {
  yield all([handleGetThumbnails(), handleOperations()]);
}

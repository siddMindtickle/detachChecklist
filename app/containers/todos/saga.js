import { put, takeEvery, call } from "redux-saga/effects";

import { getActions } from "@core/helpers";

import { GET_TODOS } from "./actionTypes";
import TodoService from "./api/todos";

function* getTodos({ payload: { moduleId, seriesId, companyId } }) {
  const { SUCCESS, FAIL } = getActions({
    name: GET_TODOS,
    options: { async: true }
  });
  const params = { moduleId, seriesId, companyId };
  try {
    const data = yield call(TodoService.getTodos, params);
    yield put(SUCCESS({ data }));
  } catch (error) {
    yield put(FAIL(error));
  }
}

export default function* handleGetTodos() {
  yield takeEvery(GET_TODOS, getTodos);
}

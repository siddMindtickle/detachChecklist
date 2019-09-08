import { put, takeEvery, call, select, all } from "redux-saga/effects";

import { getActions } from "@core/helpers";
import { reload, deepmerge } from "@utils";
import { loadFreshChat, loadFullStoryAdmin } from "@utils/loadVendors";

import { AUTH, LOGOUT } from "./actionTypes";
import AuthService from "./api/auth";
import Routes from "./config/routes";

function* getDetails() {
  const Auth = yield call(getActions, {
    name: AUTH,
    options: {
      async: true
    }
  });
  try {
    let data = yield call(AuthService.auth);
    let companyAdmins = [];

    data = deepmerge(data, { company: { admins: companyAdmins } });
    yield put(Auth.SUCCESS({ data, isLoggedIn: true }));

    try {
      yield loadFreshChat(data);
      if (process.env.FULL_STORY_ENABLED && data.features && data.features.fullStoryEnabled) {
        loadFullStoryAdmin({ userId: data.id });
      }
      // eslint-disable-next-line no-empty
    } catch (err) {}
  } catch (error) {
    yield put(Auth.FAIL(error, { globalError: true }));
  }
}

function* logout() {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: LOGOUT,
    options: {
      async: true
    }
  });
  try {
    const { auth: { data: { id: userId } = {} } = {} } = yield select();
    yield call(AuthService.logout, userId);
    yield call(reload, Routes.login, { replace: true });
    yield put(SUCCESS());
  } catch (error) {
    yield put(FAIL({ error }));
  }
}

function* fetchDetails() {
  yield takeEvery(AUTH, getDetails);
}

function* handleLogout() {
  yield takeEvery(LOGOUT, logout);
}

export default function*() {
  yield all([fetchDetails(), handleLogout()]);
}

import { all, call, put, takeEvery, select } from "redux-saga/effects";
import { delay } from "redux-saga";

import { getActions } from "@core/helpers";

// constants
import { LOAD_DATA, UPDATE_RULES, FETCH_RULE, MANIPULATE_DATA, UPDATE_STATUS } from "./actionTypes";
import { OPERATIONS } from "./config/constants";

import RulesService from "./api/rules";

const OPERATION_CONFIG = {
  [OPERATIONS.UPDATE_MAIN_SWITCH]: {
    handler: RulesService.changeRulesStatus,
    updater: UPDATE_STATUS
  },
  [OPERATIONS.UPDATE_RULE]: {
    handler: RulesService.updateRule,
    updater: UPDATE_RULES
  }
};

function* getContext() {
  const {
    auth: { data: { company: { id: companyId } = {} } = {} }
  } = yield select();
  return { companyId };
}

function* getRuleById(ruleId) {
  const {
    automationRules: {
      rules: { [ruleId]: rule }
    }
  } = yield select();
  return rule;
}

function* fetchAllRules(context) {
  const { data, items } = yield call(RulesService.getAllRules, { ...context });
  yield put(getActions(UPDATE_RULES)(data));
  return items;
}

function* loadData() {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: LOAD_DATA,
    options: { async: true }
  });
  try {
    const context = yield getContext();
    const { status } = yield call(RulesService.getRulesStatus, { ...context });
    const data = yield fetchAllRules(context);
    yield put(getActions(UPDATE_STATUS)({ status }));
    yield put(SUCCESS({ data }));
  } catch (error) {
    yield put(FAIL(error, { globalError: true }));
  }
}

function* fetchRuleSingle({ payload: { ruleId } }) {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: FETCH_RULE,
    options: { async: true }
  });
  try {
    const context = yield getContext();
    let rule = yield getRuleById(ruleId);
    if (!rule.fetched) {
      rule = yield call(RulesService.fetchRuleSingle, {
        ...context,
        ruleId
      });
      yield put(getActions(UPDATE_RULES)({ [ruleId]: rule }));
      yield put(SUCCESS({ data: { response: rule } }));
    } else {
      yield call(delay, 500);
      yield put(SUCCESS());
    }
  } catch (error) {
    yield put(FAIL(error));
  }
}

function* manipulateData({ payload: { operation, type, ...data } }) {
  const { SUCCESS, FAIL } = yield call(getActions, {
    name: MANIPULATE_DATA,
    options: { async: true }
  });
  try {
    const context = yield getContext();
    const { handler, updater } = OPERATION_CONFIG[operation];
    const response = yield call(handler, { ...context, ...data });
    yield put(getActions(updater)(response));
    yield put(SUCCESS({ data: { operation, type, response } }));
  } catch (error) {
    yield put(FAIL(error));
  }
}

function* handleInitialLoad() {
  yield takeEvery(LOAD_DATA, loadData);
}

function* fetchRule() {
  yield takeEvery(FETCH_RULE, fetchRuleSingle);
}

function* performOperations() {
  yield takeEvery(MANIPULATE_DATA, manipulateData);
}

export default function*() {
  yield all([handleInitialLoad(), fetchRule(), performOperations()]);
}

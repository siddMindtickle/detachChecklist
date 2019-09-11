import { put, takeEvery, call, all, select } from "redux-saga/effects";

import { getActions } from "@core/helpers";
import { isUndefined, convertArrayToObject } from "@utils";

import {
  GET_APPLIED_TAGS,
  UPDATE_APPLIED_TAGS,
  UPDATE_SEARCH_TAGS,
  UPDATE_TAGS,
  UPDATE_CATEGORIES,
  MANIPULATE_DATA,
  GET_SUGGESTED_TAGS
} from "./actionTypes";

import TagsService from "./api/tags";
import { OPERATIONS } from "./config/constants";

const { UPDATE, REMOVE, ADD, SEARCH } = OPERATIONS;

const OPERATIONS_API = {
  [UPDATE]: TagsService.applyTags,
  [ADD]: TagsService.createTag,
  [REMOVE]: TagsService.removeTag,
  [SEARCH]: TagsService.getTagsBySearch
};

function* removeExistingAppliedTags({ data = {}, ...rest }) {
  const {
    moduleTags: { appliedTags }
  } = yield select();
  const newData = { ...data };
  newData.processIds = Object.keys(appliedTags).filter(id => appliedTags[id]);
  if (newData.processIds.length) {
    const response = yield call(OPERATIONS_API[REMOVE], {
      ...rest,
      data: newData
    });
    yield put(getActions(UPDATE_APPLIED_TAGS)(response));
  }
}

function* localSearch({ query }) {
  const {
    moduleTags: { tags }
  } = yield select();
  const result = {};
  if (isUndefined(query)) {
    return convertArrayToObject(Object.keys(tags));
  } else {
    for (const [id, tag] of Object.entries(tags)) {
      if (tag.name.includes(query)) result[id] = true;
    }
  }
  return result;
}

function* asyncSearch({ moduleId, seriesId, companyId, query }) {
  const { hasMore, categories, tags } = yield call(OPERATIONS_API[SEARCH], {
    moduleId,
    seriesId,
    companyId,
    data: { query }
  });
  yield put(getActions(UPDATE_CATEGORIES)(categories));
  yield put(getActions(UPDATE_TAGS)(tags));
  return {
    hasMore,
    result: convertArrayToObject(Object.keys(tags))
  };
}

function* getAppliedTags({ payload: { moduleId, seriesId, companyId } }) {
  const { SUCCESS, FAIL } = getActions({
    name: GET_APPLIED_TAGS,
    options: { async: true }
  });
  try {
    const tags = yield call(TagsService.getAppliedTags, {
      moduleId,
      companyId,
      seriesId
    });
    const appliedTags = convertArrayToObject(Object.keys(tags));
    yield put(getActions(UPDATE_TAGS)({ ...tags }));
    yield put(getActions(UPDATE_APPLIED_TAGS)({ ...appliedTags }));
    yield put(SUCCESS());
  } catch (error) {
    yield put(FAIL(error));
  }
}

function* getSuggestedTags({ payload: { companyId } }) {
  const { SUCCESS, FAIL } = getActions({
    name: GET_SUGGESTED_TAGS,
    options: { async: true }
  });
  try {
    const { tagsMap, categoriesMap } = yield call(TagsService.getSuggestedTags, { companyId });
    yield put(getActions(UPDATE_TAGS)({ ...tagsMap }));
    yield put(getActions(UPDATE_CATEGORIES)({ ...categoriesMap }));
    yield put(SUCCESS({ tagList: Object.keys(tagsMap) }));
  } catch (error) {
    yield put(FAIL(error));
  }
}

function* getTags(params) {
  const { moduleId, seriesId, companyId, data: { query } = {} } = params;

  let {
    moduleTags: { searchedTags: { hasMore = true } = {} }
  } = yield select();
  let searchedTags = [];
  if (hasMore) {
    const response = yield call(asyncSearch, {
      moduleId,
      seriesId,
      companyId,
      query
    });
    searchedTags = response.result;
    hasMore = response.hasMore;
  } else {
    searchedTags = yield call(localSearch, { query });
  }
  yield put(getActions(UPDATE_SEARCH_TAGS)({ data: searchedTags, hasMore }));
}

function* manipulateData({ payload: { moduleId, seriesId, companyId, operation, ...data } }) {
  const { SUCCESS, FAIL } = getActions({
    name: MANIPULATE_DATA,
    options: { async: true }
  });
  const params = { moduleId, seriesId, companyId, data };
  try {
    let response;
    switch (operation) {
      case SEARCH:
        yield call(getTags, params);
        break;
      case UPDATE:
        yield removeExistingAppliedTags({ ...params });
        response = yield call(OPERATIONS_API[operation], params);
        yield put(getActions(UPDATE_APPLIED_TAGS)(response));
        break;
      case REMOVE:
        response = yield call(OPERATIONS_API[operation], params);
        yield put(getActions(UPDATE_APPLIED_TAGS)(response));
        break;
      case ADD:
        response = yield call(OPERATIONS_API[operation], params);
        yield put(getActions(UPDATE_TAGS)(response));
        yield call(getTags, params);
    }
    yield put(SUCCESS({ data: { operation } }));
  } catch (error) {
    yield put(FAIL({ ...error, operation }));
  }
}

function* handleGetAppliedTags() {
  yield takeEvery(GET_APPLIED_TAGS, getAppliedTags);
}

function* handleGetSuggestedTags() {
  yield takeEvery(GET_SUGGESTED_TAGS, getSuggestedTags);
}

function* handleOperations() {
  yield takeEvery(MANIPULATE_DATA, manipulateData);
}

export default function*() {
  yield all([handleGetAppliedTags(), handleGetSuggestedTags(), handleOperations()]);
}

import {
  UPDATE as FORM_UPDATE,
  RESET as FORM_RESET,
  RESET_ERROR as FORM_RESET_ERROR
} from "./actionTypes";

import { isObject } from "@utils";
import { createReducers } from "@core/helpers";

const updateProccessor = (state = {}, { payload, meta }) => {
  const newState = {
    [payload.name]: {
      value: payload.value,
      errors: payload.errors
    }
  };
  state[meta.formName] = state[meta.formName] || {};
  return {
    ...state,
    [meta.formName]: {
      ...state[meta.formName],
      ...newState
    }
  };
};

const resetErrorProcessor = (state = {}, { meta }) => {
  const newState = {};
  for (const [field, desc] of Object.entries(state[meta.formName])) {
    if (isObject(desc)) newState[field] = { value: desc.value, errors: [] };
  }
  return {
    ...state,
    [meta.formName]: {
      ...newState
    }
  };
};
const resetProcessor = (state = {}, { meta }) => {
  return {
    ...state,
    [meta.formName]: {}
  };
};

export default createReducers([
  {
    name: FORM_UPDATE,
    options: {
      processor: updateProccessor
    }
  },
  {
    name: FORM_RESET,
    options: {
      processor: resetProcessor
    }
  },
  {
    name: FORM_RESET_ERROR,
    options: {
      processor: resetErrorProcessor
    }
  }
]);

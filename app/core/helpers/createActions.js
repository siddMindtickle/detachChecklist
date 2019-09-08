import { isString, isObject } from "@utils";

export const LodingActionSuffix = {
  SUCCESS: "_SUCCESS",
  FAIL: "_FAIL",
  RESET: "_RESET"
};

export const getLoadingActions = actionType => {
  const { SUCCESS, FAIL, RESET } = LodingActionSuffix;
  return {
    SUCCESS: `${actionType}${SUCCESS}`,
    FAIL: `${actionType}${FAIL}`,
    RESET: `${actionType}${RESET}`,
    LOADING: actionType
  };
};

export const createSuccessAction = actionType => {
  return (data = {}, meta) => {
    const { SUCCESS } = getLoadingActions(actionType);
    return {
      type: SUCCESS,
      payload: {
        ...data
      },
      meta
    };
  };
};

export const createFailAction = actionType => {
  return (error = {}, meta = {}) => {
    const { FAIL } = getLoadingActions(actionType);
    if (process.env.isDev) {
      error.error ? console.error(error.error) : console.error(error); //eslint-disable-line
    }
    return {
      type: FAIL,
      payload: error.error ? error : { error },
      meta
    };
  };
};

export const createResetAction = actionType => {
  return (error = {}, meta = {}) => {
    const { RESET } = getLoadingActions(actionType);
    return {
      type: RESET,
      payload: {
        ...error
      },
      meta
    };
  };
};

const generateAction = (actionType, { async = false } = {}) => {
  const defaultAction = (payload, meta) => {
    return {
      type: actionType,
      payload: payload,
      meta: meta
    };
  };
  if (async) {
    const successAction = createSuccessAction(actionType);
    const failAction = createFailAction(actionType);
    const resetAction = createResetAction(actionType);
    return {
      LOADING: defaultAction,
      SUCCESS: successAction,
      FAIL: failAction,
      RESET: resetAction
    };
  }
  return defaultAction;
};

const handleActionType = actionType => {
  if (isObject(actionType)) {
    const { name, options: { async = false } = {} } = actionType;
    return generateAction(name, { async });
  } else if (isString(actionType)) {
    return generateAction(actionType);
  }
};

export const getActions = actionTypes => {
  if (Array.isArray(actionTypes)) {
    return actionTypes.reduce((actions, actionType) => {
      actions.push(handleActionType(actionType));
      return actions;
    }, []);
  }
  return handleActionType(actionTypes);
};

export default getActions;

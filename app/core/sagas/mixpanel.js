/*eslint-disable no-console */

import { takeEvery, select, call, all, take } from "redux-saga/effects";

import TrackEvents from "@mixpanel/events";
import { mixpanelIdentity, mixpanelIdentityPath } from "@mixpanel/config";
import { isEmpty, identity, isUndefined, findKeyWithDotNotaion } from "@utils";
import { DISABLE_TRACKING } from "@config/actionTypes.global";

/********* to be removed **********/
const mixpanelClient = {
  track: (event, data) => {
    console.log("MIX_PANEL EVENT: ", event, ", DATA: ", data);
  }
};
/********* to be removed **********/

function getDataFromStore(path = "", store) {
  if (path.startsWith("@@store")) {
    return findKeyWithDotNotaion(path, store, 1);
  }
  return path;
}

function track(event, mixpanelData) {
  if (!process.env.isDev) {
    window.mixpanel.track(event, mixpanelData);
  } else {
    mixpanelClient.track(event, mixpanelData);
  }
}

function fireEvents({ event, mixpanelData, multipleTrack }) {
  if (!Array.isArray(event)) event = [event];
  if (multipleTrack) {
    event.forEach(eventName => track(eventName, mixpanelData));
  } else {
    track(event[0], mixpanelData);
  }
}

export function getBaseProperties(mixpanelPaths, store) {
  const baseProperties = {};
  Object.keys(mixpanelPaths).forEach(property => {
    const value = getDataFromStore(mixpanelPaths[property], store);
    let { name: names, processor = identity } = mixpanelIdentity[property];
    names = Array.isArray(names) ? names : [names];
    names.forEach(name => {
      baseProperties[name] = processor(value);
    });
  });
  return baseProperties;
}

function getPropertyData(eventData, params, store) {
  const propertyData = {};
  Object.keys(eventData).forEach(key => {
    const { value: path, processor = identity } = eventData[key];
    const value = getDataFromStore(path, store);
    propertyData[key] = processor(value, params);
  });
  return propertyData;
}

function* getMixpanelIdentity({ context = {}, mixpanel = {} }) {
  let mixpanelPath = { ...mixpanel, ...mixpanelIdentityPath };
  let additionalPath = {};
  const store = yield select();
  if (!isEmpty(context)) {
    const moduletype = context.moduleType;
    additionalPath =
      (store[moduletype.toLowerCase()] && store[moduletype.toLowerCase()].mixpanel) || {};
  }
  return getBaseProperties({ ...mixpanelPath, ...additionalPath }, store);
}

function* prepareData({ type: actionType, payload: { data: payloadData = {} } = {} }) {
  try {
    const store = yield select();
    const TrackEventConfig = TrackEvents[actionType] || {};
    const {
      operation: op,
      type: opType,
      dontTrack = false,
      multipleTrack = false,
      response = {},
      postData = {},
      context = {},
      mixpanel = {}
    } = payloadData;

    if (dontTrack) return;

    let trackingData = { ...TrackEventConfig };

    trackingData = op ? trackingData[op] : trackingData;
    trackingData = trackingData && opType && op ? trackingData[opType] : trackingData;

    if (isEmpty(trackingData) || isUndefined(trackingData)) return;

    const baseProperties = yield call(getMixpanelIdentity, {
      context,
      mixpanel
    });
    const params = isEmpty(postData) || isUndefined(postData) ? response : postData;

    const { data: eventData, event } = trackingData;

    const mixpanelData = {
      ...baseProperties,
      ...getPropertyData(eventData, params, store)
    };

    yield call(fireEvents, { event, mixpanelData, multipleTrack });
  } catch (error) {
    if (process.env.isDev) {
      throw error;
    }
  }
}

function* trackEvents() {
  yield takeEvery(Object.keys(TrackEvents), prepareData);
}

function* stopTracking() {
  yield take(DISABLE_TRACKING);
  if (window.mixpanel) {
    yield window.mixpanel.register({ $ignore: true });
  }
}

export default function*() {
  yield all([trackEvents(), stopTracking()]);
}

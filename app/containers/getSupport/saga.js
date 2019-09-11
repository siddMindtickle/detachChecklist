import { takeEvery, put, call } from "redux-saga/effects";

import { getActions } from "@core/helpers";
import {
  getConsoleErrors,
  getVisitingTime,
  takeSnapshot,
  getCurrentTime,
  getBrowserInfo,
  getAllInlineStyle,
  beautify
} from "./utils/index.js";
import FeedbackService from "./api/feedback";

import { SEND_FEEDBACK } from "./actionTypes";

const hideModalScript = () => {
  return "document.querySelector('div[role=dialog]').remove()";
};

function* sendFeedback({ payload: { email, summary, description } }) {
  const Feedback = yield call(getActions, {
    name: SEND_FEEDBACK,
    options: { async: true }
  });
  const consoleErrors = yield call(getConsoleErrors);
  const visitingTime = yield call(getVisitingTime);
  const snapShot = yield call(takeSnapshot);
  const feedbackTime = yield call(getCurrentTime);
  const browserInfo = yield call(getBrowserInfo);
  const allStyles = yield call(getAllInlineStyle);
  //const appState = yield select();
  // const scripts =
  const currentUrl = location.href;
  try {
    const response = yield call(FeedbackService.postFeedback, {
      fieldsInfo: beautify({
        email,
        summary,
        description
      }),
      email: email,
      currentUrl: currentUrl,
      browserStatus: beautify({
        ...browserInfo,
        "gameTime:": visitingTime,
        feedbackTime: feedbackTime,
        jsErrors: consoleErrors
      }),
      html: snapShot,
      styles: allStyles,
      script: hideModalScript()
      //appState: appState
    });
    yield put(Feedback.SUCCESS(response));
  } catch (error) {
    yield put(Feedback.FAIL(error));
  }
}

export default function*() {
  yield takeEvery(SEND_FEEDBACK, sendFeedback);
}

import { resolve } from "path";

const getHeaders = (headers = {}) => {
  const additionalHeaders = {
    "Content-Type": "application/json"
  };
  return {
    ...additionalHeaders,
    ...headers
  };
};

const checkStatus = async (response, url) => {
  if (response.status >= 200 && response.status < 300) {
    let data = await response.json();
    return { ...data };
  } else {
    let error = new Error(`Api Fail:${url}`);
    if (
      response.headers &&
      response.headers.get("Content-Type").indexOf("application/json") !== -1
    ) {
      let data = await response.json();
      const { errorCode, error: doNotUse, ...rest } = data; //eslint-disable-line
      error.errorCode = errorCode;
      error.data = rest;
    }
    error.statusCode = response.status;
    throw error;
  }
};
const fetchMock = async (name, type = "success") => {
  const mockUrl = resolve(__dirname, "mock", `${name}.json`);
  const response = await fetch(mockUrl);

  let mock = await response.json();
  mock = mock[type];
  mock.json = () => mock.data;
  return mock;
};

const makeCall = async (urlObj, reqObj = {}) => {
  try {
    let promise;
    if (process.env.MOCK && urlObj.mock) {
      promise = fetchMock(urlObj.mock, urlObj.mockType);
    } else if (process.env.MOCK_SELECTIVE && urlObj.mock && urlObj.enableMock) {
      promise = fetchMock(urlObj.mock, urlObj.mockType);
    } else {
      promise = fetch(urlObj.url, { ...reqObj, credentials: "same-origin" });
    }
    let response = await promise;
    response = await checkStatus(response, urlObj.url);
    return response;
  } catch (ex) {
    throw ex;
  }
};

const get = (urlObj, reqObj = {}) => {
  reqObj.method = "GET";
  reqObj.headers = getHeaders(reqObj.headers);
  return makeCall(urlObj, { ...reqObj });
};

const post = (urlObj, reqObj = {}) => {
  reqObj.method = "POST";
  reqObj.headers = getHeaders(reqObj.headers);
  if (reqObj.body && reqObj.headers["Content-Type"] === "application/json") {
    reqObj.body = JSON.stringify(reqObj.body);
  }
  return makeCall(urlObj, { ...reqObj });
};

const put = (urlObj, reqObj = {}) => {
  reqObj.method = "PUT";
  reqObj.headers = getHeaders(reqObj.headers);
  if (reqObj.body && reqObj.headers["Content-Type"] === "application/json") {
    reqObj.body = JSON.stringify(reqObj.body);
  }
  return makeCall(urlObj, { ...reqObj });
};
const del = (urlObj, reqObj = {}) => {
  reqObj.method = "DELETE";
  reqObj.headers = getHeaders(reqObj.headers);
  if (reqObj.body && reqObj.headers["Content-Type"] === "application/json") {
    reqObj.body = JSON.stringify(reqObj.body);
  }
  return makeCall(urlObj, { ...reqObj });
};

export { get, post, put, del };

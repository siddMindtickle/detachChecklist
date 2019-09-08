import QueryString from "query-string";
import isPlainObject from "is-plain-object";
import emailValidator from "email-validator";
import moment from "moment";

import Routes from "@config/base.routes";
import ErrorCodes from "@config/error.codes";

export deepmerge from "deepmerge";
export const noop = () => undefined;
export const identity = val => val;

export const uniqueMerge = (array1, array2) => {
  return [...array1, ...array2].filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
};

export const findKeyWithDotNotaion = (path, data, skipIndex) => {
  if (!(path && data)) return;
  path = path.split(".");
  if (!isUndefined(skipIndex)) {
    path = path.splice(1);
  }
  return path.reduce((result, key, index) => {
    return index !== path.length - 1 ? result[key] || {} : result[key];
  }, data);
};

export const getLifecycleStageUrl = ({ baseUrl, stage, routes = Routes.lifecycle }) => {
  return `${baseUrl}${routes[stage]}`;
};

export const without = (array, element) => {
  return array.filter(e => e !== element);
};

export const reload = (url, { replace = false } = {}) => {
  if (url.indexOf("http") == -1) {
    url = url[0] === "/" ? url : `/${url}`;
    url = window.location.origin + url;
  }
  if (replace) window.location.replace(url);
  else window.location.href = url;
};

export const isPromise = value => {
  if (value !== null && typeof value === "object") {
    return value && typeof value.then === "function";
  }
  return false;
};

export const isUndefined = value => {
  return typeof value === "undefined";
};

export const isFunction = fn => {
  return typeof fn === "function";
};

export const isString = value => {
  return typeof value === "string";
};

export function isObject(x) {
  return isPlainObject(x);
}

export function isBoolean(value) {
  return typeof value == typeof true;
}

export function isEmpty(x) {
  if (isObject(x) && !Object.keys(x).length) return true;
  if (Array.isArray(x) && !x.length) return true;
  if (isString(x) && !x.length) return true;
  return false;
}

function customStringify(a) {
  try {
    return JSON.stringify(a);
  } catch (error) {
    return false;
  }
}

export function deepEqual(a, b) {
  if (isObject(a) && isObject(b)) {
    return Object.is(customStringify(a), customStringify(b));
  } else if (Array.isArray(a) && Array.isArray(b)) {
    a = a.map(v => customStringify(v)).join(",");
    b = b.map(v => customStringify(v)).join(",");
    return a == b;
  }
  return false;
}

export const getAllSagaModes = () => {
  return {
    RESTART_ON_REMOUNT: "saga-injector/restart-on-remount",
    DAEMON: "saga-injector/daemon",
    ONCE_TILL_UNMOUNT: "saga-injector/once-till-unmount"
  };
};

export const debounce = (func, wait, immediate) => {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const nextIntervalTimestamp = (timestamp, interval) => {
  const start = moment(timestamp).seconds(0);
  const remainder = interval - (start.minute() % interval);
  return +moment(start).add(remainder, "minutes");
};

export const handleQueryStringForApi = apiUrls => {
  const getUrl = (url, query) => {
    if (!query) return url;
    return `${url}?${query}`;
  };

  for (const [key, func] of Object.entries(apiUrls)) {
    apiUrls[key] = (() => {
      return options => {
        if (options && options.query) {
          let urlObj = func(options);
          urlObj.url = getUrl(urlObj.url, QueryString.stringify(options.query));
          return urlObj;
        }
        return func(options);
      };
    })();
  }
  return apiUrls;
};

export const openWindow = url => {
  if (url.indexOf("http") == -1) {
    url = `//${url}`;
  }
  window.open(url);
};

export const extractTextContent = s => {
  var span = document.createElement("span");
  span.innerHTML = s;
  return span.textContent || span.innerText;
};

export const convertArrayToObject = (arr, value = true) => {
  return arr.reduce((result, val) => {
    result[val] = value;
    return result;
  }, {});
};

export const containsWordStartWith = (str = "", searchString = "") => {
  const searchWords = searchString.toLowerCase().split(" ");
  const strWords = str.toLowerCase().split(" ");

  return searchWords.every(searchWord => {
    return strWords.some(strWord => {
      return strWord.startsWith(searchWord);
    });
  });
};

export const getAcronym = str => {
  let acronym;
  var nameRegEx = /^[a-z ]+$/i;
  if (nameRegEx.test(str)) {
    var matches = str.match(/\b(\w)/g);
    if (null == matches) acronym = "--";
    else if (matches.length == 1) acronym = str.substr(0, 2);
    else acronym = matches.join("").substr(0, 2);
  } else {
    acronym = str.substr(0, 2);
  }
  return acronym.toUpperCase();
};

export const daysToMinutes = days => {
  return days * 60 * 24;
};

export const minutesToDays = minutes => {
  return minutes / (60 * 24);
};

export const convertToSeconds = ({ days = 0, hours = 0, minutes = 0, seconds = 0 }) => {
  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
};

export const splitSeconds = (seconds = 0) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds - days * 86400) / 3600);
  const minutes = Math.floor((seconds - (days * 86400 + hours * 3600)) / 60);
  const remainingSeconds = Math.floor(seconds - (days * 86400 + hours * 3600 + minutes * 60));
  return {
    days,
    hours,
    minutes,
    seconds: remainingSeconds
  };
};

export const milisecondsToSeconds = miliseconds => {
  return miliseconds ? miliseconds / 1000 : miliseconds;
};

export const secondsToMiliseconds = seconds => {
  return seconds && seconds < 100000000000 ? seconds * 1000 : seconds;
};

export const hoursToMiliseconds = hours => {
  return hours ? hours * 60 * 60 * 1000 : hours;
};

export const convertToLocalTimezone = (timestamp, offset) => {
  if (!offset) return timestamp;
  const utc = timestamp + offset * 3600000;
  const currentOffset = new Date().getTimezoneOffset() * 60000;
  return new Date(utc + currentOffset).getTime();
};

export const hasValue = elem => {
  return !(isUndefined(elem) || elem === null);
};

const isPrunable = elem => Array.isArray(elem) || isObject(elem);

export const prune = elem => {
  if (!isPrunable(elem)) return elem;

  if (Array.isArray(elem)) {
    return elem.reduce((acc, val) => {
      if (hasValue(val)) {
        const newVal = isPrunable(val) ? prune(val) : val;
        acc.push(newVal);
      }
      return acc;
    }, []);
  }

  if (isObject(elem)) {
    return Object.keys(elem).reduce((acc, key) => {
      const val = elem[key];
      if (hasValue(val)) {
        const newVal = isPrunable(val) ? prune(val) : val;
        acc[key] = newVal;
      }
      return acc;
    }, {});
  }
};

export const urlify = text => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a target="_blank" href="$1">$1</a>');
};

export const customError = (error = {}) => {
  if (error.errorCode) return error;
  const customError = {};
  customError.errorCode = ErrorCodes.codeError[0];
  customError.data = {
    message: error.message,
    stack: error.stack,
    filename: error.filename,
    sagaStack: error.sagaStack,
    ...error
  };
  return customError;
};

export const invitedOnDateFormatter = invitedOn => {
  return moment(invitedOn).format("MMM DD, YYYY");
};

export const isValidEmail = email => {
  return emailValidator.validate(email);
};
export const textOnly = val => {
  let isEnglish = /^[a-zA-Z ]*$/g.test(val.trim());
  if (isEnglish) return isEnglish;
  let isNonEnglish = true;
  let valSplitArr = val.split("");
  for (let i = 0; i < valSplitArr.length; i++) {
    let charCode = valSplitArr[i].charCodeAt(0);
    if (
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122) ||
      charCode == 32 ||
      valSplitArr[i].charCodeAt(0) > 255
    ) {
      //isNonEnglish=true;
    } else {
      isNonEnglish = false;
    }
  }
  return isNonEnglish;
};
export const textNum = val => {
  return /^[a-zA-Z0-9\s,&.]*$/gi.test(val.trim());
};
export const numOnly = val => {
  return /^[0-9]*$/gi.test(val.trim());
};

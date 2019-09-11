export deepmerge from "deepmerge";
import { RECORDER_TYPES, OBJECT_TYPES } from "@config/constants";
import ErrorCodes from "@config/error.codes";
import isPlainObject from "is-plain-object";
import QueryString from "query-string";

import emailValidator from "email-validator";
import moment from "moment";
import Routes from "@config/base.routes";

// begin common-utils-with-allaboard
export const identity = val => val;
export const noop = () => undefined;
export const without = (array, element) => {
  return array.filter(e => e !== element);
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

const urlRegex = /(https?:\/\/[^\s]+)/g;
export const urlify = text => {
  return text.replace(urlRegex, '<a target="_blank" rel="noopener noreferrer" href="$1">$1</a>');
};

export const getAllSagaModes = () => {
  return {
    RESTART_ON_REMOUNT: "saga-injector/restart-on-remount",
    DAEMON: "saga-injector/daemon",
    ONCE_TILL_UNMOUNT: "saga-injector/once-till-unmount"
  };
};

export const getFileTypeIcon = original_path => {
  const getFileExt = getFileExtension(original_path).toLowerCase();
  switch (getFileExt) {
    case "zip":
      return "zip";
    default:
      return "media";
  }
};

export const parseMedia = media => {
  if (!media) return {};
  const {
    id,
    title,
    processed_path,
    original_path,
    type,
    urls = {},
    mp4Path,
    uuid,
    mp4PathList,
    mp3PathList,
    mp3Path,
    video,
    audio,
    ppt,
    screen,
    voiceOverData,
    vttSubtitlePath = ""
  } = media;
  let tracks = undefined;
  // TODO Check for vttSubtitlePath vs subtitleTrackSrc
  if (type === OBJECT_TYPES.VIDEO) {
    tracks = parseMediaTracks(media, type);
  }
  return {
    id,
    title,
    originalUrl: (urls && urls.pdf) || mp4Path || processed_path || original_path,
    uuid,
    type,
    mp4PathList,
    mp3PathList,
    mp3Path,
    video: parseMedia(video && video.obj),
    audio: parseMedia(audio && audio.obj),
    screen: parseMedia(screen && screen.obj),
    ppt: parseMedia(ppt && ppt.obj),
    voiceOverData,
    thumbPath: getThumbPathFromMedia(media),
    tracks,
    subtitleTrackSrc: vttSubtitlePath
  };
};

var parseTracks = function(mediaObj, key) {
  var tracks = [],
    sources = [];
  if (!mediaObj || !key) {
    return tracks;
  }
  if (!mediaObj[key] || !mediaObj[key].length) {
    const media = mediaObj[key.substr(0, 7)];
    media && tracks.push(media);
  } else if (Array.isArray(mediaObj[key])) {
    tracks = mediaObj[key];
  }
  for (var i = 0; i < tracks.length; i++) {
    var quality = tracks[i].substr(tracks[i].lastIndexOf("/") + 1);
    quality = quality.substr(0, quality.indexOf("."));
    sources.push({
      src: tracks[i],
      label: quality
    });
  }
  return sources;
};

export function parseMediaTracks(mediaObj, type) {
  var primaryTrackObj, secondaryTrackObj, key, subtitleTrackSrc;

  switch (type) {
    case RECORDER_TYPES.VIDEO:
    case OBJECT_TYPES.VIDEO:
      key = "mp4PathList";
      primaryTrackObj = mediaObj;
      subtitleTrackSrc = mediaObj.subtitleTrackSrc;
      break;
    case RECORDER_TYPES.SCREEN_AUDIO:
    case OBJECT_TYPES.AUDIO:
      key = "mp4PathList";
      primaryTrackObj = mediaObj.screen;
      subtitleTrackSrc = mediaObj.screen.subtitleTrackSrc;
      break;
    case RECORDER_TYPES.SCREEN_VIDEO:
      key = "mp4PathList";
      primaryTrackObj = mediaObj.screen;
      secondaryTrackObj = mediaObj.video;
      subtitleTrackSrc = mediaObj.screen.subtitleTrackSrc;
      break;
    case RECORDER_TYPES.VOICE_OVER_PPT:
      key = "mp3PathList";
      primaryTrackObj = mediaObj.audio;
      subtitleTrackSrc = mediaObj.audio.subtitleTrackSrc;
      break;
  }

  const primaryTracks = parseTracks(primaryTrackObj, key) || [];
  let selectedTrack = primaryTracks.findIndex(track => track.label.includes("360"));
  selectedTrack = selectedTrack > -1 ? selectedTrack : 0;
  return {
    primaryTracks,
    secondaryTracks: parseTracks(secondaryTrackObj, key) || [],
    selectedTrack,
    subtitleTrackSrc
  };
}

export const parseAttachments = medias => {
  return medias.reduce((result, media) => {
    if (!(media && media.obj && media.obj.id)) {
      // Unexpected event, implies data corruption
      return result;
    }
    result[media.obj.id] = parseMedia(media.obj);
    return result;
  }, {}); // {} is the starting value of accumulator(named result here)
};

export const getFileExtension = str => {
  if (isUndefined(str)) return "";
  const fileExtension = str
    .split(".")
    .pop()
    .split(/#|\?/)[0];

  return fileExtension;
};

export const smartEllipsis = (str, length = 16) => {
  if (!str) {
    return;
  }
  if (str.length <= length) {
    return str;
  }
  const fileExt = getFileExtension(str);
  let count = fileExt.length + 3;
  const fileName = str.slice(0, str.lastIndexOf(".")).slice(0, length - count);
  return `${fileName}...${fileExt}`;
};

export const getThumbPathFromMedia = (media = {}) => {
  const { type } = media;
  let thumbPath = media.thumbPath;
  switch (type) {
    case OBJECT_TYPES.DOCUMENT_PPT:
    case OBJECT_TYPES.XLS:
    case OBJECT_TYPES.DOC:
    case OBJECT_TYPES.PDF:
      thumbPath = media.urls && media.urls.thumb;
      break;
    case OBJECT_TYPES.IMAGE:
      thumbPath = media.original_path;
      break;
    case OBJECT_TYPES.VOICE_OVER_SCREEN:
      thumbPath = media.screen.obj.thumbPath;
      break;
    default:
      break;
  }

  if (thumbPath.startsWith("//")) {
    //prefix https if not present, case for video thumbPaths
    thumbPath = "https:" + thumbPath;
  }
  return thumbPath;
};

export const downloadURI = (uri, name) => {
  var link = document.createElement("a");
  link.style.display = "none";
  document.body.appendChild(link);
  link.download = name;
  link.target = "_blank";
  link.href = uri;
  link.click();
};

export const isMobile = () => {
  return window.innerWidth <= 576;
};

export const isIpad = () => {
  return window.innerWidth > 576 && window.innerWidth < 1024;
};

export const isIpadPro = () => {
  return window.innerWidth === 1024;
};

export const isDesktop = () => {
  return window.innerWidth > 1024;
};
// end common-utils-with-allaboard

// begin slight-deviations-from-allaboard-utils
export const reload = (url, { replace = false } = {}) => {
  if (url.indexOf("http") == -1) {
    url = url[0] === "/" ? url : `/${url}`;
    url = window.location.origin + url;
  }
  if (replace) window.location.replace(url);
  else window.location.href = url;
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
// end slight-deviations-from-allaboard-utils

// begin selfserve-only-utils
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

export const resetPagePerformanceData = () => {
  window.pagePerformanceData = {
    to: window.location.pathname,
    from: window.location.pathname,
    startTime: Date.now()
  };
};

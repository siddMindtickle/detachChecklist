import TitleCase from "title-case";
import { NO_FLASH_PLAYER } from "../config/constants";
import { isObject } from "@utils";
import { MESSAGES } from "../config/constants";

export const getCurrentTime = () => {
  return new Date().toLocaleString();
};

export const getConsoleErrors = (() => {
  let consoleErrors = [];
  try {
    Object.defineProperty(window, "onerror", { writable: true });
  } catch (ex) {} //eslint-disable-line
  window.onerror = function(err, url, line) {
    consoleErrors.push({
      err: err,
      url: url,
      line: line
    });
  };
  try {
    Object.defineProperty(window, "onerror", { writable: false });
  } catch (ex) {} //eslint-disable-line
  return () => consoleErrors;
})();

export const getVisitingTime = (() => {
  const loadTime = getCurrentTime();
  return () => loadTime;
})();

export const takeSnapshot = () => {
  return document.getElementsByTagName("html")[0].innerHTML;
};

/* need validation for json is object */
export const beautify = (json = {}) => {
  if (!isObject(json)) return json;
  let formatted = [];
  for (let [key, value] of Object.entries(json)) {
    let str = `<b>${TitleCase(key)}</b>:${value}`;
    formatted.push(str);
  }
  return `<br/>${formatted.join("<br/>")}`;
};

export const visibleWidth = () => {
  return (
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0
  );
};

export const visibleHeight = () => {
  return (
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
  );
};

export const getAllInlineStyle = () => {
  let allStyles = Array.prototype.slice.call(document.querySelectorAll("style"));
  allStyles = allStyles.reduce((styles, el) => {
    styles.push(el.innerHTML);
    return styles;
  }, []);
  return allStyles.join();
};

export const getBrowserInfo = () => {
  return {
    browser: navigator.userAgent,
    flashPlayer:
      (window.swfobject && JSON.stringify(window.swfobject.getFlashPlayerVersion())) ||
      NO_FLASH_PLAYER,
    userAgent: navigator.userAgent,
    visibleWindowSize: `${visibleWidth()}x${visibleHeight()}`,
    screenResolution: `${screen.width}x${screen.height}`
  };
};

export const intl = {
  formatMessage: ({ id }) => {
    return MESSAGES[id];
  }
};

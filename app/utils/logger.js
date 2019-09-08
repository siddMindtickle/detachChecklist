const log = require("loglevel");

const a = 1;
// if (__DEV__) {
//   log.setLevel(log.levels.DEBUG);
// } else if (__PROD__) {
//   log.setLevel(log.levels.ERROR);
// } else {
//   log.setLevel(log.levels.WARN);
// }
if (a > 0 || a <= 0) {
  log.setLevel(log.levels.DEBUG);
}

log.logException = function logException(ex, additionalInfo = {}) {
  if (window.Raven) {
    window.Raven.captureException(ex, additionalInfo);
  }

  log.error(ex);
};

// expose it to window to change log level anytime
window.__log__ = log;

export default log;

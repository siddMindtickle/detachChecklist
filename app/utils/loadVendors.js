/* eslint-disable  */
import { post } from "@utils/apiUtils";

export const loadFullStoryAdmin = ({ userId }) => {
  window["_fs_debug"] = false;
  window["_fs_host"] = "fullstory.com";
  window["_fs_org"] = "5V0ND";
  window["_fs_namespace"] = "FS";
  (function(m, n, e, t, l, o, g, y) {
    if (e in m) {
      if (m.console && m.console.log) {
        m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');
      }
      return;
    }
    g = m[e] = function(a, b, s) {
      g.q ? g.q.push([a, b, s]) : g._api(a, b, s);
    };
    g.q = [];
    o = n.createElement(t);
    o.async = 1;
    o.crossOrigin = "anonymous";
    o.src = "https://" + _fs_host + "/s/fs.js";
    y = n.getElementsByTagName(t)[0];
    y.parentNode.insertBefore(o, y);
    g.identify = function(i, v, s) {
      g(l, { uid: i }, s);
      if (v) g(l, v, s);
    };
    g.setUserVars = function(v, s) {
      g(l, v, s);
    };
    g.event = function(i, v, s) {
      g("event", { n: i, p: v }, s);
    };
    g.shutdown = function() {
      g("rec", !1);
    };
    g.restart = function() {
      g("rec", !0);
    };
    g.log = function(a, b) {
      g("log", [a, b]);
    };
    g.consent = function(a) {
      g("consent", !arguments.length || a);
    };
    g.identifyAccount = function(i, v) {
      o = "account";
      v = v || {};
      v.acctId = i;
      g(o, v);
    };
    g.clearUserCookie = function() {};
  })(window, document, window["_fs_namespace"], "script", "user");

  FS.identify(userId);
};

export const loadIntercom = ({ name, email, timestamp, intercomId }) => {
  if (!intercomId) return;
  window.intercomSettings = {
    name: name,
    email: email,
    signedup_date_at: timestamp,
    app_id: intercomId
  };
  (function() {
    var w = window;
    var ic = w.Intercom;
    if (typeof ic === "function") {
      ic("reattach_activator");
      ic("update", intercomSettings);
    } else {
      var d = document;
      var i = function() {
        i.c(arguments);
      };
      i.q = [];
      i.c = function(args) {
        i.q.push(args);
      };
      w.Intercom = i;
      var s = d.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://widget.intercom.io/widget/i9e73nua";
      var x = d.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(s, x);
    }
  })();
};

export const loadFreshChat = details => {
  const {
    id: userId,
    name,
    email,
    companyId,
    company: { url: learningSite },
    freshchat: { freshchatId, freshchatRestoreId }
  } = details;

  if (!freshchatId) return;

  loadScript({
    url: "https://wchat.freshchat.com/js/widget.js",
    defer: true
  }).then(() => {
    if (window.fcWidget) {
      window.fcWidget.init({
        token: freshchatId,
        host: "https://wchat.freshchat.com",
        siteId: companyId,
        externalId: userId,
        restoreId: freshchatRestoreId ? freshchatRestoreId : null
      });

      window.fcWidget.user.get(function(resp) {
        var status = resp && resp.status,
          data = resp && resp.data;
        if (status !== 200) {
          window.fcWidget.user.setFirstName(name || userId);
          window.fcWidget.user.setEmail(email);
          window.fcWidget.user.setProperties({
            cname: companyId,
            lsLink: learningSite
          });
          window.fcWidget.on("user:created", function(resp) {
            const status = resp && resp.status;
            const data = resp && resp.data;
            if (status === 200) {
              const { restoreId } = data;
              if (restoreId) {
                updateFreshchatRestoreId({ companyId, userId, restoreId });
              }
            }
          });
        }
      });
    }
  });
};

export const clearFreschatUser = () => {
  if (window.fcWidget && window.fcWidget.user) return window.fcWidget.user.clear();
};

const updateFreshchatRestoreId = async ({ companyId, userId, restoreId }) => {
  let updateFreshchatUrl = `/update-freschat-restore-id/${companyId}/${userId}`;

  try {
    const response = await post(updateFreshchatUrl, {
      body: {
        restoreId
      }
    });
    return response;
  } catch (error) {
    return {};
  }
};

const loadScript = scriptObj => {
  const alreadyLoaded = {};
  const { url, defer } = scriptObj;
  if (alreadyLoaded[url]) alreadyLoaded[url];
  alreadyLoaded[url] = new Promise((resolve, reject) => {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    if (defer) script.defer = defer;
    script.addEventListener(
      "load",
      () => {
        resolve(script);
      },
      false
    );
    script.addEventListener("error", () => reject(script), false);
    document.body.appendChild(script);
  });
  return alreadyLoaded[url];
};

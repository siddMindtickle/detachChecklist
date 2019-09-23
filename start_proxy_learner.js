/* eslint-disable no-console */
require("dotenv").config();

const https = require("http"),
  httpProxy = require("http-proxy"),
  HttpProxyRules = require("http-proxy-rules"),
  accesslog = require("access-log");

const localUrl = `http://localhost:${process.env.SERVER_PORT}`;

const proxyRules = new HttpProxyRules({
  rules: {
    "/ui": `${localUrl}/ui`,
    "/assests-ui": `${localUrl}/assests-ui`,
    "/favicon.ico": `${localUrl}/favicon.ico`,
    "/([0-9a-z]+).hot-update": `${localUrl}/$1.hot-update.json`,
    "/zen": process.env.BASE_PATH,
  },
  default: process.env.BASE_PATH
});

const proxy = httpProxy.createProxy();
const port = 6011;

https
  .createServer((req, res) => {
    console.log("-------------------123",req.headers.host);
    let target = proxyRules.match(req);
    console.log("target:---", target);
    accesslog(req, res);
    return proxy.web(req, res, {
      changeOrigin: true,
      target: target,
      secure:false,
      headers: {
        'x-forwarded-host': process.env.BASE_PATH.split("//")[1],
        "x-host": req.headers.host
      }
    });
  })
  .listen(port, err => {
    if (err) {
      return console.log("something bad happened", err);
    }
    console.log(`server is listening on ${port}`);
  });

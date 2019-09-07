/* eslint-disable no-console */
require("dotenv").config();

const https = require("http"),
  httpProxy = require("http-proxy"),
  HttpProxyRules = require("http-proxy-rules"),
  accesslog = require("access-log");

const proxyRules = new HttpProxyRules({
  rules: {
    "/zen": process.env.BASE_PATH,
  },
  default: `http://localhost:${process.env.SERVER_PORT}`
});

const proxy = httpProxy.createProxy();
const port = 5011;

https
  .createServer((req, res) => {
    console.log("------------------------------------------");
    let target = proxyRules.match(req);
    console.log("target:---", target);
    accesslog(req, res);
    return proxy.web(req, res, {
      changeOrigin: true,
      target: target,
      headers: {
        'x-forwarded-host': process.env.BASE_PATH.split("//")[1]
      }
    });
  })
  .listen(port, err => {
    if (err) {
      return console.log("something bad happened", err);
    }
    console.log(`server is listening on ${port}`);
  });

import React from "react";
import bootstrap from "@mt-ui-core";
import Root from "@components/root";
import { POLYFILL } from "mt-ui-core/config/polyfill";

bootstrap("root", {
  Application: <Root />,
  polyfillList: [POLYFILL.FETCH, POLYFILL.FOREACH]
});

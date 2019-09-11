import BaseRoutes from "@config/base.routes";
import { deepmerge } from "@utils";

import { SETTING_TYPES } from "./constants";
const Routes = {
  settings: {
    [SETTING_TYPES.GENERAL]: "/general",
    [SETTING_TYPES.SCORING]: "/scoring",
    [SETTING_TYPES.REMINDERS]: "/reminders"
  }
};

export default deepmerge(BaseRoutes, Routes);

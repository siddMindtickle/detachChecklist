import { LIFECYCLE_STAGES } from "@config/env.config";
const Routes = {};
Routes.login = "/login";
Routes.register = "/signup";
Routes.base = "/";
Routes.notFound = "/404";
Routes.lifecycle = {
  [LIFECYCLE_STAGES.BUILD]: "/build",
  [LIFECYCLE_STAGES.SETTINGS]: "/settings",
  [LIFECYCLE_STAGES.PUBLISH]: "/publish",
  [LIFECYCLE_STAGES.INVITE]: "/invite-track"
};
export default Routes;

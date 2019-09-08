import BaseRoutes from "@config/base.routes";
import { CONTENT_ACCESS_TABS } from "./constants";
const Routes = {};

export const ROUTES = {
  CHECKLIST: "checklist",
  ILT: "ilt",
  RULES: "rules"
};

Routes[ROUTES.CHECKLIST] = "/ui/checklist/:seriesId/:moduleId";
Routes[ROUTES.ILT] = "/ui/ilt/:seriesId/:moduleId";
Routes[ROUTES.RULES] = "/ui/rules";

Routes[CONTENT_ACCESS_TABS.CONTENT] = "/dashboard";
Routes[CONTENT_ACCESS_TABS.ANALYTICS] = "/analytics";
Routes[CONTENT_ACCESS_TABS.LEARNERS] = "/learners";
Routes[CONTENT_ACCESS_TABS.REVIEWS] = "/reviews";

export const ActiveTab = {};
ActiveTab[ROUTES.CHECKLIST] = CONTENT_ACCESS_TABS.CONTENT;
ActiveTab[ROUTES.ILT] = CONTENT_ACCESS_TABS.CONTENT;

export const RoutesPattern = {};
RoutesPattern[ROUTES.CHECKLIST] = /\/ui\/checklist\/\d+\/\d+/;
RoutesPattern[ROUTES.ILT] = /\/ui\/ilt\/\d+\/\d+/;
RoutesPattern[ROUTES.RULES] = /\/ui\/rules/;

export default {
  ...Routes,
  ...BaseRoutes
};

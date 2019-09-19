const Routes = {};

export const ROUTES = {
  CHECKLIST: "checklist",
  ILT: "ilt",
  RULES: "rules"
};

Routes[ROUTES.CHECKLIST] = "/ui/checklist/:seriesId/:moduleId";

export default Routes;

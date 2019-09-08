import { checkAccessByPermissionsMap as checkAccess } from "@utils/permissions";

import Routes, { ActiveTab, ROUTES, RoutesPattern } from "../config/routes";
import { BURGER_MENU_KEY, CONTENT_ACCESS_TAB_NAME, CONTENT_ACCESS_TABS } from "../config/constants";
import { CONTENT_ACCESS_MAP, ROUTES_ACCESS_MAP } from "../config/permissions";

const filterReviewTab = tabs => {
  Object.keys(tabs).filter(tab => tab == CONTENT_ACCESS_TABS.REVIEWS);
};

export const getHeaderLinksByPermissions = ({
  permissions: globalPermissions,
  isReviewer,
  isReviewerOnly,
  isSiteOwner
}) => {
  const result = [];
  const tabs = isReviewerOnly ? filterReviewTab(CONTENT_ACCESS_MAP) : CONTENT_ACCESS_MAP;

  for (const [tab, permissions] of Object.entries(tabs)) {
    if (isReviewer && tab == CONTENT_ACCESS_TABS.REVIEWS) {
      result.push({
        title: CONTENT_ACCESS_TAB_NAME[tab],
        link: Routes[tab]
      });
    } else if (
      tab !== CONTENT_ACCESS_TABS.REVIEWS &&
      checkAccess({ globalPermissions, permissions, isSiteOwner })
    ) {
      result.push({
        title: CONTENT_ACCESS_TAB_NAME[tab],
        link: Routes[tab]
      });
    }
  }
  return result;
};

export const getActiveTab = ({ location: { pathname = "" } = {} }) => {
  let activeRoute = "";
  Object.values(ROUTES).forEach(route => {
    activeRoute = pathname.match(RoutesPattern[route]) ? route : activeRoute;
  });
  return CONTENT_ACCESS_TAB_NAME[ActiveTab[activeRoute]];
};

export const hasRouteAccess = (route, { permissions }) => {
  const accessMap = ROUTES_ACCESS_MAP[route] || {};
  const hasPermission = checkAccess({
    globalPermissions: permissions,
    permissions: accessMap
  }); // any of the permissions
  return hasPermission;
};

const hasFeatureAccess = (route, { features }) => {
  const { features: routeFeatures } = ROUTES_ACCESS_MAP[route] || {};

  const hasFeatureEnabled = routeFeatures
    ? routeFeatures.every(routeFeature => features[routeFeature])
    : true; // all of the features

  return hasFeatureEnabled;
};

export const hasModuleAccess = (route, { permissions, features }) => {
  return hasFeatureAccess(route, { features }) && hasRouteAccess(route, { permissions });
};

export const getBurgerMenuOptions = ({ moreLearningSites, permissions, features }) => {
  const options = [
    {
      text: "View Your Learning Site",
      value: BURGER_MENU_KEY.VIEW_LS
    },
    {
      text: "Account Setting",
      value: BURGER_MENU_KEY.SETTING
    }
  ];
  hasModuleAccess(BURGER_MENU_KEY.VIEW_PMH, { permissions, features }) &&
    options.push({
      text: "Profile Management",
      value: BURGER_MENU_KEY.VIEW_PMH
    });
  moreLearningSites &&
    options.push({
      text: "Switch Learning Site",
      value: BURGER_MENU_KEY.SWITCH_LS
    });
  hasModuleAccess(ROUTES.RULES, { permissions, features }) &&
    options.push({
      text: "Automation Rules",
      value: BURGER_MENU_KEY.VIEW_AR
    });
  hasModuleAccess(BURGER_MENU_KEY.MANAGE_TAGS, { permissions, features }) &&
    options.push({
      text: "Manage Tags",
      value: BURGER_MENU_KEY.MANAGE_TAGS
    });
  return options;
};

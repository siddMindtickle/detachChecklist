import { STAGES_ACCESS_MAP } from "@config/permissions.config";

export const haveAccess = (
  permissionsToCheck = [],
  globalPermissions = {},
  contextPermissions = {}
) => {
  // if (!permissionsToCheck.length) return true;
  const {
    ALLOW: globalAllow = [],
    DENY: globalDeny = [],
    OVERRIDE: globalOverride = []
  } = globalPermissions;
  const { ALLOW: contextAllow = [], DENY: contextDeny = [] } = contextPermissions;

  const allowedPermissions = globalOverride
    .union(globalAllow.subtract(contextDeny))
    .union(contextAllow.subtract(globalDeny));

  return permissionsToCheck.some(permission => allowedPermissions.includes(permission));
};

export const checkAccessByPermissionsMap = ({
  globalPermissions,
  contextPermissions,
  permissions: { allow = [], deny = [] },
  isSiteOwner
}) => {
  if (isSiteOwner) {
    return true;
  } else if (!(allow.length || deny.length)) {
    return true;
  } else if (allow.length && deny.length) {
    return (
      haveAccess(allow, globalPermissions, contextPermissions) &&
      !haveAccess(deny, globalPermissions, contextPermissions)
    );
  } else if (allow.length) {
    return haveAccess(allow, globalPermissions, contextPermissions);
  } else {
    return !haveAccess(deny, globalPermissions, contextPermissions);
  }
};

export const haveStageAccess = (
  stage,
  globalPermissions,
  contextPermissions,
  { isSiteOwner } = {}
) => {
  return checkAccessByPermissionsMap({
    permissions: STAGES_ACCESS_MAP[stage],
    globalPermissions,
    contextPermissions,
    isSiteOwner
  });
};

export const parseScopedPermissions = ({
  permissions,
  userId,
  globalPermissions: { OVERRIDE = [] } = {}
}) => {
  const parsedPermissions = {
    ALLOW: [],
    DENY: []
  };
  const { rules = [] } = permissions;
  rules.forEach(({ permission, rule: { accessType, userids = [] } = {} }) => {
    if (accessType === "ALL" || OVERRIDE.includes(permission)) {
      parsedPermissions.ALLOW.push(permission);
    } else {
      userids.includes(userId)
        ? parsedPermissions.ALLOW.push(permission)
        : parsedPermissions.DENY.push(permission);
    }
  });
  return parsedPermissions;
};

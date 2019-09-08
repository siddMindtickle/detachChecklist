import { get } from "@utils/apiUtils";
import ApiUrls from "../config/api.config";

const permissionsByCompany = {};

const parseRolesPermissions = (
  companyId,
  { roles: { permissions = {}, permissionOrder = {}, roles = {} } }
) => {
  let rolesNameMap = {},
    rolesPermissionsMap = {};
  for (const [id, { name, permissions: rolePermissions }] of Object.entries(roles)) {
    rolesNameMap[id] = name;
    rolesPermissionsMap[id] = rolesPermissionsMap[id] || {
      OVERRIDE: [],
      DENY: [],
      ALLOW: []
    };
    for (const [permission, mode] of Object.entries(rolePermissions)) {
      rolesPermissionsMap[id][mode].push(permission);
    }
  }

  permissionsByCompany[companyId] = {
    permissionsNameMap: permissions || {},
    permissionsOrder: permissionOrder || {},
    rolesNameMap: rolesNameMap || {},
    rolesPermissionsMap: rolesPermissionsMap || {}
  };

  return permissionsByCompany[companyId];
};

const fetchRolesPermissions = async companyId => {
  if (permissionsByCompany[companyId]) {
    await Promise.resolve();
    return permissionsByCompany[companyId];
  } else {
    try {
      const { rolesData: roles = {} } = await get(ApiUrls.getAllRolesPermissions());
      return parseRolesPermissions(companyId, { roles });
    } catch (error) {
      console.log("permissions get fail"); //eslint-disable-line
    }
  }
};

export const getPermissionByRoles = async (companyId, roles) => {
  const companyPermissions = await fetchRolesPermissions(companyId);
  const permissionsByRoles = companyPermissions.rolesPermissionsMap;

  if (!Array.isArray(roles)) roles = [roles];
  return roles.reduce(
    (permissions, role) => {
      const { OVERRIDE, DENY, ALLOW } = permissionsByRoles[role];
      permissions.OVERRIDE = permissions.OVERRIDE.concat(OVERRIDE);
      permissions.ALLOW = permissions.ALLOW.concat(ALLOW);
      permissions.DENY = permissions.DENY.concat(DENY);
      return permissions;
    },
    { OVERRIDE: [], DENY: [], ALLOW: [] }
  );
};

import { handleQueryStringForApi } from "@utils";
let apiUrls = {
  checkAuth() {
    return {
      url: "/wapi/auth",
      mock: "auth",
      mockType: "success"
    };
  },
  logout(userId) {
    return {
      url: `/user/${userId}/logout?_=${Date.now()}`
    };
  },
  getAllRolesPermissions() {
    return {
      url: "/wapi/roles",
      mock: "rolesPermissions",
      mockType: "success"
    };
  },
  getCompanyAdmins({ companyId }) {
    return {
      url: `/${companyId}/admins/fetch`
    };
  }
};

export default handleQueryStringForApi(apiUrls);

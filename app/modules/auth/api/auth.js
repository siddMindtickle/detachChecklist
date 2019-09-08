import { get, post } from "@utils/apiUtils";
import { Defaults } from "@config/env.config";
import ApiUrls from "../config/api.config";
import { getPermissionByRoles } from "../utils/roles";

const AuthService = {};

const processAuthData = async (response = {}) => {
  const {
    user = {},
    learner: { roles = [], learner_uid },
    default_settings: {
      moduleTaggingEnabled: taggingEnabled,
      profileFieldsToDisplayInOrder,
      ruleAutomationEnabled,
      insightsEnabled,
      moduleRelevanceEnabled
    },
    isReviewer,
    isReviewerOnly,
    isExcludedInMixpanel: disableTracking,
    fullStoryEnabledAS: fullStoryEnabled,
    lsCount,
    lsLink: learningSiteLink,
    lsName: learningSiteName,
    freshchat_id,
    freshchatRestoreId,
    companyId,
    newDashboard
  } = response;
  const isSiteOwner = roles.includes(Defaults.siteOwnerRole);
  const showSmartInsights = insightsEnabled && isSiteOwner;
  const permissions = await getPermissionByRoles(learningSiteLink, roles);
  return {
    name: user.name,
    email: user.email || `${learner_uid}@mt-test.com`,
    id: user.id,
    image: user.pic,
    addedOn: user.added_on,
    permissions,
    roles: roles,
    isSiteOwner,
    freshchat: {
      freshchatRestoreId,
      freshchatId: freshchat_id
    },
    taggingEnabled,
    disableTracking,
    isReviewer,
    isReviewerOnly,

    timestamp: user.state && user.state.timestamp,
    moreLearningSites: !!lsCount,
    company: {
      url: learningSiteLink,
      name: learningSiteName,
      id: companyId,
      profileFieldsToDisplayInOrder,
      isNewDashboard: newDashboard ? true : false
    },
    companyId,
    features: {
      taggingEnabled,
      ruleAutomationEnabled,
      showSmartInsights,
      moduleRelevanceEnabled,
      fullStoryEnabled
    }
  };
};

const parseAdmins = (admins = []) => {
  return admins.map(admin => {
    return {
      email: admin.email,
      name: admin.name,
      id: admin.id
    };
  });
};

AuthService.auth = async () => {
  try {
    let response = await get(ApiUrls.checkAuth());
    response = await processAuthData(response);
    return response;
  } catch (error) {
    throw error;
  }
};

AuthService.logout = async userId => {
  try {
    await get(ApiUrls.logout(userId));
  } catch (error) {
    throw error;
  }
};

AuthService.getCompanyAdmins = async ({ companyId }) => {
  const { admins } = await post(ApiUrls.getCompanyAdmins({ companyId }), {
    body: {
      from: 0,
      size: 500
    }
  });
  return parseAdmins(admins);
};
export default AuthService;

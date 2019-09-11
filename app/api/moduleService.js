import { get, post, del } from "@utils/apiUtils";
import { isObject } from "@utils";
import { parseScopedPermissions } from "../utils/permissions";
import ApiUrls from "@config/api.config";
import { API_KEY_MAP, DRAFT_STATE } from "@config/global.config";

const ModuleService = {};

const preProcessDetails = data => {
  const processedData = {};
  for (let [key, value] of Object.entries(data)) {
    const apiKey = API_KEY_MAP.module_static[key];
    if (apiKey) {
      value = isObject(value) ? preProcessDetails(value) : value;
      processedData[apiKey] = value;
    }
  }
  return processedData;
};

const parseSeries = (response, userId, globalPermissions) => {
  return {
    id: response.id,
    name: response.name,
    permissions: parseScopedPermissions({
      permissions: response.prm || {},
      userId,
      globalPermissions
    }),
    seriesLevelMailSettings: {
      moduleInvitaionEmailEnabled: response.moduleInvitaionEmailEnabled,
      reminderMailEnabled: response.reminderMailEnabled
    },
    sequentiallyLockedSeries: response.sequentialUnlockingEnabled
  };
};

const parseMaxScore = (response = {}) => {
  return {
    maxScore: response.maxScore || 0
  };
};

const parseStaticData = response => {
  const {
    id,
    name,
    description,
    scoring,
    score,
    hallOfFame,
    showSections,
    companyId,
    mappedSeries,
    sequentialLock,
    dueDate,
    dueDateExpiry,
    dueDateType,
    dueDateValue,
    defaultThumb,
    thumb,
    thumbId,
    thumbTitle,
    thumbObj,
    thumbUrl,
    thumbType,
    isPublished,
    multipleEnrollment,
    learnerCnfSsnEmail,
    restrictLearnerEnroll,
    showLearnerTimezone,
    moduleRelevance
  } = API_KEY_MAP.module_static;
  response[dueDate] = response[dueDate] || {};
  return {
    id: response[id],
    name: response[name],
    description: response[description],
    scoring: !!response[scoring],
    score: response[score] || 0,
    hallOfFame: !!response[hallOfFame],
    showSections: response[showSections],
    companyId: response[companyId],
    mappedSeries: response[mappedSeries].map(({ series }) => series),
    sequentialLock: response[sequentialLock],
    isPublished: response[isPublished] !== DRAFT_STATE,
    multipleEnrollment: response[multipleEnrollment],
    learnerCnfSsnEmail: response[learnerCnfSsnEmail],
    restrictLearnerEnroll: response[restrictLearnerEnroll],
    showLearnerTimezone: response[showLearnerTimezone],
    moduleRelevance: response[moduleRelevance],
    invitedLearnersCountLoaded: false,
    dueDate: {
      dueDateExpiry: response[dueDate][dueDateExpiry],
      dueDateType: response[dueDate][dueDateType],
      dueDateValue: response[dueDate][dueDateValue]
    },
    defaultThumb: {
      thumbId: response[defaultThumb][thumbId],
      thumbTitle: response[defaultThumb][thumbTitle],
      thumbUrl: response[defaultThumb][thumbObj][thumbUrl],
      thumbType: response[defaultThumb][thumbType]
    },
    thumb: {
      thumbId: response[thumb][thumbId],
      thumbTitle: response[thumb][thumbTitle],
      thumbUrl: response[thumb][thumbObj][thumbUrl],
      thumbType: response[thumb][thumbType]
    }
  };
};

ModuleService.getDetails = async ({ moduleId, seriesId, userId, globalPermissions }) => {
  try {
    const response = {};
    const {
      module_static: moduleDetails,
      series_info: seriesDetails,
      unpublished_changes: hasUnpubChanges
    } = await get(ApiUrls.getDetails({ moduleId, query: { forSeries: seriesId } }));
    response.series = parseSeries(seriesDetails, userId, globalPermissions);
    response.details = parseStaticData(moduleDetails);
    response.hasUnpubChanges = hasUnpubChanges;
    return response;
  } catch (error) {
    throw error;
  }
};

ModuleService.modifyDetails = async ({ moduleId, seriesId, data }) => {
  try {
    const response = await post(
      ApiUrls.modifyDetails({
        moduleId,
        query: {
          forSeries: seriesId
        }
      }),
      {
        body: preProcessDetails(data)
      }
    );
    return parseStaticData(response);
  } catch (error) {
    throw error;
  }
};

ModuleService.getMaxScore = async ({ moduleId, seriesId }) => {
  try {
    const { entityData } = await get(
      ApiUrls.getMaxScore({
        moduleId,
        query: {
          forSeries: seriesId
        }
      })
    );
    return parseMaxScore(entityData);
  } catch (error) {
    throw error;
  }
};

ModuleService.discardModule = async ({ moduleId, companyId, seriesId }) => {
  try {
    const response = await del(
      ApiUrls.discard({
        moduleId,
        companyId,
        query: {
          forSeries: seriesId
        }
      })
    );
    return response;
  } catch (error) {
    throw error;
  }
};

ModuleService.archiveModule = async ({ moduleId, companyId, seriesId }) => {
  try {
    const response = await del(
      ApiUrls.archive({
        moduleId,
        companyId,
        query: {
          forSeries: seriesId
        }
      })
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export default ModuleService;

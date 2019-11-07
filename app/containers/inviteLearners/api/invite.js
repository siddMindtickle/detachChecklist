import { post, get } from "@utils/apiUtils";
import { hasValue } from "@utils";
import ApiUrls from "../config/api.config";
import {
  INVITE_TYPE,
  PROFILE_FIELDS_DELIMITER,
  INVITE_EXISTING_SORT_ON,
  POLLING_STATUS,
  RELEVANCE_SETTING_ENUM
} from "../config/constants";

const InviteService = {};

const serializeProfileFields = (profileFields, serializeFieldValues = true) => {
  if (profileFields) {
    const profiles = profileFields.reduce((acc, { field, profileKeys = [] }) => {
      if (field) {
        const keys = acc[field] || [];
        acc[field] = keys.union(profileKeys);
      }
      return acc;
    }, {});
    if (!serializeFieldValues) return profiles;
    return Object.keys(profiles).reduce((acc, profileField) => {
      acc[profileField] = profiles[profileField].join(PROFILE_FIELDS_DELIMITER);
      return acc;
    }, {});
  }
};

const getParams = ({ inviteType = INVITE_TYPE.INVITE_EXISTING, inviteToSeries, ...params }) => {
  const { start, count, query: search, seriesId, moduleId, profileFields, groupIds } = params;
  const body = {
    filters: { profile: serializeProfileFields(profileFields) },
    groupIds
  };
  const query = { start, count, query: search };

  if (inviteType === INVITE_TYPE.INVITE_EXISTING) {
    query.sort_on = INVITE_EXISTING_SORT_ON;
    if (inviteToSeries) {
      query.includeAlreadyMatchingCount = true;
      query.series = `!${seriesId}`;
    } else {
      query.notInvitedFromSeries = seriesId;
      query.entity = `!${moduleId}`;
    }
  }
  return { body, query };
};

const preProcessFiltersForInvite = filters => {
  if (!hasValue(filters)) return {};
  const { query, profileFields, groupIds } = filters;
  return {
    profiles: serializeProfileFields(profileFields, false),
    groups: groupIds,
    query
  };
};

const parseLearner = (acc, { id, name, email, groups, pic, entity_count = 0, total_count = 0 }) => {
  acc[id] = {
    displayName: name || email || id,
    profilePic: pic,
    id,
    name,
    email,
    groups,
    entity_count,
    total_count
  };
  return acc;
};

const getLearnerId = learner => learner.id;

const parseLearners = ({ count, start, total, learners }) => ({
  count,
  start,
  total,
  ids: learners.map(getLearnerId),
  learners: learners.reduce(parseLearner, {})
});

const parseProfileField = profileField => ({
  ...profileField,
  text: profileField.displayName,
  value: profileField.shortKey
});
const parseProfileFields = ({ profile_fields: profileFields }) =>
  profileFields.map(parseProfileField);

// profileKeys
const parseProfileKey = profileKey => ({ text: profileKey, value: profileKey });
const parseProfileKeyData = profileKeys => profileKeys.map(parseProfileKey);

const parsePollingStatus = response => {
  return {
    status: POLLING_STATUS[response.status],
    successIds: response.success,
    errorIds: response.error
  };
};

const createRelevanceMap = (
  type,
  userReq,
  moduleRelevanceSelection,
  defaultModuleRelevanceSelection
) => {
  let entityRelevance = [];
  const { ids, groups, learners } = userReq;
  switch (type) {
    case INVITE_TYPE.INVITE_EXISTING:
      if (ids && ids.length > 0) {
        ids.forEach(id => {
          entityRelevance.push({
            settingTypeEnum: RELEVANCE_SETTING_ENUM.USER,
            id,
            relevanceTypeEnum:
              moduleRelevanceSelection && moduleRelevanceSelection[id]
                ? moduleRelevanceSelection[id]
                : defaultModuleRelevanceSelection
          });
        });
      } else {
        entityRelevance.push({
          settingTypeEnum: RELEVANCE_SETTING_ENUM.ALL,
          relevanceTypeEnum: defaultModuleRelevanceSelection
        });
      }
      break;
    case INVITE_TYPE.INVITE_GROUP:
      groups.forEach(gid => {
        entityRelevance.push({
          settingTypeEnum: RELEVANCE_SETTING_ENUM.GROUP,
          id: gid,
          relevanceTypeEnum:
            moduleRelevanceSelection && moduleRelevanceSelection[gid]
              ? moduleRelevanceSelection[gid]
              : defaultModuleRelevanceSelection
        });
      });

      break;
    case INVITE_TYPE.ADD_INVITE_NEW:
      learners.forEach(learner => {
        const { email } = learner;
        entityRelevance.push({
          settingTypeEnum: RELEVANCE_SETTING_ENUM.USER,
          id: email,
          relevanceTypeEnum:
            moduleRelevanceSelection && moduleRelevanceSelection[email]
              ? moduleRelevanceSelection[email]
              : defaultModuleRelevanceSelection
        });
      });

      break;
  }

  return entityRelevance;
};

InviteService.getLearners = async ({
  moduleId,
  companyId,
  seriesId,
  inviteType,
  inviteToSeries,
  ...rest
}) => {
  try {
    const { query: queryParams, body: bodyParams } = getParams({
      inviteType,
      inviteToSeries,
      moduleId,
      seriesId,
      ...rest
    });
    const response = await post(
      ApiUrls.getLearners({
        moduleId,
        companyId,
        query: queryParams
      }),
      { body: bodyParams }
    );
    return parseLearners(response);
  } catch (error) {
    throw error;
  }
};

// groups
const parseGroup = ({ id, name }) => ({ id, value: id, text: name });

const parseGroups = ({ groups, total }) => ({
  data: groups.map(parseGroup),
  total
});

InviteService.checkExistingLearner = async ({ companyId, moduleId, email, name, seriesId }) => {
  try {
    const response = await post(
      ApiUrls.checkExistingLearner({
        companyId,
        query: {
          series: seriesId,
          entity: moduleId
        }
      }),
      { body: { emails: email } }
    );
    return {
      email,
      name,
      exists: response[email].exists
    };
  } catch (error) {
    throw error;
  }
};

InviteService.addToPlatform = async ({
  learners,
  inviteToSeries,
  companyId,
  moduleRelevanceSelection,
  defaultModuleRelevanceSelection,
  moduleRelevanceEnabled
}) => {
  learners = learners.map(learner => {
    let { email, moduleRelevance, seriesEntities, ...rest } = learner;

    if (moduleRelevanceEnabled && !moduleRelevance) {
      moduleRelevance =
        moduleRelevanceSelection && moduleRelevanceSelection[email]
          ? moduleRelevanceSelection[email]
          : defaultModuleRelevanceSelection;
    }

    if (inviteToSeries || !moduleRelevanceEnabled) {
      moduleRelevance = undefined;
    } else {
      if (
        seriesEntities &&
        seriesEntities[0] &&
        seriesEntities[0].entities &&
        seriesEntities[0].entities.length > 0
      ) {
        seriesEntities = seriesEntities.map(seriesEntry => {
          let newSeriesEntry = { ...seriesEntry };
          newSeriesEntry.moduleInvitationPropertiesMap = {
            [seriesEntry.entities[0]]: {
              moduleRelevance: moduleRelevance
            }
          };
          return newSeriesEntry;
        });
      }
    }

    const resultLearner = {
      ...rest,
      seriesEntities,
      email
    };

    if (moduleRelevanceEnabled && !inviteToSeries)
      resultLearner.moduleRelevance = moduleRelevance;

    return resultLearner;
  });

  const reqBody = { learners, reactReq: true };

  try {
    const response = await post(
      ApiUrls.addToPlatform({
        companyId
      }),
      { body: reqBody }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

InviteService.getProfileFields = async ({ companyId }) => {
  const response = await get(
    ApiUrls.getProfileFields({
      companyId
    })
  );
  return parseProfileFields(response);
};

InviteService.getManagerFields = async ({ companyId }) => {
  const response = await get(
    ApiUrls.getManagerFields({
      companyId
    })
  );
  return response.manager_fields;
};

InviteService.getGroups = async ({ companyId, moduleId, seriesId, inviteToSeries, ...rest }) => {
  const query = { ...rest };
  inviteToSeries && (query.seriesId = seriesId);
  const response = await get(
    ApiUrls.getGroups({
      companyId,
      moduleId,
      query
    })
  );
  return parseGroups(response);
};

InviteService.getProfileKeyData = async ({ companyId, profileField }) => {
  try {
    const response = await get(
      ApiUrls.getProfileKeyData({
        companyId,
        query: { profileField }
      })
    );
    return parseProfileKeyData(response.data);
  } catch (error) {
    throw error;
  }
};

InviteService.inviteGroups = async ({
  companyId,
  seriesId,
  moduleId,
  groups,
  moduleRelevanceSelection,
  defaultModuleRelevanceSelection,
  moduleRelevanceEnabled,
  ...rest
}) => {
  let response;
  let linkingInfo = groups.map(gid => ({ gid, sid: seriesId, link: true }));
  let entityRelevance = createRelevanceMap(
    INVITE_TYPE.INVITE_GROUP,
    { groups },
    moduleRelevanceSelection,
    defaultModuleRelevanceSelection
  );
  let body = {
    userReq: { groups },
    linkingInfo,
    reactReq: true
  };

  let { inviteToSeries } = rest;
  if (inviteToSeries) {
    body.seriesIds = [seriesId];
    response = await post(ApiUrls.inviteAllToSeries({ companyId }), { body });
  } else {
    if (moduleRelevanceEnabled) body.entityRelevance = entityRelevance;
    response = await post(
      ApiUrls.inviteAll({
        companyId,
        moduleId,
        query: {
          fromSeriesId: seriesId
        }
      }),
      { body }
    );
  }
  return response;
};

InviteService.inviteExisiting = async ({
  companyId,
  seriesId,
  moduleId,
  inviteToSeries,
  filters,
  moduleRelevanceSelection,
  defaultModuleRelevanceSelection,
  moduleRelevanceEnabled,
  ...rest
}) => {
  const params = rest.ids && rest.ids.length ? {} : preProcessFiltersForInvite(filters);
  const userReq = { ...params, ...rest };
  const body = { reactReq: true };
  let entityRelevance = createRelevanceMap(
    INVITE_TYPE.INVITE_EXISTING,
    userReq,
    moduleRelevanceSelection,
    defaultModuleRelevanceSelection
  );

  let response;
  if (inviteToSeries) {
    body.seriesIds = [seriesId];
    response = await post(ApiUrls.inviteAllToSeries({ companyId }), {
      body: { ...body, userReq }
    });
  } else {
    if (moduleRelevanceEnabled) body.entityRelevance = entityRelevance;
    response = await post(
      ApiUrls.inviteAll({
        companyId,
        moduleId,
        query: { fromSeriesId: seriesId }
      }),
      { body: { ...body, userReq } }
    );
  }
  return response;
};

InviteService.pollStatus = async ({ companyId, processId }) => {
  try {
    const response = await get(
      ApiUrls.pollStatus({
        companyId,
        processId
      })
    );
    return parsePollingStatus(response[processId] || {});
  } catch (error) {
    throw error;
  }
};

export default InviteService;

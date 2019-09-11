import { get, post } from "@utils/apiUtils";
import { prune } from "@utils";
import ApiUrls from "../config/api.config";

import { LEARNER_TYPES } from "../config/constants";

const PublishService = {};

// learnersCount
const parseInvitedLearnersCount = ({ seriesAggr }) => {
  const series = Object.keys(seriesAggr);
  let fullCount = 0,
    allCount = 0,
    allPrivateCount = 0;

  // filter out private series
  const privateSeries = series.filter(seriesId => !seriesAggr[seriesId].isPublic);
  // check if there is even a single private series
  const numOfPrivateSeries = privateSeries.length;

  // calculate all and full count learners
  series.forEach(key => {
    const { FULL = 0, TOTAL = 0, isPublic } = seriesAggr[key];
    fullCount += FULL;
    allCount += isPublic ? FULL : TOTAL;
    !isPublic && (allPrivateCount += TOTAL);
  });

  const hasPrivateSeries = numOfPrivateSeries > 0;

  return {
    hasPrivateSeries,
    allPrivateCount,
    selectOption: series.length === numOfPrivateSeries,
    noLearners: hasPrivateSeries ? !allCount : !fullCount,
    fullCount,
    allCount
  };
};

// learners
const parseLearner = (acc, { id, name, email, groups, entity_count, total_count }) => {
  acc[id] = prune({
    id,
    name: name || email || id,
    email: email || name || id,
    groups,
    entity_count,
    total_count
  });
  return acc;
};

const addLearnerId = (acc, learner) => [...acc, learner.id];

const parseInvitedLearners = ({ learners, total }) => {
  return {
    total,
    data: learners.reduce(addLearnerId, []),
    learners: learners.reduce(parseLearner, {})
  };
};

// groups
const parseGroup = ({ id, name }) => ({ value: id, text: name });

const parseGroups = ({ groups }) => groups.map(parseGroup);

// profile fields
const parseProfileField = ({ displayName, shortKey }) => ({
  text: displayName,
  value: shortKey
});
const parseProfileFields = ({ profile_fields: profileFields }) =>
  profileFields.map(parseProfileField);

// profileKeys
const parseProfileKey = profileKey => ({ text: profileKey, value: profileKey });
const parseProfileKeyData = profileKeys => profileKeys.map(parseProfileKey);

const serializeProfileFields = profileFields => {
  if (profileFields) {
    return profileFields.reduce((acc, { field, profileKeys }) => {
      if (field) {
        acc[field] = profileKeys.join("_#_");
      }
      return acc;
    }, {});
  }
};

PublishService.getInvitedLearnersCount = async ({ moduleId, seriesId }) => {
  try {
    const response = await get(
      ApiUrls.getInvitedLearnersCount({
        moduleId,
        query: { forSeries: seriesId }
      })
    );
    return parseInvitedLearnersCount(response);
  } catch (error) {
    throw error;
  }
};
PublishService.getFullLearners = async ({
  moduleId,
  seriesId,
  companyId,
  mappedSeries,
  groupIds,
  ...rest
}) => {
  try {
    const response = await post(
      ApiUrls.getLearners({
        companyId,
        moduleId,
        query: { ...rest, forSeries: seriesId }
      }),
      {
        body: {
          seriesInviteType: LEARNER_TYPES.FULL,
          seriesIds: mappedSeries,
          groupIds
        }
      }
    );
    return parseInvitedLearners(response);
  } catch (error) {
    throw error;
  }
};

PublishService.getAllLearners = async ({
  mappedSeries,
  seriesId,
  moduleId,
  companyId,
  groupIds,
  ...rest
}) => {
  try {
    const response = await post(
      ApiUrls.getLearners({
        moduleId,
        companyId,
        query: { ...rest, forSeries: seriesId }
      }),
      {
        body: {
          seriesInviteType: LEARNER_TYPES.ALL,
          seriesIds: mappedSeries,
          groupIds
        }
      }
    );
    return parseInvitedLearners(response);
  } catch (error) {
    throw error;
  }
};

PublishService.getSelectedLearners = async ({
  moduleId,
  seriesId,
  companyId,
  mappedSeries,
  groupIds,
  profileFields = [],
  ...rest
}) => {
  try {
    const response = await post(
      ApiUrls.getSelectedLearners({
        moduleId,
        companyId,
        seriesId,
        query: {
          ...rest,
          forSeries: seriesId,
          sort_on: "companies.series.added_on",
          sort_order: "desc"
        }
      }),
      {
        body: {
          seriesIds: mappedSeries,
          groupIds,
          filters: {
            profile: serializeProfileFields(profileFields)
          }
        }
      }
    );
    return parseInvitedLearners(response);
  } catch (error) {
    throw error;
  }
};

PublishService.getGroups = async ({ moduleId, seriesId, companyId, ...rest }) => {
  try {
    const response = await get(
      ApiUrls.getGroups({
        moduleId,
        companyId,
        query: { ...rest, forSeries: seriesId }
      })
    );
    return parseGroups(response);
  } catch (error) {
    throw error;
  }
};

PublishService.getProfileFields = async ({ companyId }) => {
  try {
    const response = await get(
      ApiUrls.getProfileFields({
        companyId,
        query: { exclude_disabled: false }
      })
    );
    return parseProfileFields(response);
  } catch (error) {
    throw error;
  }
};

PublishService.getProfileKeyData = async ({ companyId, profileField }) => {
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

PublishService.publishData = async ({ companyId, moduleId, seriesId, ...rest }) => {
  try {
    const {
      search: query,
      profileFields,
      groupIds,
      userIds: uids,
      notify,
      type,
      numOfSelectedLearners,
      isPublic
    } = rest;
    const body = {
      query,
      groupIds,
      uids,
      isPublic,
      profile: serializeProfileFields(profileFields),
      notifyDestSeriesLearners: notify,
      totalInvitingLearners: numOfSelectedLearners
    };

    if (type === LEARNER_TYPES.SELECTED) {
      body.totalSelected = numOfSelectedLearners;
    } else {
      body.inviteTo = type;
    }

    const response = await post(
      ApiUrls.publishData({
        companyId,
        moduleId,
        query: {
          forSeries: seriesId,
          sendEmails: notify,
          upgrade: type
        }
      }),
      { body: { pubInviteOptions: body } }
    );
    return {
      ...response,
      notify,
      numOfSelectedLearners
    };
  } catch (error) {
    throw error;
  }
};

PublishService.getTodos = async ({ moduleId, seriesId }) => {
  const { todos = {} } = await get(
    ApiUrls.getTodos({
      moduleId,
      query: {
        forSeries: seriesId
      }
    })
  );
  return todos.totalErrors;
};

export default PublishService;

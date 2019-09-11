import { get, post } from "@utils/apiUtils";
import ApiUrls from "../config/api.config";
import {
  GET_FILTERS,
  GET_LEARNER_TYPE_BY_VALUE,
  SUPPORTED_SORTINGS_API_KEY,
  POLLING_STATUS,
  RELEVANCE_TYPE
} from "../config/track.constants";
const ChecklistTrackService = {};

const getPercentage = (value, total) => {
  const percent = total ? (value / total) * 100 : 0;
  return Math.round(percent) == percent ? percent : percent.toFixed(2);
};

const parseLearnerCounts = ({ ACTIVE = 0, COMPLETED = 0, ADDED = 0 } = {}) => {
  const TOTAL = ACTIVE + COMPLETED + ADDED;
  return {
    all: {
      count: TOTAL,
      displayIndex: 0
    },
    completed: {
      count: COMPLETED,
      percentage: getPercentage(COMPLETED, TOTAL),
      displayIndex: 3
    },
    inProgress: {
      count: ACTIVE,
      percentage: getPercentage(ACTIVE, TOTAL),
      displayIndex: 2
    },
    added: {
      count: ADDED,
      percentage: getPercentage(ADDED, TOTAL),
      displayIndex: 1
    }
  };
};

const parseLearners = (learners = []) => {
  const learnerDetails = learners.reduce((result, learner) => {
    const learnerStatus = GET_LEARNER_TYPE_BY_VALUE(learner.state);
    result[learner.id] = {
      email: learner.email,
      name: learner.name || learner.email || learner.learner_uid,
      invitedOn: learner.invitedOnValue * 1000,
      maxScore: learner.maxScore,
      score: learner.score,
      status: learnerStatus,
      completed: learner.completedLO,
      total: learner.totalLO,
      moduleRelevance: learner.moduleRelevance ? learner.moduleRelevance : RELEVANCE_TYPE.NONE
    };
    return result;
  }, {});
  return {
    learnerDetails,
    learnerIds: Object.keys(learnerDetails)
  };
};

const parseGroups = ({ groups }) => {
  return groups.map(({ id, name }) => ({ value: id, text: name }));
};

const parsePollingStatus = response => {
  return {
    status: POLLING_STATUS[response.status],
    successIds: response.success,
    errorIds: response.error
  };
};

ChecklistTrackService.getLearnersCount = async ({ companyId, moduleId, seriesId }) => {
  try {
    const { entities = {} } = await post(
      ApiUrls.getLearnersCountByStatus({
        companyId,
        query: {
          entities: moduleId,
          forSeries: seriesId
        }
      }),
      {
        body: {
          isTrackPage: true
        }
      }
    );
    return { ...parseLearnerCounts(entities[moduleId]) };
  } catch (error) {
    throw error;
  }
};

ChecklistTrackService.getLearners = async ({
  moduleId,
  seriesId,
  companyId,
  pagination,
  sort,
  filters = []
}) => {
  try {
    const { learners = [] } = await post(
      ApiUrls.getTrackLearners({
        moduleId,
        companyId,
        query: {
          start: pagination.start,
          count: pagination.rows,
          sort_on: SUPPORTED_SORTINGS_API_KEY[sort.type],
          sort_order: sort.order,
          forSeries: seriesId
        }
      }),
      {
        body: {
          filters: GET_FILTERS(filters)
        }
      }
    );
    return parseLearners(learners);
  } catch (error) {
    throw error;
  }
};

ChecklistTrackService.getGroups = async ({ moduleId, seriesId, companyId, ...rest }) => {
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

ChecklistTrackService.resetProgress = async ({ moduleId, seriesId, companyId, learnerIds }) => {
  try {
    const response = await post(
      ApiUrls.resetLearnerProgress({
        moduleId,
        companyId,
        query: { forSeries: seriesId }
      }),
      {
        body: {
          uids: learnerIds
        }
      }
    );
    return Object.keys(response || {});
  } catch (error) {
    throw error;
  }
};

ChecklistTrackService.changeRelevance = async ({
  moduleId,
  seriesId,
  companyId,
  learnerIds,
  moduleRelevanceSelection
}) => {
  try {
    const { processId } = await post(
      ApiUrls.changeModuleRelevance({
        moduleId,
        companyId,
        query: { forSeries: seriesId }
      }),
      {
        body: {
          uids: learnerIds,
          moduleRelevance: moduleRelevanceSelection
        }
      }
    );
    return processId;
  } catch (error) {
    throw error;
  }
};

ChecklistTrackService.removeLearners = async ({ moduleId, seriesId, companyId, learnerIds }) => {
  try {
    const { processId } = await post(
      ApiUrls.removeLearnerFromContext({
        companyId
      }),
      {
        body: {
          entity: moduleId,
          seriesId: seriesId,
          userReq: {
            ids: learnerIds
          }
        }
      }
    );
    return processId;
  } catch (error) {
    throw error;
  }
};
ChecklistTrackService.pollStatus = async ({ companyId, processId }) => {
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

export default ChecklistTrackService;

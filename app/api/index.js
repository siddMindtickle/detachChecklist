import { post, generateCheckSum } from "@utils/apiUtils";
import ApiUrls from "./api.config";
import { API_ENTITY_COMPLETION_STATES_MAP, ENTITY_COMPLETION_STATES } from "@config/env.config";

const GlobalService = {};

export const processGeData = ge_summary => {
  const {
    status,
    startedOn,
    version,
    totalScore,
    totalAttempts,
    reattemptVersion,
    totalLearningObjects
  } = ge_summary;
  return {
    startedOn,
    version,
    score: totalScore,
    reattempt: reattemptVersion,
    completedTasks: totalAttempts,
    totalTasks: totalLearningObjects,
    status: API_ENTITY_COMPLETION_STATES_MAP[status],
    isCompleted: status == ENTITY_COMPLETION_STATES.COMPLETED,
    isStarted: status !== ENTITY_COMPLETION_STATES.NOT_STARTED
  };
};

export const processUpdatedTopics = (updatedTopics = {}) => {
  const keys = Object.keys(updatedTopics);
  return keys.map(key => {
    return {
      id: key,
      state: API_ENTITY_COMPLETION_STATES_MAP[updatedTopics[key].state]
    };
  });
};

GlobalService.startEntity = async ({ moduleId }) => {
  try {
    await post(ApiUrls.startEntity({ moduleId }), {
      body: {}
    });
    return { status: API_ENTITY_COMPLETION_STATES_MAP.IN_PROGRESS };
  } catch (error) {
    throw error;
  }
};

GlobalService.updateTask = async ({
  userId,
  moduleId,
  companyId,
  taskId,
  taskType,
  isSequentiallyLocked,
  version,
  reattempt,
  updatedFields
}) => {
  try {
    const updatedFieldsStr = JSON.stringify(updatedFields);

    const checksum = generateCheckSum([userId, companyId, taskId, updatedFieldsStr]);

    const body = {
      entityId: moduleId,
      learningObjectId: taskId,
      learningObjectType: taskType,
      checksum,
      updatedFieldsAndValuesStr: updatedFieldsStr,
      updatedFieldsAndValues: updatedFields,
      protocol: "v2"
    };

    const data = await post(
      ApiUrls.updateEntity({
        entityId: moduleId,
        loId: taskId,
        loadedEntityVersion: version,
        reattemptVersion: reattempt,
        isSequentiallyLocked
      }),
      { body }
    );
    data.geData = processGeData(data.userGamificationEntityVo);
    data.topics = processUpdatedTopics(data.updatedTopics);
    return data;
  } catch (error) {
    throw error;
  }
};
export default GlobalService;

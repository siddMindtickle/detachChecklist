import { get } from "@utils/apiUtils";
import ApiUrls from "../config/api.config";

import { processGeData } from "@api";
import { prune, parseAttachments } from "@utils";
import { API_ENTITY_COMPLETION_STATES_MAP, ENTITY_COMPLETION_STATES } from "@config/env.config";

const ChecklistService = {};

// begin slight-deviated-from-selfserve-checklist
export const parseTask = (task = {}, { sectionId } = {}) => {
  const { id, title: name, state, maxScore, score, type, description, attachedMedia } = task;
  return {
    id,
    type,
    name,
    score,
    attachments: attachedMedia && parseAttachments(attachedMedia),
    maxScore,
    sectionId,
    description,
    state: API_ENTITY_COMPLETION_STATES_MAP[state],
    isCompleted: state == ENTITY_COMPLETION_STATES.COMPLETED
  };
};

const parseLevel = (level = {}) => {
  const { id, name, topics = [] } = level;
  return {
    id,
    name,
    sections: topics.map(({ id }) => id)
  };
};

const parseSection = (section = {}, { levelId }) => {
  const { id, name, los = [] } = section;
  return {
    id,
    name,
    levelId,
    tasks: los.map(({ id }) => id)
  };
};

const parseSeriesData = ({ id, name }) => {
  return {
    id,
    name
  };
};

const parseModuleData = data => {
  const {
    id,
    name,
    dueDate,
    maxScore,
    certificate,
    passingScore,
    isHallofFame,
    isDiscussion,
    showSections,
    desc: description,
    addedOn: invitedOn,
    isSequentiallyLocked
  } = data;
  return {
    id,
    name,
    maxScore,
    certificate,
    description,
    showSections,
    isDiscussion,
    isSequentiallyLocked,
    hallOfFame: isHallofFame,
    dueDate: parseDueDate({ dueDate, invitedOn }),
    cutoffScore: calculatePassingScore(maxScore, passingScore)
  };
};

const parseDueDate = ({
  dueDate: { dueDateExpiryAction, dueDateType, value },
  invitedOn = Math.round(new Date().getTime() / 1000)
}) => {
  const parsedDueDate = {
    value: 0,
    expired: false,
    canReAttempt: true
  };
  switch (dueDateType) {
    case "NONE":
      return false;
    case "NUM_MINUTES_AFTER_INVITATION":
      parsedDueDate.value = invitedOn + 60 * value;
      break;
    case "SPECIFIC_DATE":
      parsedDueDate.value = value;
      break;
  }
  if (parsedDueDate.value * 1000 < Date.now()) {
    parsedDueDate.expired = true;
    parsedDueDate.canReAttempt = dueDateExpiryAction !== "FREEZE";
  }
  return parsedDueDate;
};

const calculatePassingScore = (maxScore, passingScore) => {
  const { value = 0, unitType } = passingScore;
  return unitType === "PERCENT" ? Math.floor((value * maxScore) / 100) : value;
};

const parseReportCard = reportCard => {
  let levels = {};
  let sections = {};
  let tasks = {};

  reportCard.map(level => {
    const { topics = [] } = level;
    const levelId = level.id;
    levels[level.id] = parseLevel(level);

    topics.forEach(topic => {
      const sectionId = topic.id;
      sections[topic.id] = parseSection(topic, { levelId });

      const { los } = topic;
      los.forEach(lo => {
        tasks[lo.id] = parseTask(lo, { sectionId });
      });
    });
  });
  return {
    levels,
    sections,
    tasks
  };
};

const processChecklistData = ({
  entity_learner = {},
  ge_summary = {},
  module_data = {},
  module_settings = {},
  module_static = {},
  series_data = {}
}) => {
  const moduleData = parseModuleData({
    ...module_data,
    ...module_settings,
    ...module_static,
    ...entity_learner
  });
  const seriesData = parseSeriesData(series_data);
  const dueDate = moduleData.dueDate;
  const moduleState = {
    ...processGeData(ge_summary),
    frozen: dueDate && dueDate.expired && !dueDate.canReAttempt
  };
  return {
    seriesData,
    moduleData,
    moduleState
  };
};

ChecklistService.getTaskDetails = async ({
  taskId,
  moduleId,
  sectionId,
  version,
  reattempt,
  isSequentiallyLocked
}) => {
  try {
    let {
      staticData: {
        staticNode: { obj: { attachedMedia, taskDesc: description } = {} },
        id,
        maxScore
      } = {},
      userData: { state }
    } = await get(
      ApiUrls.getTaskDetails({
        taskId,
        moduleId,
        query: {
          topicId: sectionId,
          loadedEntityVersion: version,
          reattemptVersion: reattempt,
          isSequentiallyLocked
        }
      })
    );
    return prune(parseTask({ id, attachedMedia, maxScore, state, description }, { sectionId }));
  } catch (error) {
    throw error;
  }
};

ChecklistService.getReportCard = async ({ seriesId, ...rest }) => {
  try {
    let { reportSummary: { levels = [] } = {} } = await get(
      ApiUrls.reportCard({ forSeries: seriesId, ...rest })
    );
    return parseReportCard(levels);
  } catch (error) {
    throw error;
  }
};

ChecklistService.getModuleDetails = async ({ moduleId, seriesId }) => {
  try {
    const response = await get(ApiUrls.initData({ moduleId, forSeries: seriesId }));
    const { seriesData, moduleData, moduleState } = processChecklistData(response);

    return {
      seriesData,
      moduleData,
      moduleState
    };
  } catch (error) {
    throw error;
  }
};

export default ChecklistService;

import { get, put, post } from "@utils/apiUtils";
import { isEmpty, parseAttachments } from "@utils";
import ApiUrls from "../config/api.config";
import { MT_ENTITY_TYPE_ID, MT_ENTITIES } from "@config/global.config";

const { SECTION, TASK, LEVEL } = MT_ENTITIES;
const ChecklistService = {};

const parseTasks = (tasks = []) => {
  const response = {};
  tasks.forEach((task, index) => {
    if (isEmpty(task)) return;
    const {
      staticNode: {
        id: staticId,
        obj: { taskName: name, taskDesc: description, attachedMedia: attachments = [] }
      },
      id,
      maxScore
    } = task;
    response[id] = {
      data: {
        id,
        name,
        staticId,
        maxScore,
        description,
        attachments: parseAttachments(attachments),
        displayIndex: index
      }
    };
  });
  return response;
};

const preProcessAttachments = attachments => {
  return attachments.reduce((result, attachment) => {
    if (!attachment) return result;
    // rename id to object
    result.push({
      object: attachment.id,
      ...attachment
    });
    return result;
  }, []);
};
const preProcessCopySection = ({ levelId, sectionIds }) => {
  const sections = sectionIds.map(sectionId => {
    return {
      topicId: sectionId,
      srcLevelId: levelId,
      destLevelId: levelId
    };
  });
  return {
    topics: sections
  };
};

const preProcessTask = (tasks = []) => {
  const learningObjects = tasks.map(
    ({ name, description: desc, displayIndex, staticId, maxScore = 100, attachments = {} }) => {
      return {
        staticNode: {
          obj: {
            taskName: name,
            taskDesc: desc,
            type: MT_ENTITY_TYPE_ID[TASK].staticType,
            id: staticId,
            attachedMedia: preProcessAttachments(Object.values(attachments))
          }
        },
        displayIndex,
        maxScore,
        type: MT_ENTITY_TYPE_ID[TASK].type
      };
    }
  );
  return {
    learningObjects
  };
};

const preProcessSection = ({ name, displayIndex }) => {
  return {
    staticNode: {
      obj: {
        name,
        type: MT_ENTITY_TYPE_ID[SECTION].staticType
      }
    },
    displayIndex,
    type: MT_ENTITY_TYPE_ID[SECTION].type
  };
};

const parseLevels = (levels = []) => {
  const response = {};
  levels.forEach((level, index) => {
    if (isEmpty(level)) return;
    const {
      staticNode: {
        id: staticId,
        obj: { name }
      },
      id,
      children
    } = level;
    const sections = [];

    children &&
      children.forEach(section => {
        section && section.id && sections.push(section.id);
      });

    response[level.id] = {
      data: {
        id,
        name,
        staticId,
        displayIndex: index
      },
      sections
    };
  });
  return response;
};

const parseSections = (sections = []) => {
  const response = {};
  sections.forEach((section, index) => {
    if (isEmpty(section)) return;
    const tasks = [];
    const {
      staticNode: {
        id: staticId,
        obj: { name }
      },
      id,
      children
    } = section;

    children &&
      children.forEach(task => {
        task && task.id && tasks.push(task.id);
      });

    response[id] = {
      data: {
        id,
        name,
        staticId,
        displayIndex: index
      },
      tasks
    };
  });
  return response;
};

const parsePlayables = (data, type) => {
  let sections = {};
  let levels = {};
  let tasks = {};
  const {
    [SECTION]: { type: sectionTypeId },
    [TASK]: { type: taskTypeId },
    [LEVEL]: { type: levelTypeId }
  } = MT_ENTITY_TYPE_ID;
  data.forEach(obj => {
    const newNode = obj["_2"] || {};
    const oldNodeId = obj["_1"];
    const updateOldNode = oldNodeId ? { [oldNodeId]: newNode.id } : {};
    const nodeType = newNode.type || MT_ENTITY_TYPE_ID[type].type;
    if (nodeType) {
      if (nodeType == levelTypeId) {
        levels = { ...levels, ...updateOldNode, ...parseLevels([newNode]) };
      } else if (nodeType == sectionTypeId) {
        sections = {
          ...sections,
          ...updateOldNode,
          ...parseSections([newNode])
        };
      } else if (nodeType == taskTypeId) {
        tasks = { ...tasks, ...updateOldNode, ...parseTasks([newNode]) };
      }
    }
  });
  return { levels, sections, tasks };
};

const parseDeleteResponse = (data = {}, type) => {
  const parsedData = {
    sections: {},
    tasks: {},
    levels: {}
  };
  //eslint-disable-next-line no-unused-vars
  for (const [id, playables] of Object.entries(data)) {
    const { sections, tasks, levels } = parsePlayables(playables, type);
    parsedData.sections = {
      ...parsedData.sections,
      ...sections
    };
    parsedData.tasks = {
      ...parsedData.tasks,
      ...tasks
    };
    parsedData.levels = {
      ...parsedData.levels,
      ...levels
    };
  }
  return parsedData;
};

ChecklistService.getLevels = async ({ moduleId, seriesId }) => {
  try {
    const { levels } = await get(ApiUrls.getLevels({ moduleId, query: { forSeries: seriesId } }));
    return parseLevels(levels);
  } catch (error) {
    throw error;
  }
};

ChecklistService.getSectionDetailsByLevelId = async ({ moduleId, levelId, seriesId }) => {
  try {
    const { topics: sections = [] } = await get(
      ApiUrls.getSectionDetailsByLevelId({
        moduleId,
        levelId,
        query: { forSeries: seriesId }
      })
    );
    return parseSections(sections);
  } catch (error) {
    throw error;
  }
};

ChecklistService.getSectionDetails = async ({ moduleId, sectionIds, levelId, seriesId }) => {
  try {
    if (levelId) {
      return ChecklistService.getSectionDetailsByLevelId({
        moduleId,
        levelId,
        seriesId
      });
    } else {
      const { topics: sections = [] } = await get(
        ApiUrls.getSectionDetailsByLevelId({
          moduleId,
          sectionIds,
          query: { forSeries: seriesId }
        })
      );
      return parseSections(sections);
    }
  } catch (error) {
    throw error;
  }
};

ChecklistService.getTaskDetailsByLevelId = async ({ moduleId, levelId, seriesId }) => {
  try {
    let { learning_objects = {} } = await get(
      ApiUrls.getTaskDetailsByLevelId({
        moduleId,
        levelId,
        query: { forSeries: seriesId }
      })
    );
    learning_objects = Object.values(learning_objects).reduce((result, tasks = []) => {
      result = [...result, ...tasks];
      return result;
    });
    return parseTasks(learning_objects);
  } catch (error) {
    throw error;
  }
};

ChecklistService.getTaskDetails = async ({ moduleId, taskIds, levelId, seriesId }) => {
  try {
    if (levelId) {
      return ChecklistService.getTaskDetailsByLevelId({
        moduleId,
        levelId,
        seriesId
      });
    }
    const { learning_objects } = await get(
      ApiUrls.getTaskDetails({
        moduleId,
        taskIds,
        query: { forSeries: seriesId }
      })
    );
    return parseTasks(learning_objects);
  } catch (error) {
    throw error;
  }
};

ChecklistService.createTask = async ({ moduleId, node = {}, seriesId, sectionId }) => {
  try {
    const { playables } = await put(
      ApiUrls.createTask({
        moduleId,
        sectionId,
        query: { forSeries: seriesId }
      }),
      {
        body: preProcessTask([node.data])
      }
    );
    return parsePlayables(playables);
  } catch (error) {
    throw error;
  }
};

ChecklistService.createSection = async ({ moduleId, node = {}, levelId, seriesId }) => {
  try {
    const { playables } = await put(
      ApiUrls.createSection({
        moduleId,
        levelId,
        query: { forSeries: seriesId }
      }),
      {
        body: preProcessSection(node.data)
      }
    );
    return parsePlayables(playables);
  } catch (error) {
    throw error;
  }
};

ChecklistService.copyTasks = async ({ moduleId, node = [], seriesId, sectionId }) => {
  try {
    const { playables } = await put(
      ApiUrls.createTask({
        moduleId,
        sectionId,
        query: { forSeries: seriesId }
      }),
      {
        body: preProcessTask(node)
      }
    );
    return parsePlayables(playables);
  } catch (error) {
    throw error;
  }
};

ChecklistService.copySections = async ({
  moduleId,
  node: { processIds = [] } = {},
  levelId,
  seriesId
}) => {
  try {
    const { playables } = await put(
      ApiUrls.copySection({
        moduleId,
        query: {
          forSeries: seriesId
        }
      }),
      {
        body: preProcessCopySection({ levelId, sectionIds: processIds })
      }
    );
    return parsePlayables(playables);
  } catch (error) {
    throw error;
  }
};

ChecklistService.modifyTask = async ({ moduleId, node = {}, seriesId }) => {
  try {
    const { playables } = await post(
      ApiUrls.modifyTask({
        moduleId,
        taskId: node.data.id,
        query: { forSeries: seriesId }
      }),
      {
        body: preProcessTask([node.data]).learningObjects[0]
      }
    );
    return parsePlayables(playables);
  } catch (error) {
    throw error;
  }
};

ChecklistService.modifySection = async ({ moduleId, node = {}, seriesId }) => {
  try {
    const { playables } = await post(
      ApiUrls.modifySection({
        moduleId,
        sectionId: node.data.id,
        query: { forSeries: seriesId }
      }),
      {
        body: preProcessSection(node.data)
      }
    );
    return parsePlayables(playables);
  } catch (error) {
    throw error;
  }
};

ChecklistService.moveTask = async ({
  moduleId,
  seriesId,
  sourceParentId,
  destParentId,
  node,
  index: displayIndex
}) => {
  try {
    const { playables } = await post(
      ApiUrls.moveTask({
        moduleId,
        query: {
          forSeries: seriesId
        }
      }),
      {
        body: {
          loId: node.data.id,
          sourceTopicId: sourceParentId,
          destTopicId: destParentId,
          displayIndex
        }
      }
    );
    return parsePlayables(playables, TASK);
  } catch (error) {
    throw error;
  }
};

ChecklistService.moveSection = async ({
  moduleId,
  seriesId,
  sourceParentId,
  destParentId,
  node,
  index: displayIndex
}) => {
  try {
    const { playables } = await post(
      ApiUrls.moveSection({
        moduleId,
        query: {
          forSeries: seriesId
        }
      }),
      {
        body: {
          topicId: node.data.id,
          sourceLevelId: sourceParentId,
          destLevelId: destParentId,
          displayIndex
        }
      }
    );
    return parsePlayables(playables, SECTION);
  } catch (error) {
    throw error;
  }
};

ChecklistService.deleteTask = async ({
  moduleId,
  node: { processIds = [] } = {},
  seriesId,
  sectionId
}) => {
  try {
    const response = await post(
      ApiUrls.deleteTask({
        moduleId,
        sectionId,
        query: {
          forSeries: seriesId
        }
      }),
      {
        body: {
          loids: processIds
        }
      }
    );
    return parseDeleteResponse(response, TASK);
  } catch (error) {
    throw error;
  }
};

ChecklistService.deleteSection = async ({
  moduleId,
  node: { processIds = [] } = {},
  levelId,
  seriesId
}) => {
  try {
    const response = await post(
      ApiUrls.deleteSection({
        moduleId,
        query: {
          forSeries: seriesId,
          levelId
        }
      }),
      {
        body: {
          topics: processIds
        }
      }
    );
    return parseDeleteResponse(response, SECTION);
  } catch (error) {
    throw error;
  }
};

export default ChecklistService;

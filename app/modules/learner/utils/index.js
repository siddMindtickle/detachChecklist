import { ENTITY_COMPLETION_STATES, OVERVIEW_ID } from "@config/env.config";
import { prune } from "@utils";

const getLockedStatus = ({ isSequentiallyLocked, allPreviousCompleted }) => {
  if (!isSequentiallyLocked) return false;
  if (allPreviousCompleted) return false;
  return true;
};

const containsWordStartWith = (str = "", searchString = "") => {
  const searchWords = searchString.toLowerCase().split(" ");
  const strWords = str.toLowerCase().split(" ");

  return searchWords.every(searchWord => {
    return strWords.some(strWord => {
      return strWord.startsWith(searchWord);
    });
  });
};

const getPrevTaskStatus = (status, prevTask) => {
  return prevTask ? status && prevTask.state == ENTITY_COMPLETION_STATES.COMPLETED : status;
};

const parseTask = ({
  task,
  frozen,
  orderIndex,
  searchString,
  isSequentiallyLocked,
  allPreviousCompleted
}) => {
  const { name } = task;
  if (searchString && !containsWordStartWith(name, searchString)) return;
  return {
    ...task,
    frozen,
    orderIndex,
    isLocked: getLockedStatus({
      isSequentiallyLocked,
      allPreviousCompleted
    })
  };
};

const parseWithSection = ({
  frozen,
  tasksMap,
  levelsMap,
  sectionIds,
  sectionsMap,
  isSequentiallyLocked
}) => {
  let orderIndex = 0;
  let allPreviousCompleted = true;

  return sectionIds.map(sectionId => {
    const { name, tasks: taskIds = [] } = sectionsMap[sectionId];
    return {
      name,
      id: sectionId,
      children: taskIds.map(taskId => {
        const prevTaskId = getPrevTaskId({
          taskId,
          tasksMap,
          sectionsMap,
          levelsMap
        });
        allPreviousCompleted = getPrevTaskStatus(allPreviousCompleted, tasksMap[prevTaskId]);
        return parseTask({
          frozen,
          orderIndex: ++orderIndex,
          task: tasksMap[taskId],
          isSequentiallyLocked,
          allPreviousCompleted
        });
      })
    };
  });
};

const parseWithoutSection = ({
  frozen,
  tasksMap,
  levelsMap,
  sectionIds,
  sectionsMap,
  searchString,
  isSequentiallyLocked
}) => {
  let parsedTasks = [];
  let allPreviousCompleted = true;
  let orderIndex = 0;
  sectionIds.map(sectionId => {
    const { tasks: taskIds = [] } = sectionsMap[sectionId];
    const sectionTasks = taskIds.map(taskId => {
      const prevTaskId = getPrevTaskId({
        taskId,
        tasksMap,
        sectionsMap,
        levelsMap
      });
      allPreviousCompleted = getPrevTaskStatus(allPreviousCompleted, tasksMap[prevTaskId]);
      return parseTask({
        frozen,
        task: tasksMap[taskId],
        isSequentiallyLocked,
        allPreviousCompleted,
        searchString,
        orderIndex: ++orderIndex
      });
    });
    parsedTasks = parsedTasks.concat(prune(sectionTasks));
  });
  return parsedTasks;
};

const getOverviewNode = ({ description }) => {
  return {
    name: description,
    id: OVERVIEW_ID
  };
};

export const getNextTaskId = ({ taskId, tasksMap, sectionsMap, levelsMap }) => {
  const currentSectionId = tasksMap[taskId].sectionId;
  const currentSectionTasks = sectionsMap[currentSectionId].tasks;

  const currentLevelId = sectionsMap[currentSectionId].levelId;
  const currentLevelSections = levelsMap[currentLevelId].sections;

  const currentTaskIndex = currentSectionTasks.findIndex(id => id == taskId);
  if (currentTaskIndex < currentSectionTasks.length - 1) {
    return currentSectionTasks[currentTaskIndex + 1];
  }

  const currentSectionIndex = currentLevelSections.findIndex(id => id == currentSectionId);
  if (currentSectionIndex < currentLevelSections.length - 1) {
    const nextSectionId = currentLevelSections[currentSectionIndex + 1];
    return sectionsMap[nextSectionId].tasks[0];
  }
  return;
};

export const getPrevTaskId = ({ taskId, tasksMap, sectionsMap, levelsMap }) => {
  const currentSectionId = tasksMap[taskId].sectionId;
  const currentSectionTasks = sectionsMap[currentSectionId].tasks;

  const currentLevelId = sectionsMap[currentSectionId].levelId;
  const currentLevelSections = levelsMap[currentLevelId].sections;

  const currentTaskIndex = currentSectionTasks.findIndex(id => id == taskId);
  if (currentTaskIndex > 0) {
    return currentSectionTasks[currentTaskIndex - 1];
  }

  const currentSectionIndex = currentLevelSections.findIndex(id => id == currentSectionId);
  if (currentSectionIndex > 0) {
    const prevSectionId = currentLevelSections[currentSectionIndex - 1];
    const prevSectionTasks = sectionsMap[prevSectionId].tasks;
    return prevSectionTasks[prevSectionTasks.length - 1];
  }
  return;
};

export const getNextPrevTaskId = ({ taskId, tasks, sections, levels }) => {
  const params = {
    taskId,
    tasksMap: tasks,
    sectionsMap: sections,
    levelsMap: levels
  };
  return {
    nextId: getNextTaskId(params),
    prevId: getPrevTaskId(params)
  };
};

export const createSidebarData = ({
  tasks: tasksMap,
  levels: levelsMap,
  sections: sectionsMap,
  frozen,
  description,
  showSections,
  searchString,
  isSequentiallyLocked
}) => {
  let sidebarData = [];
  const { sections: sectionIds = [] } = Object.values(levelsMap)[0] || {};
  const params = {
    sectionsMap,
    sectionIds,
    tasksMap,
    levelsMap,
    frozen,
    searchString,
    isSequentiallyLocked
  };
  if (searchString || !showSections) {
    sidebarData = parseWithoutSection(params);
  } else {
    sidebarData = parseWithSection(params);
  }
  sidebarData.unshift(getOverviewNode({ description }));
  return sidebarData;
};

export const getUncompletedTaskId = ({ tasks, sections, levels }) => {
  let tasksInOrder = [];
  let uncompletedTaskId;
  Object.values(levels).forEach(level => {
    level.sections.forEach(sectionId => {
      tasksInOrder = tasksInOrder.concat(sections[sectionId].tasks);
    });
  });
  tasksInOrder.forEach(taskId => {
    if (!tasks[taskId].isCompleted) {
      uncompletedTaskId = uncompletedTaskId ? uncompletedTaskId : tasks[taskId].id;
      return;
    }
  });
  return uncompletedTaskId;
};

import { isObject, containsWordStartWith } from "@utils";

const createSection = ({ section, sectionId, tasks, orderIndex, index, selectedNode }) => {
  const isSectionSelected = selectedNode.id == sectionId;
  const { tasks: sectionTasks, selected = isSectionSelected, expanded = true, data = {} } = section;
  const name = isSectionSelected ? selectedNode.name : data.name;

  const newSection = {
    selected,
    expanded,
    data: {
      ...data,
      name,
      displayIndex: index
    },
    children: sectionTasks.map((taskId, displayIndex) => {
      const isTaskSelected = selectedNode.id == taskId;
      const { expanded = false, selected = isTaskSelected, leaf = true, data = {} } =
        tasks[taskId] || {};
      const name = isTaskSelected ? selectedNode.name : data.name;

      return {
        expanded,
        selected,
        leaf,
        sectionId,
        orderIndex: orderIndex++,
        data: {
          ...data,
          name,
          displayIndex
        }
      };
    })
  };
  return {
    section: newSection,
    orderIndex
  };
};

const createTask = ({ section, sectionId, tasks, orderIndex, selectedNode }) => {
  const { tasks: sectionTasks } = section;
  const newTasks = sectionTasks.map((taskId, displayIndex) => {
    const isTaskSelected = selectedNode.id == taskId;

    const { expanded = false, selected = isTaskSelected, leaf = true, data = {} } =
      tasks[taskId] || {};
    const name = isTaskSelected ? selectedNode.name : data.name;

    return {
      expanded,
      selected,
      leaf,
      sectionId,
      orderIndex: orderIndex++,
      data: {
        ...data,
        name,
        displayIndex
      }
    };
  });
  return {
    tasks: newTasks,
    orderIndex
  };
};

const filteredTree = ({ section, sectionId, tasks, searchString, orderIndex, selectedNode }) => {
  const { tasks: sectionTasks } = section;
  const newTasks = sectionTasks.reduce((matchedTasks, taskId, displayIndex) => {
    const isTaskSelected = selectedNode.id == taskId;
    const { expanded = false, selected = isTaskSelected, leaf = true, data = {} } =
      tasks[taskId] || {};
    const taskName = data.name || ";";
    const name = isTaskSelected ? selectedNode.name : data.name;

    if (containsWordStartWith(taskName, searchString)) {
      matchedTasks.push({
        expanded,
        selected,
        sectionId,
        orderIndex: orderIndex++,
        leaf,
        data: {
          ...data,
          name,
          displayIndex
        }
      });
    }
    return matchedTasks;
  }, []);
  return {
    tasks: newTasks,
    orderIndex
  };
};

export const createTreeData = ({
  levels = {},
  sections = {},
  tasks = {},
  showSections = true,
  searchString,
  selectedNode = {}
}) => {
  const treeData = [];
  const { sections: sectionIds = [] } = getActiveLevel(levels);
  let orderIndex = 1;
  sectionIds.forEach((sectionId, index) => {
    const section = sections[sectionId];
    const params = {
      section,
      sectionId,
      tasks,
      searchString,
      orderIndex,
      selectedNode,
      index
    };

    if (!section) return;
    if (searchString) {
      const { tasks: filteredData, orderIndex: newOrderIndex } = filteredTree(params);
      treeData.push(...filteredData);
      orderIndex = newOrderIndex;
    } else if (showSections) {
      const { section: newSection, orderIndex: newOrderIndex } = createSection(params);
      treeData.push(newSection);
      orderIndex = newOrderIndex;
    } else {
      const { tasks: newTasks, orderIndex: newOrderIndex } = createTask(params);
      treeData.push(...newTasks);
      orderIndex = newOrderIndex;
    }
  });
  return treeData;
};

export const getActiveLevel = (levels = {}) => {
  return Object.values(levels).filter(level => isObject(level))[0] || {};
};

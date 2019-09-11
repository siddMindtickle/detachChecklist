import { deepEqual } from "@utils";
const getAddedTask = (newTreeData, oldTreeData) => {
  let data = {
    sections: [],
    tasks: []
  };
  for (let i = 0; i < newTreeData.length; i++) {
    const newChildren = newTreeData[i].children;
    const oldChildren = oldTreeData[i].children;
    if (newChildren.length != oldChildren.length) {
      for (let j = 0, k = 0; j < newChildren.length || k < oldChildren.length; ) {
        if (!deepEqual(newChildren[j], oldChildren[k] || {})) {
          data.tasks.push({
            ...newChildren[j],
            sectionId: newTreeData[i].data["id"]
          });
          j++;
        } else {
          j++;
          k++;
        }
      }
    }
  }
  return data;
};
const getAddedSection = (newTreeData, oldTreeData) => {
  let data = {
    sections: [],
    tasks: []
  };
  for (let i = 0, j = 0; i < newTreeData.length; ) {
    if (!deepEqual(newTreeData[i], oldTreeData[j] || {})) {
      const { children = [], ...rest } = newTreeData[i];
      data.sections.push({
        ...rest
      });
      const newTasks = children.map(task => ({
        ...task
      }));
      data.tasks = data.tasks.concat(newTasks);
      i++;
    } else {
      i++;
      j++;
    }
  }
  return data;
};
const getAddedData = (newTreeData, oldTreeData) => {
  if (newTreeData.length == oldTreeData.length) {
    return getAddedTask(newTreeData, oldTreeData);
  } else {
    return getAddedSection(newTreeData, oldTreeData);
  }
};
const getDeletedSection = (oldTreeData, newTreeData) => {
  let data = {
    sections: [],
    tasks: []
  };
  for (let i = 0, k = 0; i < oldTreeData.length; ) {
    if (!deepEqual(newTreeData[k] || {}, oldTreeData[i])) {
      data.sections.push({
        ...oldTreeData[i]
      });
      i++;
    } else {
      i++;
      k++;
    }
  }
  return data;
};
const getDeletedTask = (oldTreeData, newTreeData) => {
  return getAddedTask(newTreeData, oldTreeData);
};
const getDeletedData = (newTreeData, oldTreeData) => {
  if (newTreeData.length == oldTreeData.length) {
    return getDeletedTask(newTreeData, oldTreeData);
  } else {
    return getDeletedSection(oldTreeData, newTreeData);
  }
};
const getUpdatedData = newTreeData => {
  let data = {
    sections: [],
    tasks: []
  };
  for (let i = 0; i < newTreeData.length; i++) {
    const { children = [], isDirty, ...rest } = newTreeData[i];
    for (let j = 0; j < children.length; j++) {
      const { isDirty, ...rest } = children[j];
      if (isDirty) {
        data.tasks.push({
          ...rest,
          sectionId: newTreeData[i].data.id
        });
      }
    }
    if (isDirty) {
      data.sections.push({
        ...rest
      });
    }
  }
  return data;
};

const getCopiedData = (newTreeData, oldTreeData) => {
  return getDeletedData(oldTreeData, newTreeData);
};
const getDiff = (operation, oldTreeData, newTreeData) => {
  switch (operation) {
    case "add":
      return getAddedData(newTreeData, oldTreeData);
    case "copy":
      return getCopiedData(newTreeData, oldTreeData);
    case "remove":
      return getDeletedData(newTreeData, oldTreeData);
    case "update":
    case "select":
    case "expand":
      return getUpdatedData(newTreeData);
    default:
      return {
        sections: [],
        tasks: []
      };
  }
};
export default getDiff;

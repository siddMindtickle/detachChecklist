import { OPERATIONS } from "../config/constants";
import { FILTER } from "@mixpanel/enums";
export const getType = operation => {
  return CREATE[operation];
};

const CREATE = {
  [OPERATIONS.ADD]: "New",
  [OPERATIONS.COPY]: "Duplicate"
};

export const getSectionIds = (op, response) => {
  let sections = Object.keys(response.sections);
  switch (op) {
    case OPERATIONS.REMOVE:
      return sections;
    case OPERATIONS.MOVE:
      for (let i = 0; i < sections.length; i++) {
        if (response.sections[sections[i]]) return sections[i];
      }
  }
};

export const getSectionCount = (op, response) => {
  let secIds = getSectionIds(op, response);
  return secIds ? secIds.length : 0;
};

export const getTaskIds = (op, response) => {
  switch (op) {
    case OPERATIONS.MOVE:
      return Object.keys(response.tasks)[0];
    case OPERATIONS.REMOVE:
      return Object.keys(response.tasks);
  }
};

export const getTaskCount = (op, response) => {
  return getTaskIds(op, response).length;
};

export const getNewSectionId = (op, response) => {
  let sections = Object.keys(response.sections);
  let oldSecId = getOldSectionId(op, response);
  let newSecId = sections.filter(sec => sec === oldSecId);
  return newSecId[0];
};

export const getOldSectionId = (op, response) => {
  let taskId = Object.keys(response.tasks)[0];
  let sections = Object.keys(response.sections);
  for (let i = 0; i < sections.length; i++) {
    if (
      response.sections[sections[i]].tasks &&
      !response.sections[sections[i]].tasks.includes(taskId)
    )
      return sections[i];
  }
};

export const getLocation = () => {
  return "ModuleTrackPage";
};

export const getFilter = op => {
  return FILTER[op];
};

export const getFilterType = (op, postData) => {
  let { filters } = postData;
  let groups = [];
  if (filters && filters.length) {
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].type == "applyGroups") {
        groups = filters[i].value;
      }
    }
  }
  return groups.length ? groups : "ALL";
};

export const getLearnerIds = (op, response) => {
  let { successIds } = response;
  return successIds;
};

export const getLearnerIdsCount = (op, response) => {
  let { successIds = [] } = response;
  return successIds.length;
};

export const getResetLearners = (op, response) => {
  let { learnerIds } = response;
  return learnerIds;
};

// eslint-disable-next-line no-unused-vars
export const getDomLoadTime = (op, response) => {
  return window.performance.timing.domComplete - window.performance.timing.requestStart;
};

// eslint-disable-next-line no-unused-vars
export const getDomInteractiveTime = (op, response) => {
  window.performance.timing.domInteractive - window.performance.timing.requestStart;
};

// eslint-disable-next-line no-unused-vars
export const getPercievedPageLoad = (op, response) => {
  const startTime =
    window.pagePerformanceData && window.pagePerformanceData.startTime
      ? window.pagePerformanceData.startTime
      : 0;
  return Date.now() - startTime;
};

// eslint-disable-next-line no-unused-vars
export const isFirstLoad = (op, response) => {
  return window.pagePerformanceData && window.pagePerformanceData.from ? false : true;
};

// export const getSearchText = (op, filters) => {
//   let searchtext= "";
//   if (filters && filters.length) {
//     for (let i = 0; i < filters.length; i++){
//       if( filters[i].type == "search"){
//         searchtext = filters[i].value;
//       }
//     }
//   }
//   return searchtext ;
// };

// export const getTaskName = (data) => {
//   let taskIds = Object.keys(data);
//   let taskNames = [];
//   taskIds.forEach(taskId => {
//     let tName = data[taskId].name;
//     taskNames.push(tName)
//   });
//   return taskNames;
// };

import { handleQueryStringForApi } from "@utils";
let apiUrls = {
  getLevels({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/levels`,
      mock: "getLevels",
      mockType: "success"
    };
  },
  getSectionDetails({ moduleId, sectionIds }) {
    if (Array.isArray(sectionIds)) sectionIds = sectionIds.join(",");
    return {
      url: `/wapi/module/${moduleId}/topics/${sectionIds}`,
      mock: "getTopics",
      mockType: "success"
    };
  },
  getSectionDetailsByLevelId({ moduleId, levelId }) {
    return {
      url: `/wapi/module/${moduleId}/level/${levelId}/topics`,
      mock: "getTopics",
      mockType: "success"
    };
  },
  getTaskDetails({ moduleId, taskIds }) {
    if (Array.isArray(taskIds)) taskIds = taskIds.join(",");
    return {
      url: `/wapi/module/${moduleId}/learning_objects/${taskIds}`,
      mock: "getTasks",
      mockType: "success"
    };
  },
  getTaskDetailsByLevelId({ moduleId, levelId }) {
    return {
      url: `/wapi/module/${moduleId}/level/${levelId}/los`,
      mock: "getTasks",
      mockType: "success"
    };
  },
  createTask({ moduleId, sectionId }) {
    return {
      url: `/wapi/module/${moduleId}/topic/${sectionId}/learning_objects`,
      mock: "createTask",
      mockType: "success"
    };
  },
  createSection({ moduleId, levelId }) {
    return {
      url: `/wapi/module/${moduleId}/level/${levelId}/topic`,
      mock: "createSection",
      mockType: "success"
    };
  },
  deleteTask({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/delete_learning_objects`,
      mock: "deleteTask",
      mockType: "success"
    };
  },
  deleteSection({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/delete_topics`,
      mock: "deleteSection",
      mockType: "success"
    };
  },
  modifyTask({ moduleId, taskId }) {
    return {
      url: `/wapi/module/${moduleId}/learning_object/${taskId}`,
      mock: "getLevels",
      mockType: "success"
    };
  },
  modifySection({ moduleId, sectionId }) {
    return {
      url: `/wapi/module/${moduleId}/topic/${sectionId}`,
      mock: "getLevels",
      mockType: "success"
    };
  },
  moveSection({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/move_topic`
    };
  },
  moveTask({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/move_lo`
    };
  },
  copySection({ moduleId }) {
    return {
      url: `/wapi/module/${moduleId}/duplicate_topics`,
      mock: "archive",
      mockType: "success"
    };
  },
  getLearnersCountByStatus({ companyId }) {
    return {
      url: `/${companyId}/learners/module_states`
    };
  },
  getTrackLearners({ companyId, moduleId }) {
    return {
      url: `/${companyId}/${moduleId}/learners/search`
    };
  },
  getGroups({ companyId }) {
    return {
      url: `/${companyId}/learners/groups`,
      mock: "getGroups",
      mockType: "success"
    };
  },
  resetLearnerProgress({ companyId, moduleId }) {
    return {
      url: `/${companyId}/${moduleId}/reset_progress`
    };
  },
  changeModuleRelevance({ companyId, moduleId }) {
    return {
      url: `/${companyId}/${moduleId}/update_learners_relevance`
    };
  },
  removeLearnerFromContext({ companyId }) {
    return {
      url: `/${companyId}/learners/removeLearnersFromContext`
    };
  },
  pollStatus({ companyId, processId }) {
    return {
      url: `/${companyId}/poll-process-status/${processId}`
    };
  }
};

export default handleQueryStringForApi(apiUrls);

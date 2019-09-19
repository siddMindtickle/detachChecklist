import * as actionTypes from "../actionTypes";
import { OPERATIONS as CHECKLIST_OP } from "../config/constants";
import { OPERATIONS as TRACK_OP, LEARNER_TYPES } from "../config/track.constants";
import { getLoadingActions } from "@core/helpers";
import { MT_ENTITIES } from "@config/global.config";
import * as processor from "./helpers";

const OPERATIONS = { ...CHECKLIST_OP, ...TRACK_OP };

const MixpanelEvents = {
  [getLoadingActions(actionTypes.MANIPULATE_BUILD_DATA).SUCCESS]: {
    [OPERATIONS.ADD]: {
      [MT_ENTITIES.SECTION]: {
        event: "Add Section",
        data: {
          Type: { value: OPERATIONS.ADD, processor: processor.getType }
        }
      },
      [MT_ENTITIES.TASK]: {
        event: "Add Task",
        data: {
          Type: { value: OPERATIONS.ADD, processor: processor.getType }
        }
      }
    },
    [OPERATIONS.COPY]: {
      [MT_ENTITIES.SECTION]: {
        event: "Add Section",
        data: {
          Type: { value: OPERATIONS.COPY, processor: processor.getType }
        }
      },
      [MT_ENTITIES.TASK]: {
        event: "Add Task",
        data: {
          Type: { value: OPERATIONS.COPY, processor: processor.getType }
        }
      }
    },
    [OPERATIONS.REMOVE]: {
      [MT_ENTITIES.SECTION]: {
        event: "Delete Section",
        data: {
          Number_Sections: {
            value: OPERATIONS.REMOVE,
            processor: processor.getSectionCount
          },
          SectionIds: {
            value: OPERATIONS.REMOVE,
            processor: processor.getSectionIds
          }
        }
      },
      [MT_ENTITIES.TASK]: {
        event: "Delete Task",
        data: {
          "Section Id": {
            value: OPERATIONS.REMOVE,
            processor: processor.getSectionIds
          },
          Number_Tasks: {
            value: OPERATIONS.REMOVE,
            processor: processor.getTaskCount
          },
          TaskIds: { value: OPERATIONS.REMOVE, processor: processor.getTaskIds }
        }
      }
    },

    [OPERATIONS.MOVE]: {
      [MT_ENTITIES.SECTION]: {
        event: "Move Section",
        data: {
          SectionId: {
            value: OPERATIONS.MOVE,
            processor: processor.getSectionIds
          }
        }
      },
      [MT_ENTITIES.TASK]: {
        event: "Move Task",
        data: {
          TaskId: { value: OPERATIONS.MOVE, processor: processor.getTaskIds },
          New_SectionId: {
            value: OPERATIONS.MOVE,
            processor: processor.getNewSectionId
          },
          Old_SectionId: {
            value: OPERATIONS.MOVE,
            processor: processor.getOldSectionId
          }
        }
      }
    }

    //[OPERATIONS.UPDATE]: {
    //   [MT_ENTITIES.TASK]: {
    //     //TODO task name change, score change both have same operation and type
    //     event: "Change Content Score",
    //     data: {
    //       ChangeScoreTo: {
    //         value: "@@store.checklist.details.staticData.score"
    //       },
    //       "Section Id": {
    //         value:
    //           "@@store.checklist.build.operationStatus.data.response.sections"
    //       },
    //       "Task Id": {
    //         value:
    //           "@@store.checklist.build.operationStatus.data.response.tasks",
    //         processor: processor.getTaskName
    //       }
    //     }
    //   },
    //   [MT_ENTITIES.SECTION]: {
    //     event: "Change Section Name",
    //     data: {}
    //   }
    //}
  },

  [getLoadingActions(actionTypes.MANIPULATE_CHECKLIST_DATA).SUCCESS]: {
    [OPERATIONS.RENAME]: {
      event: "Change Module Name",
      data: {}
    },
    [OPERATIONS.ARCHIVE]: {
      event: "Archive Content",
      data: {}
    },
    [OPERATIONS.DISCARD]: {
      event: "Delete Content",
      data: {}
    }
  },

  [getLoadingActions(actionTypes.TRACK_MANIPULATE_DATA).SUCCESS]: {
    [OPERATIONS.GET_LEARNERS]: {
      [LEARNER_TYPES.ALL]: {
        event: "Invite and Track Filter",
        data: {
          Filter: { value: LEARNER_TYPES.ALL, processor: processor.getFilter },
          FilterType: { value: "", processor: processor.getFilterType },
          Location: {
            value: LEARNER_TYPES.ALL,
            processor: processor.getLocation
          }
        }
      },
      [LEARNER_TYPES.COMPLETED]: {
        event: "Invite and Track Filter",
        data: {
          Filter: {
            value: LEARNER_TYPES.COMPLETED,
            processor: processor.getFilter
          },
          FilterType: { value: "", processor: processor.getFilterType },
          Location: {
            value: LEARNER_TYPES.COMPLETED,
            processor: processor.getLocation
          }
        }
      },
      [LEARNER_TYPES.IN_PROGRESS]: {
        event: "Invite and Track Filter",
        data: {
          Filter: {
            value: LEARNER_TYPES.IN_PROGRESS,
            processor: processor.getFilter
          },
          FilterType: { value: "", processor: processor.getFilterType },
          Location: {
            value: LEARNER_TYPES.IN_PROGRESS,
            processor: processor.getLocation
          }
        }
      },
      [LEARNER_TYPES.ADDED]: {
        event: "Invite and Track Filter",
        data: {
          Filter: {
            value: LEARNER_TYPES.ADDED,
            processor: processor.getFilter
          },
          FilterType: { value: "", processor: processor.getFilterType },
          Location: {
            value: LEARNER_TYPES.ADDED,
            processor: processor.getLocation
          }
        }
      }
    },
    [OPERATIONS.RESET_PROGRESS]: {
      [LEARNER_TYPES.ALL]: {
        event: "Reset Progress",
        data: {
          LearnerIds: { value: "", processor: processor.getResetLearners }
        }
      },
      [LEARNER_TYPES.COMPLETED]: {
        event: "Reset Progress",
        data: {
          LearnerIds: { value: "", processor: processor.getResetLearners }
        }
      },
      [LEARNER_TYPES.IN_PROGRESS]: {
        event: "Reset Progress",
        data: {
          LearnerIds: { value: "", processor: processor.getResetLearners }
        }
      },
      [LEARNER_TYPES.ADDED]: {
        event: "Reset Progress",
        data: {
          LearnerIds: { value: "", processor: processor.getResetLearners }
        }
      }
    }
  },

  [getLoadingActions(actionTypes.TRACK_POLLING).SUCCESS]: {
    event: "Remove learners from any content",
    data: {
      LearnerIds: { value: "", processor: processor.getLearnerIds },
      Location: { value: "Content Tab Track Page" },
      "no. of learners": {
        value: "",
        processor: processor.getLearnerIdsCount
      }
    }
  },
  [getLoadingActions(actionTypes.TRACK_GET_DATA).SUCCESS]: {
    event: "page_load_view",
    data: {
      dom_load_time: { value: "", processor: processor.getDomLoadTime },
      perceived_page_load_time: {
        value: "",
        processor: processor.getPercievedPageLoad
      },
      is_page_load: { value: "", processor: processor.isFirstLoad },
      page_name: { value: "Checklist Track Page" },
      stream: { value: "Orchestration" }
    }
  },
  [getLoadingActions(actionTypes.GET_CHECKLIST_BUILD_DATA).SUCCESS]: {
    event: "page_load_view",
    data: {
      dom_load_time: { value: "", processor: processor.getDomLoadTime },
      perceived_page_load_time: {
        value: "",
        processor: processor.getPercievedPageLoad
      },
      is_page_load: { value: "", processor: processor.isFirstLoad },
      page_name: { value: "Checklist Build Page" },
      stream: { value: "Orchestration" }
    }
  }
};

export default MixpanelEvents;

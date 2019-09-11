import * as actionTypes from "../actionTypes";
import { getLoadingActions } from "@core/helpers";
import { OPERATIONS } from "../config/constants";

const MixpanelEvents = {
  [getLoadingActions(actionTypes.MANIPULATE_DATA).SUCCESS]: {
    [OPERATIONS.UPDATE]: {
      event: "module_content_tags_applied",
      data: {
        tag_applied_to: {
          value: "module"
        },
        number_of_tags: {
          value: "@@store.moduleTags.appliedTags",
          processor: value => {
            return Object.keys(value).filter(key => value[key]).length;
          }
        },
        tags_applied: {
          value: "@@store.moduleTags",
          processor: value => {
            const tagIds = Object.keys(value.appliedTags).filter(key => value.appliedTags[key]);
            return tagIds.map(id => value.tags[id].name);
          }
        },
        module_id: {
          value: "@@store",
          processor: storeData => {
            if (storeData.ilt) {
              return storeData.ilt.details.staticData.id;
            } else if (storeData.checklist) {
              return storeData.checklist.details.staticData.id;
            }
          }
        },
        module_name: {
          value: "@@store",
          processor: storeData => {
            if (storeData.ilt) {
              return storeData.ilt.details.staticData.name;
            } else if (storeData.checklist) {
              return storeData.checklist.details.staticData.name;
            }
          }
        },
        module_type: {
          value: "@@store",
          processor: storeData => {
            if (storeData.ilt) {
              return "ILT";
            } else if (storeData.checklist) {
              return "Checklist";
            }
          }
        }
      }
    }
  }
};

export default MixpanelEvents;

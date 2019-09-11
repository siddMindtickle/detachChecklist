import * as actionTypes from "../actionTypes";
import { getLoadingActions } from "@core/helpers";
import * as processor from "./helpers";
import { OPERATIONS } from "../config/constants";

const MixpanelEvents = {
  [getLoadingActions(actionTypes.MANIPULATE_DATA).SUCCESS]: {
    [OPERATIONS.PUBLISH]: {
      event: "Content Updated",
      data: {
        "Mail Option": {
          value: OPERATIONS.PUBLISH,
          processor: processor.getMailOption
        },
        "Update Option": {
          value: OPERATIONS.PUBLISH,
          processor: processor.getUpdateOption
        }
      }
    }
  }
};

export default MixpanelEvents;

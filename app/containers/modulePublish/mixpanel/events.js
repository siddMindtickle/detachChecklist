import * as actionTypes from "../actionTypes";
import { getLoadingActions } from "@core/helpers";
import * as publishProcessor from "./helpers";

const MixpanelEvents = {
  [getLoadingActions(actionTypes.PUBLISH_DATA).SUCCESS]: {
    event: "Publish content",
    data: {
      send_mail: { value: "", processor: publishProcessor.getSendMail },
      "Invite type": { value: "", processor: publishProcessor.getInviteType }
    }
  }
};

export default MixpanelEvents;

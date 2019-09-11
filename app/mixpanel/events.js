import Checklist from "@modules/checklist/mixpanel/events";
//import ILT from "@modules/ilt/mixpanel/events";
import PublishDrafts from "@containers/modulePublish/mixpanel/events";
import PublishHistory from "@containers/moduleUpdate/mixpanel/events";
import InviteLearners from "@containers/inviteLearners/mixpanel/events";
import RulesAutomation from "@modules/rules/mixpanel/events";
import Tag from "@containers/tags/mixpanel/events";

const MixpanelEvents = {
  ...Checklist,
  //...ILT,
  ...PublishDrafts,
  ...PublishHistory,
  ...InviteLearners,
  ...RulesAutomation,
  ...Tag
};

export default MixpanelEvents;

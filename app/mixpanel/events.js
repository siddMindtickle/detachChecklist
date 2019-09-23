import Admin from "@modules/admin/mixpanel/events";
import Learner from "@modules/learner/mixpanel/events";
//import ILT from "@modules/ilt/mixpanel/events";
import PublishDrafts from "@containers/modulePublish/mixpanel/events";
import PublishHistory from "@containers/moduleUpdate/mixpanel/events";
import InviteLearners from "@containers/inviteLearners/mixpanel/events";
//import RulesAutomation from "@modules/rules/mixpanel/events";
import Tag from "@containers/tags/mixpanel/events";

const MixpanelEvents = {
  ...Admin,
  ...Learner,
  //...ILT,
  ...PublishDrafts,
  ...PublishHistory,
  ...InviteLearners,
  //...RulesAutomation,
  ...Tag
};

export default MixpanelEvents;

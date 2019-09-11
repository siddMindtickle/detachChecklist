import React from "react";
import PropTypes from "prop-types";

import Button from "@components/button";

const InviteFooter = ({ disableInvite, invite, cancel }) => {
  return (
    <div className="modal_footerWrapper">
      <Button
        type="DefaultSm"
        key="defaultBtnChecklistPublish1"
        className="marginR10"
        onClick={cancel}
      >
        Cancel
      </Button>
      <Button
        type="PrimarySm"
        key="primaryBtnChecklistPublish2"
        disabled={disableInvite}
        onClick={invite}
      >
        Invite
      </Button>
    </div>
  );
};
InviteFooter.propTypes = {
  cancel: PropTypes.func.isRequired,
  invite: PropTypes.func.isRequired,
  disableInvite: PropTypes.bool.isRequired
};

export default InviteFooter;

import React from "react";
import PropTypes from "prop-types";

import Button from "@components/button";
import Icon from "@components/icon";

const UpdateButtons = ({ onOk, onCancel }) => {
  return (
    <div className="desc_buttons">
      <Button name="sendFeedback" type="PrimaryRoundBtn" className="marginR5" onClick={onOk}>
        <Icon type="tick" />
      </Button>

      <Button name="sendFeedback" type="DefaultRoundBtn" onClick={onCancel}>
        <Icon type="close" />
      </Button>
    </div>
  );
};
UpdateButtons.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default UpdateButtons;

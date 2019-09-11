import React, { Component } from "react";
import PropTypes from "prop-types";

import InviteLearners from "@containers/inviteLearners";
import style from "./index.scss";
import classnames from "classnames";

export default class TrackHeader extends Component {
  static propTypes = {
    isLearnerPresent: PropTypes.bool.isRequired,
    companyId: PropTypes.string,
    moduleId: PropTypes.string,
    seriesId: PropTypes.string,
    defaultModuleRelevance: PropTypes.string
  };

  static defaultProps = {
    isLearnerPresent: false
  };

  render() {
    return (
      <div className={classnames(style.taskNameRow, "accordian")}>
        <div className={style.taskActions}>
          <div className={style.taskActionInviteLearnersDropdown}>
            <InviteLearners {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";

import Reminders from "@containers/reminders";
import DueDate from "../../components/dueDate";

export default class ReminderSettings extends Component {
  static propTypes = {
    details: PropTypes.object.isRequired,
    enableSettings: PropTypes.array,
    seriesId: PropTypes.string.isRequired,
    seriesLevelMailSettings: PropTypes.object.isRequired
  };
  static defaultProps = {
    enableSettings: ["DUE_DATE", "REMINDERS"]
  };

  isEnabled = settingType => {
    return this.props.enableSettings.includes(settingType);
  };

  render() {
    const {
      details: { id: moduleId, companyId },
      seriesId,
      seriesLevelMailSettings
    } = this.props;
    return [
      this.isEnabled("DUE_DATE") && <DueDate key="duedate" {...this.props} />,
      this.isEnabled("REMINDERS") && (
        <Reminders
          key="reminders"
          moduleId={moduleId}
          companyId={companyId}
          seriesId={seriesId}
          seriesLevelMailSettings={seriesLevelMailSettings}
        />
      )
    ];
  }
}

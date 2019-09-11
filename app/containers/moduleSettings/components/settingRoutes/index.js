import React, { Component } from "react";
import PropTypes from "prop-types";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";

import General from "../../components/generalSettings";
import Scoring from "../../components/scoringSettings";
import Reminder from "../../components/reminderSettings";

import Routes from "../../config/routes";

class SettingRoutes extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    enableSettings: PropTypes.shape({
      GENERAL: PropTypes.array,
      SCORING: PropTypes.array,
      REMINDERS: PropTypes.array
    })
  };

  static defaultProps = {
    enableSettings: {}
  };
  render() {
    const { match, enableSettings, ...rest } = this.props;
    const {
      general: generalPath,
      scoring: scoringPath,
      reminders: remindersPath
    } = Routes.settings;
    return (
      <Switch>
        <Route
          path={`${match.path}${generalPath}`}
          render={props => <General {...props} {...rest} enableSettings={enableSettings.GENERAL} />}
        />
        <Route
          path={`${match.path}${scoringPath}`}
          render={props => <Scoring {...props} {...rest} enableSettings={enableSettings.SCORING} />}
        />
        <Route
          path={`${match.path}${remindersPath}`}
          render={props => (
            <Reminder {...props} {...rest} enableSettings={enableSettings.REMINDERS} />
          )}
        />
        <Redirect to={`${match.url}${generalPath}`} />
      </Switch>
    );
  }
}
export default withRouter(SettingRoutes);

import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";

import { getActions, injectSaga, injectReducer } from "@core/helpers";
import { noop } from "@utils";
import Tabbing from "@components/tabbing";
import Loader from "@components/loader";

import SettingRoutes from "./components/settingRoutes";

import {
  SETTING_TABS,
  SETTING_TYPES,
  OPERATIONS,
  GET_SETTING_TYPE_KEY,
  GENERAL_SETTINGS_OPTIONS,
  SCORING_SETTINGS_OPTIONS,
  REMINDER_SETTINGS_OPTIONS
} from "./config/constants";
import Routes from "./config/routes";
import { GET_SETTINGS, MANIPULATE_SETTINGS, RESET_SETTINGS } from "./actionTypes";
import saga from "./saga";
import reducer from "./reducer";

const { UPDATE } = OPERATIONS;

const settingPropValidation = keys => {
  return function(propValue, key, componentName, location, propFullName) {
    if (!keys.includes(propValue[key])) {
      return new Error(
        "Invalid prop `" +
          propFullName +
          "` supplied to" +
          " `" +
          componentName +
          "`. Validation failed."
      );
    }
  };
};

class ModuleSettings extends Component {
  static propTypes = {
    match: PropTypes.object,

    moduleData: PropTypes.object.isRequired,
    moduleType: PropTypes.string.isRequired,
    seriesId: PropTypes.string.isRequired,
    taggingEnabled: PropTypes.bool.isRequired,
    onSettingUpdate: PropTypes.func,
    moduleUpdater: PropTypes.func,
    seriesLevelMailSettings: PropTypes.object.isRequired,
    sequentiallyLockedSeries: PropTypes.bool.isRequired,

    isLoading: PropTypes.bool,
    hasError: PropTypes.bool,
    loaded: PropTypes.bool,
    operationStatus: PropTypes.object,
    settings: PropTypes.object,
    moduleRelevanceEnabled: PropTypes.bool,

    getSettings: PropTypes.func.isRequired,
    manipulateData: PropTypes.func.isRequired,
    tabDisplayName: PropTypes.shape(
      Object.keys(SETTING_TYPES).reduce((validate, type) => {
        validate[type] = PropTypes.string;
        return validate;
      }, {})
    ),

    enableSettings: PropTypes.shape({
      GENERAL: PropTypes.arrayOf(settingPropValidation(Object.keys(GENERAL_SETTINGS_OPTIONS))),
      SCORING: PropTypes.arrayOf(settingPropValidation(Object.keys(SCORING_SETTINGS_OPTIONS))),
      REMINDERS: PropTypes.arrayOf(settingPropValidation(Object.keys(REMINDER_SETTINGS_OPTIONS)))
    })
  };
  static defaultProps = {
    operationStatus: {},
    settings: {},
    onUpdate: noop,
    tabDisplayName: {},
    moduleUpdater: noop
  };
  getSettingTabs = () => {
    const {
      match: { url: partialUrl },
      tabDisplayName
    } = this.props;
    const settingTabs = [];
    for (const [setting, displayName] of Object.entries(SETTING_TABS)) {
      const label = tabDisplayName[GET_SETTING_TYPE_KEY(setting)] || displayName;
      settingTabs.push({
        label,
        path: `${partialUrl}${Routes.settings[setting]}`
      });
    }
    return settingTabs;
  };
  update = ({ type, ...rest }) => {
    const { manipulateData, moduleUpdater } = this.props;
    manipulateData({
      operation: UPDATE,
      type,
      moduleUpdater,
      ...rest
    });
  };
  componentDidMount() {
    const { getSettings, loaded, seriesId, moduleData, moduleType } = this.props;
    !loaded && getSettings({ moduleId: moduleData.id, seriesId, moduleType });
  }

  componentWillReceiveProps(nextProps) {
    const {
      operationStatus: { loaded: newLoaded, data: { operation } = {} },
      onSettingUpdate
    } = nextProps;
    const {
      operationStatus: { loaded: oldLoaded }
    } = this.props;
    if (operation == UPDATE && newLoaded && newLoaded !== oldLoaded) {
      onSettingUpdate();
    }
  }

  render() {
    const {
      loaded,
      hasError,
      moduleData,
      settings,
      seriesId,
      taggingEnabled,
      enableSettings,
      seriesLevelMailSettings,
      moduleRelevanceEnabled,
      sequentiallyLockedSeries
    } = this.props;
    if (loaded && !hasError) {
      return (
        <div>
          <Tabbing links={this.getSettingTabs()} />
          <div className={classnames("rightTab", "clearfix", "pos_rel")}>
            <div className="marginB50">
              <SettingRoutes
                settings={settings}
                details={moduleData}
                seriesId={seriesId}
                update={this.update}
                taggingEnabled={taggingEnabled}
                moduleRelevanceEnabled={moduleRelevanceEnabled}
                enableSettings={enableSettings}
                seriesLevelMailSettings={seriesLevelMailSettings}
                sequentiallyLockedSeries={sequentiallyLockedSeries}
              />
            </div>
          </div>
        </div>
      );
    }
    return <Loader size="sizeSmall" />;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getSettings: params => dispatch(getActions(GET_SETTINGS)(params)),
    manipulateData: data => {
      dispatch(getActions(MANIPULATE_SETTINGS)(data));
    }
  };
};

const mapStateToProps = state => {
  const { isLoading, loaded, hasError, operationStatus, settings } = state.moduleSettings;

  const { data: { features: { moduleRelevanceEnabled } = {} } = {} } = state.auth;

  return {
    isLoading,
    loaded,
    hasError,
    settings,
    operationStatus,
    moduleRelevanceEnabled
  };
};
const withReducer = injectReducer({
  name: "moduleSettings",
  reducer: reducer
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withSaga = injectSaga({ name: "moduleSettings", saga: saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(ModuleSettings);

export const RESET_ACTION_TYPE = RESET_SETTINGS;

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Switch, withRouter, Redirect } from "react-router-dom";

import { Defaults, LIFECYCLE_STAGES } from "@config/env.config";
import WithPageTitle from "@hocs/withPageTitle";
import { haveStageAccess } from "@utils/permissions";

import PrivateRoute from "@components/privateRoute";
import Publish from "@components/modulePublishWrapper";
import ModuleTrackWrapper from "@components/moduleTrackWrapper";

import Settings from "@containers/moduleSettings";

import Build from "../../containers/build";
import Track from "../../containers/track";

import Routes from "../../config/routes";

const BuildWithTitle = WithPageTitle(Build);
const SettingsWithTitle = WithPageTitle(Settings);
const TrackWrapperWithTitle = WithPageTitle(ModuleTrackWrapper);
const PublishWithTitle = WithPageTitle(Publish);

const {
  [LIFECYCLE_STAGES.BUILD]: buildPath,
  [LIFECYCLE_STAGES.PUBLISH]: publishPath,
  [LIFECYCLE_STAGES.INVITE]: invitePath,
  [LIFECYCLE_STAGES.SETTINGS]: settingsPath
} = Routes.lifecycle;

class ChecklistRoutes extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    baseUrl: PropTypes.string.isRequired,
    seriesData: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      permissions: PropTypes.object,
      seriesLevelMailSettings: PropTypes.object,
      sequentiallyLockedSeries: PropTypes.bool.isRequired
    }).isRequired,
    moduleData: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      isPublished: PropTypes.bool.isRequired,
      mappedSeries: PropTypes.array.isRequired
    }).isRequired,
    companyData: PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }).isRequired,
    userData: PropTypes.shape({
      permissions: PropTypes.object.isRequired,
      isSiteOwner: PropTypes.bool.isRequired,
      taggingEnabled: PropTypes.bool.isRequired
    }).isRequired,
    enabledFeatures: PropTypes.shape({
      moduleRelevanceEnabled: PropTypes.bool.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      onSettingUpdate: PropTypes.func.isRequired,
      onPublish: PropTypes.func.isRequired,
      updateSavingState: PropTypes.func
    })
  };
  haveAccess = stage => {
    const { userData, seriesData } = this.props;
    return haveStageAccess(stage, userData.permissions, seriesData.permissions, {
      isSiteOwner: userData.isSiteOwner
    });
  };
  getProps = () => {
    const {
      moduleData,
      seriesData,
      userData,
      companyData,
      actions,
      baseUrl,
      enabledFeatures
    } = this.props;
    return {
      [LIFECYCLE_STAGES.BUILD]: {
        updateSavingState: actions.updateSavingState
      },
      [LIFECYCLE_STAGES.PUBLISH]: {
        isPublished: moduleData.isPublished,
        onPublish: actions.onPublish
      },
      [LIFECYCLE_STAGES.INVITE]: {
        isSiteOwner: userData.isSiteOwner,
        mappedSeries: moduleData.mappedSeries,
        taggingEnabled: userData.taggingEnabled,
        globalPermissions: userData.permissions,
        onSettingUpdate: actions.onSettingUpdate,
        seriesPermissions: seriesData.permissions,
        enabledFeatures
      },
      [LIFECYCLE_STAGES.SETTINGS]: {
        moduleData,
        moduleUpdater: actions.moduleUpdater,
        onSettingUpdate: actions.onSettingUpdate,
        globalPermissions: userData.permissions,
        taggingEnabled: userData.taggingEnabled,
        seriesLevelMailSettings: seriesData.seriesLevelMailSettings,
        sequentiallyLockedSeries: seriesData.sequentiallyLockedSeries
      },
      COMMON_PROPS: {
        baseUrl: baseUrl,
        stageRoutes: Routes.lifecycle,
        moduleId: moduleData.id,
        seriesId: seriesData.id,
        companyId: companyData.id,
        moduleName: moduleData.name,
        moduleType: moduleData.type,
        isPublished: moduleData.isPublished
      }
    };
  };

  render() {
    const customProps = this.getProps();
    const { match } = this.props;

    return (
      <Switch>
        <PrivateRoute
          path={`${match.path}${buildPath}`}
          authenticated={this.haveAccess(LIFECYCLE_STAGES.BUILD)}
          render={props => (
            <BuildWithTitle
              {...props}
              {...customProps.COMMON_PROPS}
              {...customProps[LIFECYCLE_STAGES.BUILD]}
              tabName={Defaults.moduleLifeCycle[LIFECYCLE_STAGES.BUILD]}
            />
          )}
        />
        <PrivateRoute
          path={`${match.path}${settingsPath}`}
          authenticated={this.haveAccess(LIFECYCLE_STAGES.SETTINGS)}
          render={props => (
            <SettingsWithTitle
              {...props}
              {...customProps.COMMON_PROPS}
              {...customProps[LIFECYCLE_STAGES.SETTINGS]}
              tabName={Defaults.moduleLifeCycle[LIFECYCLE_STAGES.SETTINGS]}
            />
          )}
        />
        <PrivateRoute
          path={`${match.path}${publishPath}`}
          authenticated={this.haveAccess(LIFECYCLE_STAGES.PUBLISH)}
          render={props => (
            <PublishWithTitle
              {...props}
              {...customProps.COMMON_PROPS}
              {...customProps[LIFECYCLE_STAGES.PUBLISH]}
              tabName={Defaults.moduleLifeCycle[LIFECYCLE_STAGES.PUBLISH]}
            />
          )}
        />
        <PrivateRoute
          path={`${match.path}${invitePath}`}
          authenticated={this.haveAccess(LIFECYCLE_STAGES.INVITE)}
          render={props => (
            <TrackWrapperWithTitle
              {...props}
              {...customProps.COMMON_PROPS}
              {...customProps[LIFECYCLE_STAGES.INVITE]}
              tabName={Defaults.moduleLifeCycle[LIFECYCLE_STAGES.INVITE]}
              component={Track}
            />
          )}
        />
        <Redirect to={`${match.url}${buildPath}`} />
      </Switch>
    );
  }
}
export default withRouter(ChecklistRoutes);

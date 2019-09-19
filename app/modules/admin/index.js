import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { MT_MODULES } from "@config/global.config";
import { noop } from "@utils";
import { RESET_ACTION_TYPE as RESET_SETTINGS } from "@containers/moduleSettings";
import ChecklistHeader from "@components/moduleHeader";
import ChecklistRoutes from "./components/checklistRoutes";
import Routes from "./config/routes";

import reducer from "./reducers";
import saga, { updateModuleDetails as updateModuleDetailsGenerator } from "./saga";
import GET_ERROR_MESSAGES from "./config/error.messages";
import { MODULE_OPTION, OPERATIONS } from "./config/constants";
import {
  GET_CHECKLIST_DATA,
  MANIPULATE_CHECKLIST_DATA,
  HANDLE_UNPUBLISHED_CHANGES_FLAG,
  RESET_BUILD_DATA
} from "./actionTypes";

import { injectReducer, injectSaga, getActions } from "@core/helpers";
import { isUndefined, reload } from "@utils";
import { errorToast as ErrorToast } from "@utils/toast";

import { getSeriesUrl } from "@utils/generateUrls";

import Loader from "@components/loader";

const { DISCARD, ARCHIVE } = MODULE_OPTION;
const { REFETCH } = OPERATIONS;
class Checklist extends Component {
  static propTypes = {
    seriesData: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      permissions: PropTypes.object,
      seriesLevelMailSettings: PropTypes.object,
      sequentiallyLockedSeries: PropTypes.bool
    }),
    moduleData: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      isPublished: PropTypes.bool,
      mappedSeries: PropTypes.array,
      maxScore: PropTypes.number
    }),
    hasUnpubChanges: PropTypes.bool,
    actions: PropTypes.shape({
      getData: PropTypes.func.isRequired,
      manipulateData: PropTypes.func.isRequired,
      resetBuild: PropTypes.func.isRequired,
      resetSettings: PropTypes.func.isRequired
    }).isRequired,
    userData: PropTypes.shape({
      permissions: PropTypes.object.isRequired,
      isSiteOwner: PropTypes.bool.isRequired,
      taggingEnabled: PropTypes.bool.isRequired
    }).isRequired,
    enabledFeatures: PropTypes.shape({
      moduleRelevanceEnabled: PropTypes.bool.isRequired
    }).isRequired,
    companyData: PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string.isRequired,
      isNewDashboard: PropTypes.bool
    }).isRequired,
    status: PropTypes.shape({
      isLoading: PropTypes.bool,
      hasError: PropTypes.bool,
      loaded: PropTypes.bool
    }),
    match: PropTypes.object.isRequired,
    operationStatus: PropTypes.shape({
      isLoading: PropTypes.bool,
      hasError: PropTypes.bool,
      loaded: PropTypes.bool
    })
  };

  static defaultProps = {
    operationStatus: {
      data: {}
    },
    seriesData: {
      permissions: {}
    },
    moduleData: {
      mappedSeries: []
    }
  };

  state = {
    saving: false,
    maxScore: 0
  };

  updateState = ({ maxScore, saving }) => {
    maxScore = isUndefined(maxScore) ? this.state.maxScore : maxScore;
    saving = isUndefined(saving) ? this.state.saving : saving;
    this.setState({
      saving,
      maxScore
    });
  };

  update = (operation, value) => {
    this.props.actions.manipulateData({
      operation,
      name: value
    });
  };

  goToSeries = () => {
    const url = getSeriesUrl(this.props.seriesData.id, this.props.companyData.isNewDashboard);
    reload(url);
  };

  onPublish = () => {
    const {
      actions: { manipulateData, resetBuild, resetSettings }
    } = this.props;
    manipulateData({ operation: REFETCH });
    resetBuild();
    resetSettings();
  };

  onSettingUpdate = () => {
    const {
      moduleData: { isPublished },
      actions: { resetBuild, updateHasPublishedChanges }
    } = this.props;
    isPublished && updateHasPublishedChanges();
    resetBuild();
  };

  componentDidUpdate(prevProps) {
    const {
      moduleData: { maxScore },
      operationStatus: { hasError, error, loaded, data: { operation } = {} }
    } = this.props;
    const {
      operationStatus: { hasError: prevHasError }
    } = prevProps;
    if (prevProps.moduleData.maxScore !== maxScore) {
      this.setState({ maxScore });
    }
    if (hasError && hasError !== prevHasError) {
      ErrorToast({ message: GET_ERROR_MESSAGES(error) });
    }
    if (loaded && !hasError && [DISCARD, ARCHIVE].includes(operation)) {
      this.goToSeries();
    }
  }

  componentDidMount() {
    const {
      match: {
        params: { moduleId, seriesId }
      },
      status: { loaded },
      actions: { getData }
    } = this.props;

    if (!loaded) {
      getData({ moduleId, seriesId });
    }
  }

  render() {
    const { maxScore, saving } = this.state;
    const {
      userData,
      moduleData,
      seriesData,
      companyData,
      hasUnpubChanges,
      match: { url: baseUrl },
      status: { loaded, hasError },
      enabledFeatures
    } = this.props;

    const commonProps = {
      moduleData,
      seriesData,
      userData,
      companyData,
      baseUrl,
      stageRoutes: Routes.lifecycle,
      enabledFeatures,
      actions: {
        updateModule: this.update,
        goToSeries: this.goToSeries,
        onPreview: noop,
        onSettingUpdate: this.onSettingUpdate,
        onPublish: this.onPublish,
        moduleUpdater: updateModuleDetailsGenerator,
        updateSavingState: saving => this.updateState({ saving })
      }
    };

    if (loaded && !hasError) {
      return [
        <ChecklistHeader
          {...commonProps}
          key="moduleHeader"
          maxScore={maxScore}
          saving={saving}
          moduleOperations={MODULE_OPTION}
          hasUnpublishedChanges={hasUnpubChanges}
        />,
        <ChecklistRoutes key="routes" {...commonProps} />
      ];
    }
    return <Loader size="sizeSmall" />;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getData: ({ moduleId, seriesId }) => {
      dispatch(getActions(GET_CHECKLIST_DATA)({ moduleId, seriesId }));
    },
    manipulateData: data => {
      dispatch(getActions(MANIPULATE_CHECKLIST_DATA)(data));
    },
    resetBuild: () => {
      dispatch(getActions(RESET_BUILD_DATA)());
    },
    resetSettings: () => {
      dispatch(getActions(RESET_SETTINGS)());
    },
    updateHasPublishedChanges: () => {
      getActions(HANDLE_UNPUBLISHED_CHANGES_FLAG)({
        hasChanges: true
      });
    }
  };
};

const mapStateToProps = state => {
  const {
    loaded,
    isLoading,
    hasError,
    series,
    staticData = {},
    unpublishedChanges: { hasChanges: hasUnpubChanges = false } = {},
    operationStatus
  } = state.checklist.details || {};
  const { company, features = {}, ...auth } = state.auth.data;
  return {
    auth,
    series,
    loaded,
    company,
    hasError,
    isLoading,
    staticData,
    operationStatus,
    hasUnpubChanges,
    enabledFeatures: features
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    seriesData: stateProps.series,
    moduleData: {
      ...stateProps.staticData,
      type: MT_MODULES.CHECKLIST
    },
    hasUnpubChanges: stateProps.hasUnpubChanges,
    status: {
      loaded: stateProps.loaded,
      isLoading: stateProps.isLoading,
      hasError: stateProps.hasError
    },
    operationStatus: stateProps.operationStatus,
    companyData: {
      id: stateProps.staticData.companyId,
      ...stateProps.company
    },
    userData: stateProps.auth,
    enabledFeatures: stateProps.enabledFeatures,
    actions: {
      getData: dispatchProps.getData,
      manipulateData: dispatchProps.manipulateData,
      resetBuild: dispatchProps.resetBuild,
      resetSettings: dispatchProps.resetSettings
    },
    ...ownProps
  };
};

const withReducer = injectReducer({
  name: "checklist",
  reducer: reducer
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
);
const withSaga = injectSaga({ name: "checklist", saga: saga });

export default compose(
  withRouter,
  withReducer,
  withSaga,
  withConnect
)(Checklist);

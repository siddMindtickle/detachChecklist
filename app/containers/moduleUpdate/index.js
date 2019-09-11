import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Tabbing from "@components/tabbing";
import Loader from "@components/loader";
import { showTodos } from "@containers/todos";

import { injectReducer, injectSaga, getActions } from "@core/helpers";
import { showConfirmBox } from "@utils/alert";
import { infoToast, successToast, errorToast } from "@utils/toast";
import { LIFECYCLE_STAGES } from "@config/env.config";
import { getLifecycleStageUrl } from "@utils";

import AllChanges from "./components/allChanges";

import { INVITE_TYPES } from "./config/constants";
import { getPublishVersionUrl } from "./utils";
import saga from "./saga";
import reducer from "./reducer";
import { GET_PUBLISH_HISTORY, MANIPULATE_DATA, RESET_PUBLISH_HISTORY } from "./actionTypes";
import {
  DRAFT_VERSION_DETAILS,
  OPERATIONS,
  GET_VERSION_DISPLAY_NAME,
  MESSAGES
} from "./config/constants";
import GET_ERROR_MESSAGES from "./config/error.messages";
import "./index.scss";

const { GET_SUMMARY, PUBLISH, DISCARD } = OPERATIONS;

class PublishHistory extends Component {
  static propTypes = {
    className: PropTypes.string,
    match: PropTypes.object.isRequired,
    moduleId: PropTypes.string.isRequired,
    seriesId: PropTypes.string.isRequired,
    companyId: PropTypes.string.isRequired,
    moduleType: PropTypes.string.isRequired,
    showInviteOptions: PropTypes.bool,
    defaultInviteOption: PropTypes.oneOf(Object.keys(INVITE_TYPES)),
    todos: PropTypes.number,
    publishSummary: PropTypes.object,
    publishHistory: PropTypes.array,
    hasUnpublishedChanges: PropTypes.bool,
    operationStatus: PropTypes.object,
    baseUrl: PropTypes.string.isRequired,
    stageRoutes: PropTypes.object.isRequired,
    reset: PropTypes.func.isRequired,
    getPublishHistory: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    showTodos: PropTypes.func.isRequired,
    onPublish: PropTypes.func.isRequired,
    manipulateData: PropTypes.func.isRequired,
    loaded: PropTypes.bool,
    hasError: PropTypes.bool,
    isLoading: PropTypes.bool,
    learnerCounts: PropTypes.object
  };

  static defaultProps = {
    publishSummary: {},
    publishHistory: [],
    operationStatus: {},
    todos: 0,
    hasUnpublishedChanges: false,
    showInviteOptions: true,
    defaultInviteOption: "INVITE_NONE",
    learnerCounts: {}
  };

  getPublishHistoryTabs = () => {
    let { publishHistory, baseUrl, stageRoutes: routes } = this.props;
    baseUrl = getLifecycleStageUrl({
      baseUrl,
      stage: LIFECYCLE_STAGES.PUBLISH,
      routes
    });
    return publishHistory.map(versionDetails => {
      return {
        label: GET_VERSION_DISPLAY_NAME(versionDetails.time),
        path: getPublishVersionUrl({
          baseUrl,
          version: versionDetails.version
        })
      };
    });
  };

  getUnpublishedTab = () => {
    let baseUrl = getLifecycleStageUrl({
      baseUrl: this.props.baseUrl,
      stage: LIFECYCLE_STAGES.PUBLISH,
      routes: this.props.stageRoutes
    });
    return [
      {
        label: DRAFT_VERSION_DETAILS.displayName,
        path: getPublishVersionUrl({
          baseUrl,
          version: DRAFT_VERSION_DETAILS.version
        })
      }
    ];
  };

  publishChanges = ({ notify, inviteLearner }) => {
    const { moduleId, companyId, seriesId, manipulateData } = this.props;
    manipulateData({
      operation: PUBLISH,
      moduleId,
      seriesId,
      companyId,
      notify,
      inviteLearner
    });
  };

  discardChanges = () => {
    const { moduleId, companyId, seriesId, manipulateData } = this.props;
    showConfirmBox(MESSAGES[DISCARD].confirm, {
      callback: confirmed => {
        confirmed &&
          manipulateData({
            operation: DISCARD,
            moduleId,
            seriesId,
            companyId
          });
      }
    });
  };

  getSummary = version => {
    const { moduleId, seriesId, manipulateData } = this.props;
    manipulateData({
      operation: GET_SUMMARY,
      moduleId,
      seriesId,
      version
    });
  };

  onSuccess = operation => {
    const { history, onPublish, baseUrl, stageRoutes: routes } = this.props;
    onPublish();
    history.push(
      getLifecycleStageUrl({
        baseUrl,
        stage: operation == DISCARD ? LIFECYCLE_STAGES.BUILD : LIFECYCLE_STAGES.INVITE,
        routes
      })
    );
  };

  componentDidUpdate(prevProps) {
    const { loaded: prevLoaded } = prevProps.operationStatus;
    const {
      data: { operation } = {},
      loaded,
      hasError,
      isLoading,
      error: { errorCode } = {}
    } = this.props.operationStatus;
    if (prevLoaded !== loaded) {
      switch (operation) {
        case PUBLISH:
        case DISCARD:
          isLoading && infoToast({ message: MESSAGES[operation].loading });
          if (loaded && !hasError) {
            successToast({ message: MESSAGES[operation].sucess });
            this.onSuccess(operation);
          } else if (loaded && hasError) {
            errorToast({ message: GET_ERROR_MESSAGES[errorCode] });
          }
          break;
      }
    }
  }

  componentDidMount() {
    const { moduleId, seriesId, companyId, moduleType, getPublishHistory } = this.props;
    getPublishHistory({
      moduleId,
      seriesId,
      companyId,
      moduleType
    });
  }

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    const {
      loaded,
      hasError,
      hasUnpublishedChanges,
      showInviteOptions,
      defaultInviteOption,
      publishSummary,
      publishHistory,
      todos,
      showTodos,
      moduleType,
      learnerCounts,
      operationStatus: { isLoading: operationInProgress } = {}
    } = this.props;
    return loaded && !hasError ? (
      <div className="published-history-page">
        <div key="section-left" className="ph-left-container">
          {hasUnpublishedChanges && (
            <Tabbing links={this.getUnpublishedTab()} className="ph-unpublished-tab" />
          )}
          <div key="version-changes-heading" className="ph-up-title">
            Publish History
          </div>
          <Tabbing links={this.getPublishHistoryTabs()} className="ph-published-tab" />
        </div>
        <AllChanges
          todos={todos}
          publishSummary={publishSummary}
          publishHistory={publishHistory}
          moduleType={moduleType}
          hasUnpublishedChanges={hasUnpublishedChanges}
          showInviteOptions={showInviteOptions}
          defaultInviteOption={INVITE_TYPES[defaultInviteOption]}
          getSummary={this.getSummary}
          showTodos={showTodos}
          publishChanges={this.publishChanges}
          discardChanges={this.discardChanges}
          operationInProgress={!!operationInProgress}
          learnerCounts={learnerCounts}
        />
      </div>
    ) : (
      <Loader />
    );
  }
}
const mapStateToProps = state => {
  const {
    history: {
      data: {
        versions: publishHistory,
        hasChanges: hasUnpublishedChanges,
        todos,
        learnerCounts
      } = {},
      loaded,
      hasError,
      isLoading
    } = {},
    operationStatus = {},
    summary: publishSummary
  } = state.modulePublishHistory;
  return {
    todos,
    publishHistory,
    publishSummary,
    hasUnpublishedChanges,
    operationStatus,
    loaded,
    hasError,
    isLoading,
    learnerCounts
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getPublishHistory: params => dispatch(getActions(GET_PUBLISH_HISTORY)(params)),
    manipulateData: params =>
      dispatch(
        getActions(MANIPULATE_DATA)(params, {
          loadingData: { operation: params.operation }
        })
      ),
    showTodos: () => {
      dispatch(showTodos());
    },
    reset: () => {
      dispatch(getActions(RESET_PUBLISH_HISTORY)());
    }
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({ name: "modulePublishHistory", reducer });
const withSaga = injectSaga({ name: "modulePublishHistory", saga });

export default compose(
  withRouter,
  withReducer,
  withSaga,
  withConnect
)(PublishHistory);

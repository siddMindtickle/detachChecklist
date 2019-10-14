import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { injectIntl, intlShape } from "react-intl";
import { Helmet } from "react-helmet";
import { hideLoader } from "@utils/loader";
import Alert from "@utils/alert";
import { reload, isWebView } from "@utils";
import { getSeriesUrl_learner as getSeriesUrl } from "@utils/generateUrls";

import { injectReducer, injectSaga, getActions } from "@core/helpers";
import { OVERVIEW_ID } from "@config/env.config";
import Loader from "@components/loader";
import EntityHeader from "@containers/entityHeader";

import { OPERATIONS } from "./config/constants";
import reducer from "./reducer";
import saga from "./saga";
import ErrorParser from "./utils/errorParser";
import { FETCH_INIT_DATA, MANIPULATE_DATA } from "./actionTypes";
import ChecklistWrapper from "./components/checklistWrapper";
import CompletionModal from "./components/completionModal";

const entityIcon = (
  <div
    className="displayIB F13"
    style={{
      background: "#8e8cc2",
      width: "24px",
      height: "24px",
      lineHeight: "24px",
      textAlign: "center",
      fontSize: "14px",
      color: "#fff"
    }}
  >
    L
  </div>
);
class Checklist extends Component {
  static propTypes = {
    getChecklistData: PropTypes.func.isRequired,
    manipulateData: PropTypes.func.isRequired,
    operationStatus: PropTypes.object,
    match: PropTypes.object.isRequired,
    loaded: PropTypes.bool,
    error: PropTypes.object,
    hasError: PropTypes.bool,
    moduleState: PropTypes.object,
    moduleData: PropTypes.object,
    seriesData: PropTypes.object,
    levels: PropTypes.object,
    sections: PropTypes.object,
    tasks: PropTypes.object,
    intl: intlShape.isRequired
  };

  static defaultProps = {
    loaded: false,
    operationStatus: {},
    moduleState: {},
    moduleData: {},
    seriesData: {},
    levels: {},
    sections: {},
    tasks: {},
    error: {}
  };

  state = {
    loadingTask: false,
    updatingTask: false,
    selectedId: undefined
  };

  getHeader = ({ seriesData, moduleName }) => {
    if (isWebView()) {
      return "";
    }
    return <EntityHeader series={seriesData} entityIcon={entityIcon} entityName={moduleName} />;
  };

  handleOperation = ({ operation, ...data }) => {
    this.props.manipulateData({ operation, data });
  };

  gotoSeries = () => {
    const url = getSeriesUrl(this.props.seriesData.id);
    reload(url);
  };

  gotoOverview = () => {
    this.setState({ selectedId: OVERVIEW_ID, showCompletionModal: false });
  };

  componentDidMount() {
    const {
      match: {
        params: { moduleId, seriesId }
      },
      getChecklistData
    } = this.props;
    getChecklistData({ moduleId, seriesId });
  }

  componentWillReceiveProps(nextProps) {
    const {
      operationStatus: {
        isLoading,
        hasError,
        error,
        loaded,
        loadingData = {},
        data: { taskId, operation } = {}
      },
      intl,
      moduleState: { isCompleted: newIsCompleted }
    } = nextProps;
    const {
      operationStatus: { isLoading: oldIsLoading, loaded: oldLoadedState, hasError: oldHasError },
      moduleState: { isCompleted }
    } = this.props;

    const oldEntityStatus = {
      loaded: this.props.loaded,
      hasError: this.props.hasError
    };
    const newEntityStatus = {
      loaded: nextProps.loaded,
      hasError: nextProps.hasError,
      error: nextProps.error
    };

    if (hasError && hasError !== oldHasError) {
      const parsedError = ErrorParser(error, { intl });
      return Alert(parsedError.message, parsedError.options);
    }

    if (newEntityStatus.hasError && newEntityStatus.hasError !== oldEntityStatus.hasError) {
      const parsedError = ErrorParser(newEntityStatus.error, { intl });
      return Alert(parsedError.message, parsedError.options);
    }

    if (isLoading && newIsCompleted !== isCompleted) {
      this.setState({ showCompletionModal: newIsCompleted });
    }

    let newState;

    switch (loadingData.operation || operation) {
      case OPERATIONS.SELECT:
        if (isLoading && isLoading !== oldIsLoading) {
          newState = { loadingTask: true, updatingTask: false };
        } else if (!hasError && loaded && loaded !== oldLoadedState) {
          newState = { loadingTask: false, updatingTask: false };
        }
        break;
      case OPERATIONS.COMPLETE:
        if (isLoading && isLoading !== oldIsLoading) {
          newState = { loadingTask: false, updatingTask: true };
        } else if (!hasError && loaded && loaded !== oldLoadedState) {
          newState = { loadingTask: false, updatingTask: false };
        }
        break;
      case OPERATIONS.START:
        newState = {};
        break;
    }
    newState && this.setState({ ...newState, selectedId: taskId });
  }

  componentDidUpdate() {
    this.props.loaded && setTimeout(hideLoader, 0); // this is a hack
  }

  render() {
    const {
      company,
      tasks,
      levels,
      loaded,
      hasError,
      sections,
      moduleData,
      seriesData,
      moduleState
    } = this.props;
    const { loadingTask, updatingTask, selectedId, showCompletionModal } = this.state;
    const params = {
      tasks,
      levels,
      sections,
      selectedId,
      moduleData,
      seriesData,
      moduleState,
      loadingTask,
      updatingTask
    };
    return loaded && !hasError ? (
      [
        <Helmet key={company.data.title} title={company.data.title} />,
        <ChecklistWrapper
          key="checklistwrapper"
          {...params}
          operations={OPERATIONS}
          handleOperation={this.handleOperation}
          gotoSeries={this.gotoSeries}
          header={this.getHeader({ seriesData, moduleName: moduleData.name })}
        />,
        showCompletionModal && (
          <CompletionModal
            key="checklistmodal"
            score={moduleState.score}
            maxScore={moduleData.maxScore}
            gotoOverview={this.gotoOverview}
            gotoSeries={this.gotoSeries}
          />
        )
      ]
    ) : (
      <Loader />
    );
  }
}

const mapStateToProps = state => {
  const {
    isLoaded,
    hasError,
    loaded,
    error,
    operationStatus,
    moduleState,
    moduleData,
    seriesData,
    levels,
    sections,
    tasks
  } = state.checklist;
  const { company } = state.auth;
  return {
    isLoaded,
    hasError,
    loaded,
    error,
    operationStatus,
    moduleState,
    moduleData,
    seriesData,
    levels,
    sections,
    tasks,
    company
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getChecklistData: context => dispatch(getActions(FETCH_INIT_DATA)(context)),
    manipulateData: params =>
      dispatch(getActions(MANIPULATE_DATA)({ ...params }, { loadingData: params }))
  };
};

const withReducer = injectReducer({
  name: "checklist",
  reducer: reducer
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withSaga = injectSaga({ name: "checklist", saga: saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl
)(Checklist);

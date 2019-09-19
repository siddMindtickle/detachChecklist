import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getActions, injectSaga } from "@core/helpers";
import { isUndefined, debounce, isObject, deepEqual, invitedOnDateFormatter } from "@utils";
import { showConfirmBox } from "@utils/alert";
import {
  infoToast as InfoToast,
  errorToast as ErrorToast,
  successToast as SuccessToast
} from "@utils/toast";
import MultiFilterPanel, { COMPONENT_TYPES } from "@components/multiFilterPanel";
import Loader from "@components/loader";
import Pagination from "@components/pagination";

import TrackLearnerSummary from "../../components/trackLearnerSummary";
import TrackHeader from "../../components/trackHeader";
import TrackLearnersTable from "../../components/trackLearnersTable";
import TrackMultiSelectHeader from "../../components/trackMultiSelectHeader";
import TrackNoInvitedLearners from "../../components/trackNoInvitedLearners";
import TrackOperationConfirmation from "../../components/trackOperationConfirmation";
import RelevanceSelectionPopup from "@components/relevanceSelectionPopup";

import { TRACK_GET_DATA, TRACK_MANIPULATE_DATA } from "../../actionTypes";
import {
  GET_LEARNER_COUNT_DISPLAY_NAME,
  GET_STATUS_DISPLAY_NAME,
  GET_MODULE_RELEVANCE_BY_VALUE,
  MODULE_RELEVANCE_DD_OPTIONS,
  GET_DISPLAY_SCORE,
  SUPPORTED_FILTERS,
  DEFAULT_LEARNERS_TYPE,
  DEFAULT_LEARNERS_SORT,
  LEARNER_TYPES,
  DEFAULT_PAGINATION,
  DEBOUNCE_TIME,
  OPERATIONS,
  MESSAGES
} from "../../config/track.constants";
import GET_ERROR_MESSAGES from "../../config/error.messages";
import style from "./index.scss";
import saga from "./saga";

const {
  SORT_LEARNERS,
  SEARCH_LEARNERS,
  GET_LEARNERS,
  REMOVE_LEARNERS,
  RESET_PROGRESS,
  CHANGE_RELEVANCE,
  VIEW_LEARNER_PROFILE,
  PAGINATE_LEARNERS
} = OPERATIONS;

class ChecklistTrack extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    hasError: PropTypes.bool,
    loaded: PropTypes.bool,
    poll: PropTypes.object,
    learners: PropTypes.object,
    groups: PropTypes.array,
    searchedLearners: PropTypes.array,
    learnerCounts: PropTypes.object,
    operationStatus: PropTypes.object,
    getTrackData: PropTypes.func.isRequired,
    manipulateData: PropTypes.func.isRequired,
    moduleType: PropTypes.string.isRequired,
    companyId: PropTypes.string,
    moduleId: PropTypes.string,
    seriesId: PropTypes.string,
    globalPermissions: PropTypes.object.isRequired,
    seriesPermissions: PropTypes.object.isRequired,
    isSiteOwner: PropTypes.bool.isRequired,
    enabledFeatures: PropTypes.shape({
      moduleRelevanceEnabled: PropTypes.bool.isRequired
    }).isRequired,
    defaultModuleRelevance: PropTypes.string
  };

  static defaultProps = {
    operationStatus: {},
    poll: {}
  };

  state = {
    learnerStatusType: DEFAULT_LEARNERS_TYPE,
    filters: {
      [SUPPORTED_FILTERS.GROUPS]: undefined,
      [SUPPORTED_FILTERS.SEARCH]: undefined
    },
    sort: DEFAULT_LEARNERS_SORT,
    selectedLearners: [],
    pagination: DEFAULT_PAGINATION,
    showRelevanceSelectionModal: false,
    learnersForModuleRelevanceChange: []
  };

  getResetMultiState = { selectedLearners: [], multi: false };

  onSelect = ({ selectionData }) => {
    this.setState({
      selectedLearners: selectionData,
      multi: !!selectionData.length
    });
  };

  toggleSelectionAll = (select = true) => {
    const newState = select
      ? { selectedLearners: [...this.props.searchedLearners] }
      : this.getResetMultiState;

    this.setState(newState);
  };

  getPaginationState = ({ resetPage = false, resetRows = false }) => {
    let pagination = {
      ...this.state.pagination
    };
    if (resetPage) {
      pagination.start = 0;
    }
    if (resetRows) {
      pagination.rows = DEFAULT_PAGINATION.rows;
    }
    return pagination;
  };

  prepareFilters = rawFilters => {
    let filters = [];
    for (const [filterType, filterValue] of Object.entries(rawFilters)) {
      !isUndefined(filterValue) && filters.push({ type: filterType, value: filterValue });
    }
    return filters;
  };

  onFilterSelect = ({ filterType, data }) => {
    const pagination = this.getPaginationState({ resetPage: true });
    const newState = {
      ...this.state,
      ...this.getResetMultiState,
      filters: {
        ...this.state.filters,
        [filterType]: data
      },
      pagination
    };
    this.setState(newState);
    this.props.manipulateData({
      operation: SEARCH_LEARNERS,
      type: newState.learnerStatusType,
      sort: newState.sort,
      pagination: newState.pagination,
      filters: this.prepareFilters(newState.filters)
    });
  };

  onSort = sort => {
    const pagination = this.getPaginationState({ resetPage: true });
    const newState = {
      ...this.state,
      ...this.getResetMultiState,
      sort,
      pagination
    };
    this.setState(newState);
    this.props.manipulateData({
      operation: SORT_LEARNERS,
      type: newState.learnerStatusType,
      sort: newState.sort,
      pagination: newState.pagination,
      filters: this.prepareFilters(newState.filters)
    });
  };

  getFiltersConfig = (groups, moduleRelevanceEnabled) => {
    const filters = [
      {
        type: COMPONENT_TYPES.DROPDOWN,
        props: {
          onSelect: groups => {
            this.onFilterSelect({
              filterType: SUPPORTED_FILTERS.GROUPS,
              data: groups
            });
          },
          multi: true,
          options: groups
        }
      },
      {
        type: COMPONENT_TYPES.SEARCH,
        props: {
          placeholder: "Search Learners",
          onSearch: debounce(query => {
            this.onFilterSelect({
              filterType: SUPPORTED_FILTERS.SEARCH,
              data: query
            });
          }, DEBOUNCE_TIME)
        }
      }
    ];

    const relevanceFilter = {
      type: COMPONENT_TYPES.DROPDOWN,
      props: {
        onSelect: options => {
          this.onFilterSelect({
            filterType: SUPPORTED_FILTERS.MODULE_RELEVANCE,
            data: options
          });
        },
        multiple: true,
        title: "Module Relevance",
        setTitle: true,
        search: false,
        options: MODULE_RELEVANCE_DD_OPTIONS,
        showSelectedValues: true
      }
    };

    if (moduleRelevanceEnabled) {
      filters.splice(1, 0, relevanceFilter);
    }

    return filters;
  };

  getSummaryTabs = (learnerCounts = []) => {
    return Object.keys(learnerCounts).reduce((result, type) => {
      const { count, percentage, displayIndex } = learnerCounts[type];
      result[displayIndex] = {
        title: GET_LEARNER_COUNT_DISPLAY_NAME({
          count,
          percentage,
          type
        }),
        type
      };
      return result;
    }, []);
  };

  createTableData = ({ searchedLearners, learners }) => {
    return searchedLearners.map(id => {
      const {
        name,
        email,
        score,
        maxScore,
        status,
        completed,
        total,
        invitedOn,
        moduleRelevance
      } = learners[id];
      return {
        id,
        learner: name,
        email: email,
        completionStatus: GET_STATUS_DISPLAY_NAME({
          status,
          completed,
          total
        }),
        score: GET_DISPLAY_SCORE({ score, maxScore }),
        status,
        invitedOn: invitedOnDateFormatter(invitedOn),
        moduleRelevance: GET_MODULE_RELEVANCE_BY_VALUE(moduleRelevance)
      };
    });
  };

  getLearnerIds = learners => {
    if (!Array.isArray(learners)) learners = [learners];
    return learners.map(learner => {
      return isObject(learner) ? learner.id : learner;
    });
  };

  handleOperations = ({ operation, data, ...rest }) => {
    this.props.manipulateData({
      operation,
      type: this.state.learnerStatusType,
      learnerIds: this.getLearnerIds(data),
      ...rest
    });
  };

  onTabSelect = type => {
    const pagination = this.getPaginationState({ resetPage: true });
    const { sort, filters } = this.state;
    this.props.manipulateData({
      operation: GET_LEARNERS,
      type,
      sort,
      pagination,
      filters: this.prepareFilters(filters)
    });
    this.setState({
      learnerStatusType: type,
      pagination,
      ...this.getResetMultiState
    });
  };

  checkDataLoading = () => {
    const {
      operationStatus: { isLoading, loadingData: { operation } = {} }
    } = this.props;
    if (isUndefined(isLoading)) return;
    if ([SORT_LEARNERS, SEARCH_LEARNERS, GET_LEARNERS, PAGINATE_LEARNERS].includes(operation)) {
      return isLoading;
    }
  };

  handlePagination = pagination => {
    const { learnerStatusType, sort } = this.state;
    this.setState({ pagination, ...this.getResetMultiState });
    this.props.manipulateData({
      operation: PAGINATE_LEARNERS,
      type: learnerStatusType,
      pagination,
      sort
    });
  };

  withConfirmation = ({ operation, callback }) => {
    const { selectedLearners } = this.state;
    const message = (
      <TrackOperationConfirmation operation={operation} selectedCount={selectedLearners.length} />
    );
    showConfirmBox(message, {
      callback: confirmed => {
        confirmed && callback();
      }
    });
  };

  withModuleRelevanceConfirmation = ({ operation, callback }) => {
    const { selectedLearners } = this.state;

    this.moduleRelevanceSelection = undefined;
    const message = (
      <TrackOperationConfirmation
        operation={operation}
        selectedCount={selectedLearners.length}
        feedbackMethod={value => {
          this.moduleRelevanceSelection = value;
        }}
      />
    );
    showConfirmBox(message, {
      callback: confirmed => {
        if (!this.moduleRelevanceSelection) return;
        confirmed && callback(this.moduleRelevanceSelection);
      },
      okBtnText: "Confirm"
    });
  };

  removeLearners = data => {
    const { filters, sort, pagination, learnerStatusType: type } = this.state;
    const operation = REMOVE_LEARNERS;
    const callback = () => {
      this.handleOperations({
        operation: REMOVE_LEARNERS,
        data,
        filters,
        sort,
        pagination,
        type
      });
    };
    this.withConfirmation({ operation, callback });
  };
  resetProgress = data => {
    const operation = RESET_PROGRESS;
    const callback = () => this.handleOperations({ operation, data });
    this.withConfirmation({ operation, callback });
  };

  changeRelevance = data => {
    if (data)
      this.setState({
        learnersForModuleRelevanceChange: data,
        showRelevanceSelectionModal: true
      });
  };

  pageChange = page => {
    const { pagination } = this.state;
    const newState = {
      ...pagination,
      start: (page - 1) * pagination.rows
    };
    this.handlePagination(newState);
  };

  rowSizeChange = rows => {
    const { pagination } = this.state;
    const newState = {
      ...pagination,
      rows
    };
    this.handlePagination(newState);
  };

  getPaginationProps = () => {
    const { learnerStatusType, pagination } = this.state;
    const { learnerCounts } = this.props;

    return {
      current: Math.floor(pagination.start / pagination.rows) + 1,
      total: learnerCounts[learnerStatusType].count,
      rowSize: pagination.rows,
      onChange: this.pageChange,
      onRowSizeChange: this.rowSizeChange
    };
  };

  trackContent = () => {
    const {
      learnerCounts,
      groups,
      searchedLearners,
      learners,
      enabledFeatures: { moduleRelevanceEnabled }
    } = this.props;
    const { multi, selectedLearners } = this.state;
    const tableData = this.createTableData({ searchedLearners, learners });
    const pagination = this.getPaginationProps();
    return (
      <div className={style.wrapperInviteLearnerState}>
        <TrackLearnerSummary
          tabs={this.getSummaryTabs(learnerCounts)}
          onSelect={this.onTabSelect}
        />
        {multi ? (
          <TrackMultiSelectHeader
            selectedLearners={selectedLearners}
            removeLearners={this.removeLearners}
            resetProgress={this.resetProgress}
            changeRelevance={this.changeRelevance}
            selectAll={() => this.toggleSelectionAll(true)}
            unselectAll={() => this.toggleSelectionAll(false)}
            moduleRelevanceEnabled={moduleRelevanceEnabled}
            totalLearners={searchedLearners.length}
          />
        ) : (
          <MultiFilterPanel
            filters={this.getFiltersConfig(groups, moduleRelevanceEnabled)}
            className="trackMultiFilter"
          />
        )}
        {[
          <TrackLearnersTable
            key="learnerTable"
            data={tableData}
            sort={this.state.sort}
            onSort={this.onSort}
            onSelect={this.onSelect}
            onRemove={this.removeLearners}
            onChangeRelevance={this.changeRelevance}
            onResetProgress={this.resetProgress}
            selectionData={this.state.selectedLearners}
            loading={this.checkDataLoading()}
            onViewProfile={data => this.handleOperations({ operation: VIEW_LEARNER_PROFILE, data })}
            moduleRelevanceEnabled={moduleRelevanceEnabled}
          />,
          !!tableData.length && (
            <Pagination
              key="pagination"
              current={pagination.current}
              total={pagination.total}
              rowSize={pagination.rowSize}
              onChange={pagination.onChange}
              onRowSizeChange={pagination.onRowSizeChange}
            />
          )
        ]}
      </div>
    );
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      poll,
      operationStatus: { loadingData: { operation: operationType } = {} },
      operationStatus
    } = this.props;
    const oldPollState = {
      isLoading: poll.isLoading,
      loaded: poll.loaded,
      hasError: poll.hasError
    };
    const newPollState = {
      isLoading: nextProps.poll.isLoading,
      loaded: nextProps.poll.loaded,
      hasError: nextProps.poll.hasError
    };
    const { data: { successIds = [], errorIds = [], operation } = {} } = nextProps.poll;
    if (!deepEqual(oldPollState, newPollState)) {
      if (newPollState.isLoading) {
        InfoToast({
          message: MESSAGES[operationType].LOADING(),
          freeze: true
        });
      } else if (newPollState.hasError) {
        ErrorToast({ message: GET_ERROR_MESSAGES(newPollState.error) });
      } else if (newPollState.loaded) {
        SuccessToast({
          message: MESSAGES[operation].SUCCESS({
            successCount: successIds.length,
            failCount: errorIds.length
          })
        });
        this.setState(this.getResetMultiState);
      }
    }
    if (!deepEqual(operationStatus, nextProps.operationStatus)) {
      const {
        loaded: newLoaded,
        hasError: newHasError,
        data: { operation } = {}
      } = nextProps.operationStatus;
      if (newLoaded && !newHasError && operation == RESET_PROGRESS) {
        this.setState(this.getResetMultiState);
      }
    }
  }

  componentDidMount() {
    const { loaded, getTrackData } = this.props;
    !loaded && getTrackData();
  }

  render() {
    const {
      loaded,
      hasError,
      learnerCounts,
      moduleType,
      companyId,
      seriesId,
      moduleId,
      getTrackData,
      globalPermissions,
      seriesPermissions,
      isSiteOwner,
      defaultModuleRelevance
    } = this.props;
    if (loaded && !hasError) {
      return (
        <div className={style.wrapper} key="inviteTabAllTasks">
          <TrackHeader
            moduleType={moduleType}
            globalPermissions={globalPermissions}
            seriesPermissions={seriesPermissions}
            companyId={companyId}
            moduleId={moduleId}
            seriesId={seriesId}
            isSiteOwner={isSiteOwner}
            onInvite={getTrackData}
            defaultModuleRelevance={defaultModuleRelevance}
          />

          {learnerCounts[LEARNER_TYPES.ALL].count ? (
            this.trackContent()
          ) : (
            <TrackNoInvitedLearners />
          )}

          {this.state.showRelevanceSelectionModal && (
            <RelevanceSelectionPopup
              isModal={true}
              onModalClose={() => {
                this.setState({
                  showRelevanceSelectionModal: false,
                  learnersForModuleRelevanceChange: []
                });
              }}
              select={moduleRelevanceSelection => {
                this.handleOperations({
                  operation: CHANGE_RELEVANCE,
                  data: this.state.learnersForModuleRelevanceChange,
                  moduleRelevanceSelection
                });
              }}
            />
          )}
        </div>
      );
    } else {
      return <Loader />;
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTrackData: () => dispatch(getActions(TRACK_GET_DATA)()),
    manipulateData: data => {
      dispatch(
        getActions(TRACK_MANIPULATE_DATA)(data, {
          loadingData: { operation: data.operation }
        })
      );
    }
  };
};

const mapStateToProps = state => {
  const {
    track: {
      isLoading,
      loaded,
      hasError,
      learners,
      poll,
      searchedLearners: { data: searchedLearners } = {},
      groups: { data: groups } = {},
      counts: learnerCounts = {},
      operationStatus
    },
    details: {
      staticData: { moduleRelevance }
    }
  } = state.checklist;
  return {
    isLoading,
    loaded,
    hasError,
    learners,
    groups,
    searchedLearners,
    learnerCounts,
    operationStatus,
    poll,
    defaultModuleRelevance: moduleRelevance
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withSaga = injectSaga({ name: "checklistTrack", saga: saga });

export default compose(
  withSaga,
  withConnect
)(ChecklistTrack);

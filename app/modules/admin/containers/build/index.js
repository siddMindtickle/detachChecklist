import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Route } from "react-router-dom";

import { getActions, injectSaga } from "@core/helpers";
import { MT_ENTITIES } from "@config/global.config";
import { deepEqual, deepmerge, deepmergeOverwriteArrays } from "@utils";
import { errorToast as ErrorToast } from "@utils/toast";

import Tree from "@components/tree";
import AutoSave from "@components/autoSave";
import Loader from "@components/loader";

import { OPERATIONS, TREE_NODE_DEFAULT, BUILD_MESSAGE as MESSAGES } from "../../config/constants";

import GET_ERROR_MESSAGES from "../../config/error.messages";

import { createTreeData, getActiveLevel } from "../../utils";
import diff from "../../utils/treeDiff";

import TaskDetails from "../../components/taskDetails";
import BuildNoData from "../../components/buildNoData";
import { MANIPULATE_BUILD_DATA, GET_CHECKLIST_BUILD_DATA } from "../../actionTypes";

import saga from "./saga";
import style from "./index.scss";

const { SECTION, TASK } = MT_ENTITIES;
const { ADD, REMOVE, SELECT, EXPAND, COPY, UPDATE, SEARCH, MOVE } = OPERATIONS;

class HandlePreSelection extends Component {
  static propTypes = {
    update: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired
  };
  componentDidMount() {
    this.props.update(this.props.match.params.entityId);
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const newEntityId = newProps.match.params.entityId;
    const oldEntityId = this.props.match.params.entityId;
    if (newEntityId !== oldEntityId) {
      this.props.update(newEntityId);
    }
  }
  render() {
    return null;
  }
}
HandlePreSelection.propTypes = {
  match: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired
};

class ChecklistBuild extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    loaded: PropTypes.bool,
    hasError: PropTypes.bool,
    series: PropTypes.object,
    staticData: PropTypes.object,
    sections: PropTypes.object,
    tasks: PropTypes.object,
    levels: PropTypes.object,
    operationStatus: PropTypes.shape({
      isLoading: PropTypes.bool,
      loaded: PropTypes.bool,
      hasError: PropTypes.bool
    }),
    match: PropTypes.object.isRequired,
    manipulateData: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired,
    updateSavingState: PropTypes.func.isRequired
  };

  static defaultProps = {
    series: {},
    staticData: {},
    sections: {},
    tasks: {},
    levels: {}
  };

  state = {
    node: {
      type: null,
      oldData: {},
      newData: {}
    },
    autoSave: {
      saved: false
    },
    searchString: null,
    selectedEntity: {}
  };

  getSectionVisibility = () => {
    const {
      staticData: { showSections }
    } = this.props;
    return !this.state.searchString && showSections;
  };

  handleNoSection = ({ tasks = [], sections = [] }) => {
    const { levels } = this.props;
    if (!this.getSectionVisibility()) {
      const temp = tasks;
      const sectionId = getActiveLevel(levels).sections[0];
      tasks = sections;
      sections = [...temp];
      tasks = tasks.map(task => {
        task.sectionId = sectionId;
        return task;
      });
    }
    return {
      tasks,
      sections
    };
  };

  onlyOneSelected = ({ tasks = [], sections = [] }) => {
    return [1, 2].includes(sections.length + tasks.length);
  };

  processTreeData = (operation, { oldTreeData, newTreeData, additionalParams }) => {
    const {
      sections: sectionsMap,
      tasks: tasksMap,
      staticData: { scoring: defaultScoring, score: defaultMaxScore }
    } = this.props;
    const skipNoSectionCheck = additionalParams.addNode;

    let { tasks = [], sections = [] } = diff(operation, oldTreeData, newTreeData);

    if (!skipNoSectionCheck) {
      const { tasks: updatedTasks, sections: updatedSection } = this.handleNoSection({
        tasks,
        sections
      });
      tasks = updatedTasks;
      sections = updatedSection;
    }

    const diffIds = {
      tasks: tasks.map(task => task.data.id),
      sections: sections.map(section => section.data.id)
    };
    const response = {
      sections,
      tasks,
      actions: []
    };

    switch (operation) {
      case MOVE: //eslint-disable-line no-case-declarations
        const { sourceParent, destParent } = additionalParams;
        let type;
        if (this.getSectionVisibility()) {
          type = !(sourceParent || destParent) ? SECTION : TASK;
        } else {
          type = TASK;
        }
        response.actions.push({
          operation,
          type,
          ...additionalParams
        });
        break;
      case ADD:
        response.actions = response.actions.concat(
          sections.map(data => deepmerge(data, { operation, type: SECTION }))
        );
        response.actions = response.actions.concat(
          tasks.map(data => {
            const maxScore = defaultScoring ? defaultMaxScore : 0;
            data = deepmerge(data, { data: { maxScore } });
            return deepmerge(data, { operation, type: TASK });
          })
        );
        break;
      case REMOVE:
      case COPY:
        if (diffIds.sections.length) {
          response.actions.push(
            deepmerge(
              { operation, type: SECTION },
              {
                processIds: diffIds.sections
              }
            )
          );
        }
        if (diffIds.tasks.length) {
          response.actions.push(
            deepmerge(
              { operation, type: TASK },
              {
                processIds: diffIds.tasks
              }
            )
          );
        }
        break;
      case SELECT:
      case EXPAND:
        tasks = tasks.reduce((result, newData) => {
          const oldData = tasksMap[newData.data.id] || {};
          result[newData.data.id] = deepmerge(oldData, newData);
          return result;
        }, {});
        sections = sections.reduce((result, newData) => {
          const oldData = sectionsMap[newData.data.id] || {};
          result[newData.data.id] = deepmerge(oldData, newData);
          return result;
        }, {});
        response.actions.push({
          operation,
          tasks,
          sections
        });
        break;
    }
    return response;
  };

  handleTreeOperations = (operation, { oldTreeData, newTreeData, additionalParams = {} }) => {
    const { manipulateData } = this.props;

    const { sections, tasks, actions } = this.processTreeData(operation, {
      oldTreeData,
      newTreeData,
      additionalParams
    });

    switch (operation) {
      case UPDATE: // eslint-disable-line no-case-declarations
        const [type, data] = tasks.length ? [TASK, tasks[0]] : [SECTION, sections[0]];
        if (type == SECTION && !data.data.name) {
          ErrorToast({ message: MESSAGES.EMPTY_SECTION_NAME });
        } else {
          this.updateState({ node: { type, newData: data } });
        }
        break;
      case SELECT:
        if (this.onlyOneSelected({ tasks, sections })) {
          this.autoSaveRef.forceEnqueue();
          this.updateCurrentSelectedState({ tasks, sections });
        }
        break;
      case SEARCH: //eslint-disable-line no-case-declarations
        const searchString = additionalParams.value;
        this.autoSaveRef.forceEnqueue();
        this.updateState({
          searchString
        });
        this.resetSelectedNodeState();
        break;
    }
    actions.forEach(data => data && manipulateData(data));
  };

  getSelected = (tasks, sections) => {
    let type, data;
    tasks.forEach(node => {
      if (node.selected) {
        type = TASK;
        data = node;
      }
    });
    sections.forEach(node => {
      if (node.selected) {
        type = SECTION;
        data = node;
      }
    });
    return [type, data];
  };

  /*  updateState = (newState, merge = true) => {
    merge ? this.setState(deepmerge(this.state, newState)) : this.setState(newState);
  };

  updateDetails = (type, data) => {
    data = deepmerge(this.state.node.newData, { data });
    this.updateState({ node: { type, newData: data } });
  };*/

  updateState = (newState, merge = true) => {
    const testMerge = deepmergeOverwriteArrays(this.state, newState);
    merge ? this.setState(testMerge) : this.setState(newState);
  };

  updateDetails = (type, data) => {
    data = deepmergeOverwriteArrays(this.state.node.newData, { data });
    this.updateState({ node: { type, newData: data } });
  };

  enqueue = () => {
    const {
      node: { type, oldData, newData }
    } = this.state;
    const operation = UPDATE;
    if (deepEqual(oldData, newData) || !type) return;
    this.props.updateSavingState(true);
    this.updateState({ node: { oldData: newData } });
    return deepmerge.all([newData, { operation, type }]);
  };

  resetSelectedNodeState = () => {
    this.updateState({
      node: {
        type: null,
        oldData: {},
        newData: {}
      }
    });
  };

  updateCurrentSelectedState = ({ tasks = [], sections = [] }) => {
    const [type, data] = this.getSelected(tasks, sections);
    data &&
      this.updateState(
        {
          node: {
            type,
            oldData: data,
            newData: data
          }
        },
        false
      );
  };

  setSelectedEntity = (id, newEntity = false) => {
    this.updateState({ selectedEntity: { id, isNew: newEntity } });
  };

  componentDidMount() {
    const { getData, loaded } = this.props;
    !loaded && getData();
  }

  UNSAFE_componentWillReceiveProps(nextprops) {
    const {
      operationStatus: { loaded: oldLoaded, isLoading: oldIsLoading, hasError: oldHasError } = {}
    } = this.props;
    const {
      operationStatus: {
        loaded,
        isLoading,
        hasError,
        error = {},
        data: { operation, response: operationResult } = {}
      } = {}
    } = nextprops;
    if (oldLoaded !== loaded && loaded && !hasError) {
      switch (operation) {
        case UPDATE:
          this.updateState({
            autoSave: { saved: true }
          });
          break;
        case REMOVE:
          this.resetSelectedNodeState();
          break;
        case ADD:
          operationResult && this.setSelectedEntity(operationResult, true);
          break;
      }
    } else if (oldIsLoading !== isLoading && isLoading) {
      switch (operation) {
        case UPDATE:
          this.updateState({ autoSave: { saved: false } });
          break;
      }
    } else if (oldHasError !== hasError && hasError) {
      error.operation !== UPDATE && ErrorToast({ message: GET_ERROR_MESSAGES(error) });
    }
  }

  render() {
    const {
      node: { type, newData },
      autoSave: { saved },
      searchString,
      selectedEntity
    } = this.state;
    const {
      sections,
      levels,
      tasks,
      loaded,
      hasError,
      match,
      manipulateData,
      updateSavingState
    } = this.props;
    if (loaded && !hasError) {
      const showSections = this.getSectionVisibility();
      const treeData = createTreeData({
        levels,
        sections,
        tasks,
        showSections,
        searchString,
        selectedNode: newData && newData.data
      });
      return [
        //todo: autosave???
        <AutoSave
          key="autoSave"
          processor={manipulateData}
          enqueue={this.enqueue}
          saved={saved}
          onComplete={() => updateSavingState(false)}
          ref={el => (this.autoSaveRef = el)}
        />,
        loaded && (
          //todo: ???
          <Route
            key="subPath"
            path={`${match.url}/:entityId`}
            render={props => <HandlePreSelection {...props} update={this.setSelectedEntity} />}
          />
        ),
        <div
          key="contentpart"
          className={classnames(!treeData.length && style.noData, style.wrapper, "clearfix")}
        >
          <div key="leftSection" className={style.leftSection}>
            <Tree
              treeData={treeData}
              updateTree={this.handleTreeOperations}
              operationMap={OPERATIONS}
              levelConfig={TREE_NODE_DEFAULT}
              onlyLeaf={!showSections}
              searched={!!searchString}
              scrollTo={selectedEntity}
            />
          </div>
          {!treeData.length && !searchString ? (
            <BuildNoData />
          ) : type ? (
            <TaskDetails
              key="rightSection"
              type={type}
              node={newData}
              update={this.updateDetails}
            />
          ) : null}
        </div>
      ];
    }
    return <Loader />;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    manipulateData: data => {
      dispatch(getActions(MANIPULATE_BUILD_DATA)(data));
    },
    getData: () => dispatch(getActions(GET_CHECKLIST_BUILD_DATA)())
  };
};

const mapStateToProps = (state, ownProps) => {
  const {
    build: { tasks = {}, sections = {}, levels = {}, isLoading, loaded, hasError, operationStatus },
    details: { series = {}, staticData = {} }
  } = state.checklist;
  const { updateSavingState } = ownProps;
  return {
    staticData,
    sections,
    tasks,
    levels,
    series,
    isLoading,
    loaded,
    hasError,
    operationStatus,
    updateSavingState
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withSaga = injectSaga({ name: "checklistBuild", saga: saga });

export default compose(
  withSaga,
  withConnect
)(ChecklistBuild);

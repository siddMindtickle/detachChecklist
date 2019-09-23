import React, { Component } from "react";
import PropTypes from "prop-types";
import { Layout, Row, Col, Tooltip } from "antd";
import classnames from "classnames";

import { deepmerge } from "@utils";
import { OVERVIEW_ID } from "@config/env.config";
import Tree from "@components/tree_learner";

import { createSidebarData, getNextPrevTaskId, getUncompletedTaskId } from "../../utils";
import { NODE_TYPE, MESSAGES } from "../../config/constants";

import Wrapper from "../../components/uiElement/wrapper";
import ChecklistHeader from "../../components/checklistHeader";
import NodeDetails from "../../components/nodeDetails";

import st from "./index.scss";

// import ModalPopUP from "../mainView/modalPopUp";

const { Content } = Layout;
const noop = () => undefined;
export default class ChecklistWrapper extends Component {
  static propTypes = {
    handleOperation: PropTypes.func,
    gotoSeries: PropTypes.func.isRequired,
    moduleState: PropTypes.object.isRequired,
    moduleData: PropTypes.object.isRequired,
    seriesData: PropTypes.object.isRequired,
    sections: PropTypes.object.isRequired,
    levels: PropTypes.object.isRequired,
    tasks: PropTypes.object.isRequired,
    loadingTask: PropTypes.bool.isRequired,
    updatingTask: PropTypes.bool.isRequired,
    withLocalData: PropTypes.bool,
    selectedId: PropTypes.string,
    operations: PropTypes.shape({
      START: PropTypes.string, // TODO: should this be isRequired?
      SELECT: PropTypes.string.isRequired,
      COMPLETE: PropTypes.string.isRequired
    }),
    header: PropTypes.node
  };

  static defaultProps = {
    withLocalData: false,
    handleOperation: noop,
    selectedId: OVERVIEW_ID,
    operations: {},
    node: ""
  };

  state = {
    searchString: "",
    selectedId: this.props.selectedId
  };

  selectLocal = (selectedId, props = this.props) => {
    const newState = deepmerge(this.state, {
      selectedId,
      mobileNodeSelected: true
    });
    this.customProps = this.createCustomProps(newState, props);
    this.setState(newState);
  };

  onSearch = value => {
    const newState = deepmerge(this.state, { searchString: value });
    this.customProps = this.createCustomProps(newState);
    this.setState(newState);
  };

  handleMobileHeaderBackBtn = () => {
    this.setState({ mobileNodeSelected: false });
  };

  onSelect = selectedId => {
    const {
      withLocalData,
      handleOperation,
      operations: { SELECT }
    } = this.props;
    withLocalData || selectedId == OVERVIEW_ID
      ? this.selectLocal(selectedId)
      : handleOperation({ operation: SELECT, taskId: selectedId });
  };

  resume = () => {
    const { sections, tasks, levels } = this.props;
    const taskId = getUncompletedTaskId({ sections, tasks, levels });
    this.onSelect(taskId);
  };

  start = () => {
    const {
      handleOperation,
      operations: { START }
    } = this.props;
    handleOperation({ operation: START });
  };

  toggleComplete = completed => {
    const {
      handleOperation,
      operations: { COMPLETE }
    } = this.props;
    const { selectedId } = this.state;
    handleOperation({ operation: COMPLETE, taskId: selectedId, completed });
  };

  createCustomProps = (state, props = this.props) => {
    const { moduleState, moduleData, sections, tasks, levels, loadingTask, updatingTask } = props;
    const {
      dueDate,
      maxScore,
      cutoffScore,
      certificate,
      description,
      showSections,
      isSequentiallyLocked
    } = moduleData;
    const { score, frozen, isStarted, totalTasks, isCompleted, completedTasks } = moduleState;

    const { searchString, selectedId } = state;

    const selectedType = selectedId == OVERVIEW_ID ? NODE_TYPE.OVERVIEW : NODE_TYPE.TASK;

    const customProps = {
      sidebar: {
        data: createSidebarData({
          tasks,
          levels,
          frozen,
          sections,
          isStarted,
          isCompleted,
          description,
          showSections,
          searchString,
          isSequentiallyLocked
        }),
        selectedId,
        onSelect: this.onSelect,
        lockedMessage: MESSAGES.TOOLTIPS.LOCKED_TASK
      },
      details: {
        type: selectedType,
        isSequentiallyLocked,
        actions: {
          start: this.start,
          resume: this.resume,
          move: this.onSelect,
          toggleComplete: this.toggleComplete,
          gotoSeries: this.props.gotoSeries
        },
        loadingTask,
        node:
          selectedType == NODE_TYPE.OVERVIEW
            ? {
                frozen,
                maxScore,
                isStarted,
                totalTasks,
                isCompleted,
                certificate,
                description,
                cutoffScore
              }
            : {
                ...tasks[selectedId],
                ...getNextPrevTaskId({
                  taskId: selectedId,
                  sections,
                  tasks,
                  levels
                }),
                frozen,
                updatingTask
              }
      },
      header: {
        score,
        dueDate,
        totalTasks,
        completedTasks,
        totalScore: maxScore,
        onSearch: this.onSearch
      }
    };
    return customProps;
  };

  customProps = this.createCustomProps(this.state);

  componentWillReceiveProps(nextProps) {
    const { loadingTask, updatingTask, selectedId } = nextProps;
    const {
      loadingTask: oldLoadingTask,
      updatingTask: oldUpdatingTask,
      selectedId: oldSelectedId
    } = this.props;
    if (
      oldLoadingTask !== loadingTask ||
      updatingTask !== oldUpdatingTask ||
      selectedId !== oldSelectedId
    ) {
      this.selectLocal(selectedId, nextProps);
    }
  }
  render() {
    const { header, moduleState: { frozen } = {} } = this.props;
    const treeToShow = frozen ? (
      <Tooltip title={MESSAGES.TOOLTIPS.FROZEN_TASK} placement="rightBottom">
        <Tree className={classnames(st.extraMarginBottom)} {...this.customProps.sidebar} />
        <div
          className="pos_rel"
          style={{
            width: "100%",
            height: "100%",
            top: 0,
            right: 0
          }}
        />
      </Tooltip>
    ) : (
      [
        <Tree
          key="taskTree"
          className={classnames(st.extraMarginBottom)}
          {...this.customProps.sidebar}
        />,
        <div
          key="taskTdree"
          className="pos_rel"
          style={{
            width: "100%",
            height: "100%",
            top: 0,
            right: 0
          }}
        />
      ]
    );

    return (
      <Wrapper>
        <Layout className={st.checkList}>
          {header}
          <Layout
            className={classnames({
              [st.mobile_show_right]: this.state.mobileNodeSelected
            })}
          >
            <Content>
              <Layout>
                <ChecklistHeader
                  {...this.customProps.header}
                  nodeSelected={this.state.mobileNodeSelected}
                  onMobileBackBtn={this.handleMobileHeaderBackBtn}
                />
                <Content>
                  <Layout>
                    <Row style={{ width: "100%" }}>
                      <Col xs={24} sm={24} md={10} lg={10} xl={8} xxl={6}>
                        <div
                          className={classnames(
                            st.checkListContainerHeight,
                            st.bg_ff,
                            "borderR_dd"
                          )}
                        >
                          {treeToShow}
                        </div>
                      </Col>
                      <Col
                        className={classnames(st.mobileChecklistDetail, {
                          [st.mobile_show_right]: this.state.mobileNodeSelected
                        })}
                        xs={24}
                        sm={24}
                        md={14}
                        lg={14}
                        xl={16}
                        xxl={18}
                      >
                        <div
                          className={classnames(st.checkListContainerHeight)}
                          style={{ background: "#f7f7f7" }}
                        >
                          <NodeDetails
                            className={classnames(st.extraMarginBottom)}
                            {...this.customProps.details}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Layout>
                </Content>
              </Layout>
            </Content>
          </Layout>
        </Layout>
      </Wrapper>
    );
  }
}

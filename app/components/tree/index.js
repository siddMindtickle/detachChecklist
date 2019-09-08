import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import SortableTree, { getNodeAtPath } from "react-sortable-tree";

import { deepEqual } from "@utils";
import { showConfirmBox } from "@utils/alert";

import Header from "./components/header";
import MultiSelectHeader from "./components/multiSelectHeader";
import NodeDisplayView from "./components/nodeDisplayView";
import NodeEditView from "./components/nodeEditView";
import NodeActions from "./components/nodeActions";
import DeleteConfirmation from "./components/deleteConfirmation";

import {
  SUPPORTED_OPERATIONS as DEFAULT_SUPPORTED_OPERATIONS,
  DEFAULTS,
  IGNORE_COLLAPSED
} from "./constants";

import { select, unselectAll, getNodeKey, getImmediateParent, canDrop } from "./helper";

import style from "./index.scss";

export default class Tree extends Component {
  static propTypes = {
    treeData: PropTypes.array.isRequired,
    updateTree: PropTypes.func.isRequired,
    operationMap: PropTypes.shape({
      ADD: PropTypes.string,
      REMOVE: PropTypes.string,
      SELECT: PropTypes.string,
      EXPAND: PropTypes.string,
      UPDATE: PropTypes.string,
      MOVE: PropTypes.string,
      SEARCH: PropTypes.string
    }),
    scrollTo: PropTypes.object,
    searched: PropTypes.bool,
    levelConfig: PropTypes.object.isRequired,
    onlyLeaf: PropTypes.bool
  };

  static defaultProps = {
    operationMap: {},
    onlyLeaf: false
  };

  state = {
    multiSelect: false,
    editable: false,
    treeData: this.props.treeData
  };

  operations = { ...DEFAULT_SUPPORTED_OPERATIONS, ...this.props.operationMap };

  taskRefs = {};

  toggleMultiSelect = (multiSelect = false) => this.setState({ multiSelect });

  toggleEdit = (node, edit) => {
    if (this.state.multiSelect) return;
    this.setState({
      editable: edit && node.data.id
    });
  };

  confirmDeletion = ({ level, callback, selectedCount }) => {
    const { levelConfig } = this.props;
    const message = (
      <DeleteConfirmation level={level} levelConfig={levelConfig} selectedCount={selectedCount} />
    );
    showConfirmBox(message, {
      callback
    });
  };

  handleNodeClick = ({ treeData, path }) => {
    const { SELECT } = this.operations;
    const oldTreeData = treeData;

    if (this.state.multiSelect) return;

    treeData = unselectAll({ treeData });
    const { node: updatedNode } = getNodeAtPath({
      treeData,
      path,
      getNodeKey,
      ignoreCollapsed: IGNORE_COLLAPSED
    });
    treeData = select({
      treeData,
      node: updatedNode,
      path
    }).treeData;

    this.update(SELECT, oldTreeData, treeData);
  };

  update = (operation, oldTreeData, newTreeData, extra = {}) => {
    this.props.updateTree(operation, {
      oldTreeData,
      newTreeData,
      additionalParams: extra
    });
  };

  handleMove = ({ treeData, node, nextParentNode, nextPath, nextTreeIndex }) => {
    const oldTreeData = this.props.treeData;
    const prevParentNode = getImmediateParent({
      treeData: oldTreeData,
      node
    });
    if (nextParentNode) {
      this.update(this.operations.MOVE, oldTreeData, treeData, {
        sourceParent: prevParentNode,
        destParent: nextParentNode,
        node,
        index: nextTreeIndex - nextPath[nextPath.length - 2] - 1
      });
    } else {
      const index = treeData.findIndex(rootNode => node.data.id == rootNode.data.id);
      this.update(this.operations.MOVE, oldTreeData, treeData, {
        node,
        index
      });
    }
    this.setState({ treeData });
  };

  getNodeClasses = ({ node, level, editable }) => {
    return classnames({
      level: true,
      leaf: node.leaf,
      [`level-${level}`]: true,
      selected: node.selected,
      rst__rowTitleFull: editable
    });
  };

  getPlaceholder = ({ node, level }) => {
    const { levelConfig } = this.props;

    return (
      (node.leaf && levelConfig["leaf"].placeholder) ||
      (levelConfig[level] && levelConfig[level].placeholder) ||
      DEFAULTS.placeholder
    );
  };

  canDrag = ({ node }) => {
    const { multiSelect } = this.state;
    return multiSelect ? false : node.canDrag || true;
  };

  generateNodeProps = ({ treeData, node, path, treeIndex }) => {
    const { editable, multiSelect } = this.state;
    const level = path.length - 1;

    const placeholderValue = this.getPlaceholder({ node, level });

    const details = {
      node,
      path,
      treeIndex,
      editable,
      multiSelect,
      level,
      placeholderValue
    };
    const childProps = {
      treeData: treeData,
      nodeDetails: details,
      update: this.update,
      toggleEditMode: this.toggleEdit,
      operations: this.operations
    };
    const className = this.getNodeClasses(details);
    const onClick = () => this.handleNodeClick({ treeData, ...details });
    return {
      className: className,
      canDrag: this.canDrag({ node }),
      onClick,
      title: (
        <div ref={el => (this.taskRefs[node.data.id] = { el, select: onClick, node })}>
          {editable == node.data.id ? (
            <NodeEditView {...childProps} />
          ) : (
            <NodeDisplayView {...childProps} />
          )}
        </div>
      ),
      buttons: [
        <NodeActions
          key="buttons"
          {...childProps}
          toggleMultiSelect={this.toggleMultiSelect}
          confirmDeletion={this.confirmDeletion}
        />
      ]
    };
  };

  autoScroll = () => {
    const {
      scrollTo: { id, isNew }
    } = this.props;
    const taskRef = this.taskRefs[id];
    if (taskRef) {
      taskRef.el.scrollIntoView({
        behavior: "smooth"
      });
      isNew && this.toggleEdit(taskRef.node, true);
      taskRef.select();
    }
  };

  componentWillReceiveProps(nextProps) {
    const { treeData } = this.state;
    if (!deepEqual(treeData, nextProps.treeData)) {
      this.setState({
        treeData: nextProps.treeData
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!deepEqual(prevProps.scrollTo, this.props.scrollTo)) {
      this.autoScroll();
    }
    if (!deepEqual(prevState.treeData, this.state.treeData)) {
      !this.state.treeData.length && this.setState({ multiSelect: false });
    }
  }

  componentDidMount() {
    this.autoScroll();
  }

  render() {
    let { onlyLeaf, levelConfig, searched } = this.props;
    let { multiSelect, treeData } = this.state;
    return [
      <div className={classnames(multiSelect ? "rst_fade" : "displayN")} key="fade" />,
      <div
        key="checklist"
        className={classnames(style.checklistArea, !treeData.length && "noData")}
      >
        <div key="header">
          {multiSelect ? (
            <MultiSelectHeader
              treeData={treeData}
              operations={this.operations}
              update={this.update}
              toggleMultiSelect={this.toggleMultiSelect}
              confirmDeletion={this.confirmDeletion}
              levelConfig={levelConfig}
              onlyLeaf={onlyLeaf}
            />
          ) : (
            <Header
              treeData={treeData}
              operations={this.operations}
              update={this.update}
              levelConfig={levelConfig}
              onlyLeaf={onlyLeaf}
            />
          )}
        </div>
        <div key="tree" className="treeCustomStyle">
          {treeData.length ? (
            <SortableTree
              className={classnames(multiSelect ? "multiSelect" : "")}
              treeData={treeData}
              onChange={() => null}
              rowHeight={42}
              maxDepth={2}
              canDrop={canDrop}
              isVirtualized={false}
              onMoveNode={this.handleMove}
              scaffoldBlockPxWidth={10}
              generateNodeProps={({ node, path, treeIndex }) =>
                this.generateNodeProps({
                  treeData,
                  node,
                  path,
                  treeIndex
                })
              }
            />
          ) : searched ? (
            <div className="tree_noResultFound">
              <div className="tree_noResultText"> No Results Found</div>
              <div className="tree_noResultSubText"> Try Searching for diffferent key word</div>
            </div>
          ) : null}
        </div>
      </div>
    ];
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Checkbox from "@components/checkbox";
import Dropdown from "@components/dropdown";

import { ENTITY_OPERATIONS } from "../constants";

import {
  remove,
  duplicate,
  toggleSelection,
  toggleChildren,
  unselectAll,
  getSelected,
  isCrossParentSelection,
  getImmediateParent
} from "../helper";

import "../index.scss";

export default class NodeEditView extends Component {
  static propTypes = {
    treeData: PropTypes.array.isRequired,
    operations: PropTypes.object.isRequired,
    nodeDetails: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    toggleMultiSelect: PropTypes.func.isRequired,
    toggleEditMode: PropTypes.func.isRequired,
    confirmDeletion: PropTypes.func.isRequired
  };

  handleParentSelection = ({ treeData, node, path }) => {
    const parentNode = getImmediateParent({ treeData, node });
    const selectedChildren =
      getSelected({
        treeData: parentNode.children
      }) || [];
    const selectParent = selectedChildren.length == parentNode.children.length;
    if (parentNode && parentNode.selected != selectParent) {
      treeData = toggleSelection({
        treeData,
        node: parentNode,
        path: path.slice(0, -1),
        selected: selectParent
      }).treeData;
    }
    return treeData;
  };

  handleCheckbox = ({ treeData, node: currentNode, path: currentPath }) => {
    const {
      operations: { SELECT },
      nodeDetails: { multiSelect },
      toggleMultiSelect
    } = this.props;
    const oldTreeData = treeData;

    if (!multiSelect) {
      toggleMultiSelect(true);
      if (currentNode.selected) return;
    }

    const isCross = isCrossParentSelection({
      treeData,
      node: currentNode,
      path: currentPath
    });

    if (isCross) {
      treeData = unselectAll({ treeData });
    }

    if (currentNode.children && currentNode.children.length) {
      treeData = toggleChildren({
        treeData,
        callback: ({ node, path }) =>
          toggleSelection({
            treeData,
            node,
            path,
            selected: !currentNode.selected,
            ignoreCollapsed: false
          }).node,
        contextNode: currentNode,
        ignoreCollapsed: false
      });
    } else {
      treeData = toggleSelection({
        treeData,
        node: currentNode,
        path: currentPath
      }).treeData;
      // treeData = this.handleParentSelection({
      //   treeData,
      //   path: currentPath,
      //   node: currentNode
      // });
    }
    this.props.update(SELECT, oldTreeData, treeData);
  };

  handleDropdownOptions = ({ treeData, operation, path, node, treeIndex }) => {
    const { REMOVE, COPY, RENAME } = this.props.operations;
    const oldTreeData = treeData;
    switch (operation) {
      case REMOVE:
        treeData = remove({
          treeData,
          path,
          node
        }).treeData;
        break;
      case COPY:
        treeData = duplicate({
          treeData,
          node,
          path,
          treeIndex
        });
        break;
      case RENAME:
        this.props.toggleEditMode(node, true);
        break;
    }
    operation == REMOVE
      ? this.props.confirmDeletion({
          level: node.leaf ? "leaf" : path.length - 1,
          callback: confirmed => {
            confirmed && this.props.update(operation, oldTreeData, treeData);
          }
        })
      : this.props.update(operation, oldTreeData, treeData);
  };

  render() {
    const {
      treeData,
      nodeDetails: { node, path, treeIndex, editable, multiSelect }
    } = this.props;
    return editable ? null : (
      <div key="actionButtons">
        <Checkbox
          onClick={event => {
            event.stopPropagation();
            this.handleCheckbox({
              treeData,
              node,
              path
            });
          }}
          checked={multiSelect && !!node.selected}
          className={classnames("floatR", "checkBoxStyle")}
        />
        {!multiSelect && (
          <Dropdown
            options={ENTITY_OPERATIONS}
            id={`tree_${treeIndex}_dropdown`}
            customIcon="more_horizontal"
            onSelect={operation => {
              this.handleDropdownOptions({
                treeData,
                operation,
                path,
                node,
                treeIndex
              });
            }}
            className={classnames("horizontalDropdownStyle floatL")}
          />
        )}
      </div>
    );
  }
}

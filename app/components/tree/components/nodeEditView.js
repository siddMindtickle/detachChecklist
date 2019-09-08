import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Input from "@components/input";

import { setTitle } from "../helper";

import style from "../index.scss";

export default class NodeEditView extends Component {
  static propTypes = {
    treeData: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired,
    operations: PropTypes.object.isRequired,
    nodeDetails: PropTypes.object.isRequired,
    toggleEditMode: PropTypes.func.isRequired
  };

  handleInputChange = ({ treeData, value, node, path }) => {
    const {
      operations: { UPDATE },
      update
    } = this.props;
    const oldTreeData = treeData;
    treeData = setTitle({
      treeData,
      value,
      node,
      path
    }).treeData;
    update(UPDATE, oldTreeData, treeData);
  };

  onBlur = event => {
    const {
      nodeDetails: { node, path },
      treeData,
      toggleEditMode
    } = this.props;

    toggleEditMode(node, false);
    const value = event.target.value;
    this.handleInputChange({
      treeData,
      value,
      node,
      path
    });
  };

  onFocus = event => {
    event.target.select();
  };

  render() {
    const {
      nodeDetails: { treeIndex, placeholderValue, node }
    } = this.props;
    return (
      <Input
        className={classnames(style.inputStyle, style.customTreeInputPadding)}
        maxLengthClassName="displayN"
        maxLength={100}
        name={`tree-node-${treeIndex}`}
        placeholder={placeholderValue}
        onClick={event => event.stopPropagation()}
        value={node.data.name}
        autoFocus={true}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onKeyPress={event => {
          if (event.charCode == 13 && !event.shiftKey) {
            this.onBlur(event);
          }
        }}
      />
    );
  }
}

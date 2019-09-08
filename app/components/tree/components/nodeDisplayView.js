import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { toggleExpand } from "../helper";
import style from "../index.scss";

export default class NodeEditView extends Component {
  static propTypes = {
    treeData: PropTypes.array.isRequired,
    operations: PropTypes.object.isRequired,
    nodeDetails: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    toggleEditMode: PropTypes.func.isRequired
  };

  onDoubleClick = ({ node }) => {
    event.preventDefault();
    this.props.toggleEditMode(node, true);
  };

  expandNode = ({ treeData, node, path }) => {
    const { EXPAND } = this.props.operations;
    const oldTreeData = treeData;

    treeData = toggleExpand({
      treeData,
      node,
      path
    }).treeData;
    this.props.update(EXPAND, oldTreeData, treeData);
  };

  render() {
    const {
      nodeDetails: { node, path, placeholderValue },
      treeData
    } = this.props;
    return [
      !node.leaf && (
        <div
          key="rst_collapseBtn"
          className={classnames({
            rst_collapseBtn: true,
            active: node.expanded
          })}
          onClick={event => {
            event.stopPropagation();
            this.expandNode({ treeData, node, path });
          }}
        />
      ),
      <label
        key={`label-${node.treeIndex}`}
        className={node.data.name ? "" : "defaultColorPlaceholder"}
        onDoubleClick={event => {
          event.preventDefault();
          this.onDoubleClick({ node });
        }}
      >
        <div className={classnames(style.rst__indexStyle, node.leaf ? "marginL30" : "marginL5")}>
          {node.orderIndex ? `${node.orderIndex}.` : ""}
        </div>
        <div className={style.rst__textPlaceholderStyle}>{node.data.name || placeholderValue}</div>
      </label>
    ];
  }
}

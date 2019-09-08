import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Icon from "@components/icon";

import {
  selectAll,
  unselectAll,
  getSelectedCountByLevel,
  removeSelected,
  checkAllSelected,
  duplicateSelected
} from "../helper";

import style from "../index.scss";

export default class MultiSelectHeader extends Component {
  static propTypes = {
    treeData: PropTypes.array.isRequired,
    operations: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    toggleMultiSelect: PropTypes.func.isRequired,
    confirmDeletion: PropTypes.func.isRequired,
    levelConfig: PropTypes.object.isRequired,
    onlyLeaf: PropTypes.bool.isRequired
  };

  getSelectedCount = () => {
    const { treeData, onlyLeaf } = this.props;

    const selectedCounts = getSelectedCountByLevel({
      treeData
    });
    let level = selectedCounts.findIndex(val => !!val);
    let count = selectedCounts[level];

    level = level > 0 && level == selectedCounts.length - 1 ? "leaf" : level;
    level = onlyLeaf ? "leaf" : level;

    return { count, level };
  };
  getSelectedText = () => {
    const { levelConfig, toggleMultiSelect } = this.props;
    const { count, level } = this.getSelectedCount();
    if (level == -1 || !count) {
      setTimeout(() => toggleMultiSelect(false));
      return `0 Selected`;
    }

    return `${count} ${levelConfig[level].displayName}${count > 1 ? "s" : ""}  Selected`;
  };
  handleBulk = ({ treeData, operation, selected } = {}) => {
    const { COPY, REMOVE, SELECT } = this.props.operations;
    let newTreeData = treeData;
    switch (operation) {
      case REMOVE:
        newTreeData = removeSelected({
          treeData
        });
        break;
      case COPY:
        newTreeData = duplicateSelected({
          treeData
        });
        break;
      case SELECT:
        newTreeData = selected
          ? unselectAll({
              treeData
            })
          : selectAll({ treeData });
        break;
    }
    this.props.update(operation, treeData, newTreeData);
  };
  render() {
    const {
      operations: { COPY, REMOVE, SELECT },
      treeData
    } = this.props;
    const allSelected = checkAllSelected({
      treeData
    });
    return [
      <div className={classnames("clearfix", style.actionBar)} key="actionBar">
        <div className={style.actionBarSectionLeft}>
          <span className={style.selectedText}>{this.getSelectedText()}</span>
          <span className={style.selectedDivider}>|</span>

          <span
            className={classnames("link", style.selectAllLink)}
            key="selectAll"
            onClick={() =>
              this.handleBulk({
                treeData,
                operation: SELECT,
                selected: allSelected
              })
            }
          >
            {allSelected ? "Unselect All" : "Select All"}
          </span>
        </div>

        <div className={style.actionBarSectionMiddle}>
          <span
            className={style.duplicateIcon}
            key="duplicate"
            onClick={() => this.handleBulk({ treeData, operation: COPY })}
          >
            <Icon type="duplicate" className={style.iconCommonStyle} />
          </span>
          <span className={classnames(style.moveIcon, "displayN")} key="move">
            <Icon type="move" className={style.iconCommonStyle} />
          </span>
          <span
            key="delete"
            className={classnames(style.removeIcon)}
            onClick={() => {
              const { count, level } = this.getSelectedCount();
              this.props.confirmDeletion({
                level,
                selectedCount: count,
                callback: confirmed => {
                  confirmed && this.handleBulk({ treeData, operation: REMOVE });
                }
              });
            }}
          >
            <Icon type="delete" className={style.iconCommonStyle} />
          </span>
        </div>

        <div className={style.actionBarSectionRight}>
          <span
            className={style.cnclText}
            key="cancel"
            onClick={() => {
              this.handleBulk({
                treeData,
                operation: SELECT,
                selected: true
              });
              this.props.toggleMultiSelect(false);
            }}
          >
            Cancel
          </span>
        </div>
      </div>
    ];
  }
}

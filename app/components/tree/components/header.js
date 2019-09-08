import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Button from "@components/button";
import Search from "@components/search";

import { debounce } from "@utils";

import { TIMINGS } from "../constants";

import { addLeaf, addNode } from "../helper";

import style from "../index.scss";

export default class Header extends Component {
  static propTypes = {
    treeData: PropTypes.array.isRequired,
    operations: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    levelConfig: PropTypes.object.isRequired,
    onlyLeaf: PropTypes.bool.isRequired
  };

  state = {
    search: false
  };

  search = debounce(({ treeData, value }) => {
    const { SEARCH } = this.props.operations;
    this.props.update(SEARCH, treeData, treeData, {
      value
    });
  }, TIMINGS.SEARCH);

  onSearchToggle = active => {
    this.setState({ search: active });
  };

  handleAddTask = ({ treeData }) => {
    let { onlyLeaf } = this.props;
    const { ADD } = this.props.operations;
    const add = onlyLeaf ? addNode : addLeaf;
    const newTreeData = add({
      treeData
    });
    this.props.update(ADD, treeData, newTreeData);
  };

  handleAddSection = ({ treeData }) => {
    const { levelConfig } = this.props;
    const { ADD } = this.props.operations;

    const newTreeData = addNode({
      treeData,
      defaultValue: levelConfig[0].defaultValue
    });
    this.props.update(ADD, treeData, newTreeData, { addNode: true });
  };
  render() {
    const { treeData } = this.props;
    const { search } = this.state;
    return [
      <div className={classnames("clearfix", style.actionBar)} key="actionBar">
        {!search && (
          <div className={style.actionBarSectionLeft}>
            <Button key="addtask" type="PrimarySm" onClick={() => this.handleAddTask({ treeData })}>
              + Add Task
            </Button>
            <Button
              key="addsection"
              type="DefaultSm"
              className="marginL10"
              onClick={() => this.handleAddSection({ treeData })}
            >
              + Add Section
            </Button>
          </div>
        )}
        <div className={style.buttonSearchRight}>
          {(!!treeData.length || search) && (
            <Search
              onChange={value => this.search({ treeData, value })}
              onToggle={this.onSearchToggle}
            />
          )}
        </div>
      </div>
    ];
  }
}

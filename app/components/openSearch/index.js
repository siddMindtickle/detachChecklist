import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Icon from "@components/icon";
import Input from "@components/input";

import "./index.scss";

export default class OpenSearch extends Component {
  static propTypes = {
    close: PropTypes.bool,
    onSearch: PropTypes.func.isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string
  };

  static defaultProps = {
    close: true,
    placeholder: "Search"
  };

  state = {
    searchedValue: ""
  };

  onChange = event => {
    const value = event.target.value;
    if (value !== this.state.searchedValue) {
      this.setState({ searchedValue: value });
      this.props.onSearch(value);
    }
  };

  clearSearch = () => {
    this.setState({ searchedValue: "" });
    this.props.onSearch("");
  };

  render() {
    const { close, onSearch, ...rest } = this.props; //eslint-disable-line
    const { searchedValue } = this.state;
    return (
      <div className={classnames("openSearch", this.props.className)}>
        <Icon type="search" className={classnames("marginR10", "search-icon")} />
        <Input
          key={"searchInputlearnerNotSelected"}
          {...rest}
          onChange={this.onChange}
          placeholder={this.props.placeholder}
          name="search"
          type="text"
          value={searchedValue}
          className="openSearch-input"
        />
        {close &&
          searchedValue && (
            <Icon
              type="close"
              className={classnames("marginR10", "close-icon")}
              onClick={this.clearSearch}
            />
          )}
      </div>
    );
  }
}

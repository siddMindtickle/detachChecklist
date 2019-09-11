import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "@components/icon";
import "./index.scss";
import classnames from "classnames";
import Input from "@components/input";

// import classnames from "classnames";

class Search extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired
  };
  state = {
    open: false,
    searchText: ""
  };
  toggleActive = active => {
    const newState = {
      open: active,
      searchText: active ? this.state.searchText : ""
    };
    this.setState(newState);
    this.props.onToggle(active);
    !active && this.props.onChange(newState.searchText);
  };
  onChange = event => {
    const searchValue = event.target.value;
    this.setState({
      searchText: searchValue
    });
    this.props.onChange(searchValue);
  };

  render() {
    const { open, searchText } = this.state;
    return (
      <div
        className={classnames("displayIB", "search-wrapper")}
        onClick={() => this.toggleActive(true)}
      >
        <Input
          type="text"
          name="search"
          placeholder="Search Tasks..."
          value={searchText}
          onChange={this.onChange}
          className={classnames("search-icon", open ? "active" : null)}
        />
        {open && (
          <Icon
            type="close"
            className="search-close"
            onClick={event => {
              event.stopPropagation();
              this.toggleActive(false);
            }}
          />
        )}
      </div>
    );
  }
}
export default Search;

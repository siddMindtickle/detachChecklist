import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Dropdown from "@components/dropdown";
import OpenSearch from "@components/openSearch";
import ProfileFieldSelector from "@components/profileSelector";

import style from "./index.scss";

export const COMPONENT_TYPES = {
  SEARCH: "search",
  DROPDOWN: "dropdown",
  PROFILE_SELECTOR: "profile_selector"
};

// todo: add edit state
export default class MultiFilterPanel extends Component {
  static propTypes = {
    filters: PropTypes.array,
    className: PropTypes.string
  };

  renderComponent = ({ type, props }, index) => {
    switch (type) {
      case COMPONENT_TYPES.SEARCH:
        return (
          <OpenSearch key={`filterSearch${index}`} {...props} className="multifilterDropdown" />
        );
      case COMPONENT_TYPES.DROPDOWN:
        return (
          <Dropdown
            key={`filterDropdown${index}`}
            id={"filterOptionsPanelDrpdown-ds"}
            title={"All Groups"}
            className={classnames(style.filterBlockStyling, "filterOptionsDrpdown-ds marginR15")}
            onSelect={props.onSelect}
            multiple={true}
            search={true}
            {...props}
          />
        );
      case COMPONENT_TYPES.PROFILE_SELECTOR:
        return (
          <ProfileFieldSelector
            key={`filterProfile${index}`}
            profileFields={props.profileFields}
            profileKeyData={props.profileKeyData}
            getProfileKeyData={props.getProfileKeyData}
            onSelect={props.onProfileSelect}
          />
        );
    }
  };

  render() {
    return [
      <div
        className={classnames(style.mt_filterOptionsPanel, this.props.className)}
        key="filterOptionsPanel"
      >
        {this.props.filters.map(this.renderComponent)}
      </div>
    ];
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import Dropdown from "@components/dropdown";
import Icon from "@components/icon";

import { OPERATIONS } from "./constants";
import "./index.scss";

class ProfileSelector extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    index: PropTypes.number,
    data: PropTypes.object,
    profileKeyData: PropTypes.array,
    profileFields: PropTypes.array,
    multiple: PropTypes.bool
  };

  // binding all the functions on the instance with the index
  UNSAFE_componentWillMount() {
    const index = this.props.index;

    this.onProfileFieldSelect = (value, event, { title }) => {
      event.stopPropagation();
      this.props.onChange(OPERATIONS.SELECT_PROFILE_FIELD, {
        index,
        value,
        text: title
      });
    };

    this.onProfileKeySelect = (value, event) => {
      event.stopPropagation();
      this.props.onChange(OPERATIONS.SELECT_PROFILE_KEY, {
        index,
        value
      });
    };

    this.handleClose = event => {
      event.stopPropagation();
      this.props.onChange(OPERATIONS.REMOVE, { index });
    };
  }

  renderProfileKeyDropdown() {
    const {
      data: { field, profileKeys },
      profileKeyData,
      index
    } = this.props;
    if (field && profileKeyData) {
      return (
        <Dropdown
          id={`profileKey-${index}`}
          selected={profileKeys}
          options={profileKeyData}
          title="Select"
          setTitle={true}
          onSelect={this.onProfileKeySelect}
          search={true}
          multiple={true}
          className="profileSubDropdown"
        />
      );
    }
  }

  render() {
    const {
      index,
      multiple,
      data: { field, text }
    } = this.props;
    const showRemoveIcon = multiple || field;
    return (
      <div className="profileFields">
        <Dropdown
          id={`profileFieldSelector-${index}`}
          title={text || "Select Profile Field"}
          options={this.props.profileFields}
          onSelect={this.onProfileFieldSelect}
          className="profileDrpdown"
          setTitle={true}
        />
        {this.renderProfileKeyDropdown()}
        {showRemoveIcon ? (
          <Icon type="Cancel" className="ps_closeIcon" onClick={this.handleClose} />
        ) : null}
      </div>
    );
  }
}

export default ProfileSelector;

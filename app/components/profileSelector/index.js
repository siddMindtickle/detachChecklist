import React, { Component } from "react";
import PropTypes from "prop-types";

import ProfileSelector from "./ProfileSelector";

import { OPERATIONS } from "./constants";

const getEmptyField = () => ({ field: "" });

class ProfileSelectorContainer extends Component {
  static propTypes = {
    profileFields: PropTypes.array,
    profileKeyData: PropTypes.object,
    onSelect: PropTypes.func,
    getProfileKeyData: PropTypes.func
  };

  static defaultProps = {
    profileKeyData: {}
  };

  state = {
    profileFields: [getEmptyField()]
  };

  handleAction = (actionType, params = {}) => {
    const profileFields = [...this.state.profileFields];
    const { value, index, text } = params;
    switch (actionType) {
      case OPERATIONS.ADD_PROFILE_FIELD:
        profileFields.push({ field: "", text: "" });
        break;
      case OPERATIONS.SELECT_PROFILE_FIELD:
        profileFields[index].field = value;
        profileFields[index].text = text;
        if (!this.props.profileKeyData[value]) {
          this.props.getProfileKeyData({ profileField: value });
        }
        break;
      case OPERATIONS.SELECT_PROFILE_KEY:
        profileFields[index].profileKeys = value;
        this.props.onSelect(profileFields);
        break;
      case OPERATIONS.REMOVE:
        if (profileFields.length > 1) {
          profileFields.splice(index, 1);
        } else {
          profileFields[0] = getEmptyField();
        }

        break;
    }
    this.setState({ profileFields });
  };

  addProfileField = () => this.handleAction(OPERATIONS.ADD_PROFILE_FIELD);

  renderProfileField = (profileField, index) => {
    const field = profileField.field;
    return (
      <ProfileSelector
        key={`profileField-${index}`}
        data={profileField}
        profileKeyData={this.props.profileKeyData[field]}
        profileFields={this.props.profileFields}
        index={index}
        onChange={this.handleAction}
        multiple={this.state.profileFields.length > 1}
      />
    );
  };

  render() {
    return (
      <div className="ps_container">
        {this.state.profileFields.map(this.renderProfileField)}
        <div className="ps_addProfileFields" onClick={this.addProfileField}>
          + Another Profile Field Filter
        </div>
      </div>
    );
  }
}

export default ProfileSelectorContainer;

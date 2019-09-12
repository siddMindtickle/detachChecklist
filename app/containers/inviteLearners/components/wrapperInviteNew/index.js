import React, { Component } from "react";
import PropTypes from "prop-types";

import { deepEqual } from "@utils";

import { infoToast as InfoToast } from "@utils/toast";

import AddInviteNewLearners from "../../components/inviteNewLearners";
import { INVITE_TYPE, OPERATIONS as ALL_OPERATIONS } from "../../config/constants";

const OPERATIONS = ALL_OPERATIONS[INVITE_TYPE.ADD_INVITE_NEW];

export default class WrapperInviteNewLearners extends Component {
  static propTypes = {
    searchedLearners: PropTypes.array.isRequired,
    status: PropTypes.object.isRequired,
    learners: PropTypes.object.isRequired,
    operate: PropTypes.func.isRequired,
    enabledFeatures: PropTypes.object,
    defaultModuleRelevance: PropTypes.string,
    inviteToSeries: PropTypes.bool.isRequired
  };

  state = {
    userToAdd: {}
  };

  search = email => {
    this.props.operate({
      operation: OPERATIONS.GET_LEARNERS,
      query: email,
      inviteType: INVITE_TYPE.ADD_INVITE_NEW,
      replace: true
    });
  };

  checkExist = ({ email, name }) => {
    this.props.operate({
      operation: OPERATIONS.ADD_TO_LIST,
      email,
      name
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { status } = nextProps;
    const { status: oldStatus } = this.props;
    if (!deepEqual(status, oldStatus)) {
      const { loaded, hasError, data = {}, operation = {} } = status;
      if (loaded && !hasError && operation === OPERATIONS.ADD_TO_LIST) {
        if (data.exists) {
          return InfoToast({ message: "User already added!" });
        }
        this.setState({ userToAdd: data });
      }
    }
  }

  render() {
    return (
      <AddInviteNewLearners
        search={this.search}
        checkExist={this.checkExist}
        {...this.props}
        userToAdd={this.state.userToAdd}
        enabledFeatures={this.props.enabledFeatures}
        inviteToSeries={this.props.inviteToSeries}
      />
    );
  }
}

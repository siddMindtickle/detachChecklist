import React, { Component } from "react";
import PropTypes from "prop-types";

import InviteExisting from "../../components/inviteExisting";
import Loader from "@components/loader";

export default class WrapperInviteExisting extends Component {
  static propTypes = {
    invite: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,

    operate: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired,
    getProfileKeyData: PropTypes.func.isRequired,

    loaded: PropTypes.bool,
    isLoading: PropTypes.bool,
    hasError: PropTypes.bool,

    inviteToSeries: PropTypes.bool.isRequired,

    status: PropTypes.object,
    profileFields: PropTypes.array,
    profileKeyData: PropTypes.object,
    groups: PropTypes.array,
    searchedLearners: PropTypes.object,
    learners: PropTypes.object,

    enabledFeatures: PropTypes.object,
    defaultModuleRelevance: PropTypes.string
  };

  onSearch = (options = {}) => {
    const { operate, inviteToSeries } = this.props;
    operate({
      ...options,
      inviteToSeries
    });
  };

  componentDidMount() {
    this.props.getData();
  }

  render() {
    const {
      loaded,
      hasError,
      close,
      invite,
      getProfileKeyData,
      profileFields,
      profileKeyData,
      searchedLearners,
      learners,
      groups,
      status,
      enabledFeatures,
      defaultModuleRelevance,
      inviteToSeries
    } = this.props;
    const props = {
      close,
      invite,
      getProfileKeyData,
      profileFields,
      profileKeyData,
      searchedLearners,
      learners,
      groups,
      status,
      enabledFeatures,
      defaultModuleRelevance,
      inviteToSeries
    };
    return loaded && !hasError ? (
      <InviteExisting {...props} onSearch={this.onSearch} />
    ) : (
      <Loader vCenter={true} />
    );
  }
}

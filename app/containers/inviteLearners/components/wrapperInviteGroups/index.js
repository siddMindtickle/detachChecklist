import React, { Component } from "react";
import PropTypes from "prop-types";

import Loader from "@components/loader";
import InviteGroups from "../../components/inviteGroups";

export default class WrapperInviteGroups extends Component {
  static propTypes = {
    invite: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    loaded: PropTypes.bool,
    hasError: PropTypes.bool,
    inviteToSeries: PropTypes.bool.isRequired,
    getGroups: PropTypes.func.isRequired,
    groups: PropTypes.array,
    enabledFeatures: PropTypes.object,
    defaultModuleRelevance: PropTypes.string
  };

  state = {
    groupsToShow: undefined
  };

  searchChange = query => {
    const { groups = [] } = this.props;
    let searchResult = groups.filter(group => group.text.toLowerCase().includes(query));
    this.setState({ groupsToShow: searchResult });
  };

  search = value => {
    if (value) {
      this.searchChange(value.toLowerCase());
    } else {
      this.setState({ groupsToShow: this.props.groups });
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { loaded, hasError, groups } = nextProps;
    const { loaded: oldLoaded } = this.props;
    if (loaded && !hasError && loaded !== oldLoaded) {
      this.setState({ groupsToShow: groups });
    }
  }

  componentDidMount() {
    const { getGroups, inviteToSeries } = this.props;
    getGroups({ inviteToSeries });
  }

  render() {
    const {
      invite,
      close,
      loaded,
      hasError,
      enabledFeatures,
      defaultModuleRelevance,
      inviteToSeries
    } = this.props;
    const { groupsToShow: groups = [] } = this.state;
    return loaded && !hasError ? (
      <InviteGroups
        groups={groups}
        invite={invite}
        close={close}
        search={this.search}
        enabledFeatures={enabledFeatures}
        defaultModuleRelevance={defaultModuleRelevance}
        inviteToSeries={inviteToSeries}
      />
    ) : (
      <Loader vCenter={true} />
    );
  }
}

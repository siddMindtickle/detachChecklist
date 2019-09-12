import React, { Component } from "react";
import PropTypes from "prop-types";

import ListingModal from "./ListingModal";
import { infoToast, errorToast } from "@utils/toast";

import { LEARNERS_CONFIG, OPERATIONS } from "../../config/constants";

const ENTITY_TYPES = [OPERATIONS.SEARCH, OPERATIONS.UPDATE];

class LearnersListingContainer extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    data: PropTypes.object,
    seriesName: PropTypes.string,
    actions: PropTypes.object,
    moduleType: PropTypes.string.isRequired,
    mappedSeries: PropTypes.arrayOf(PropTypes.string)
  };

  state = {
    entityType: OPERATIONS.UPDATE
  };

  UNSAFE_componentWillMount() {
    // Defining on the instance so that a new object of actions is not created on every render
    this.actions = {
      ...this.props.actions,
      manipulateData: this.manipulateData
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { operationStatus: { loaded } = {} } = this.props.data;
    const {
      operationStatus: { loaded: newLoadedState, data: { operation } = {} } = {}
    } = nextProps.data;
    if (newLoadedState && newLoadedState !== loaded && ENTITY_TYPES.includes(operation)) {
      this.setState({ entityType: operation });
    }
  }

  componentDidMount() {
    const { type, mappedSeries } = this.props;
    this.props.actions.getData({ type, mappedSeries });
  }

  componentDidUpdate(prevProps) {
    const {
      data: { hasError, error }
    } = this.props;
    const {
      data: { hasError: prevHasError }
    } = prevProps;

    this.props.data.isLoading && infoToast({ message: "Loading..." });

    if (hasError && hasError !== prevHasError) {
      errorToast({ message: error });
    }
  }

  componentWillUnmount() {
    this.props.actions.resetData();
  }

  manipulateData = params => {
    this.props.actions.manipulateData({
      ...params,
      type: this.props.type,
      entityType: this.state.entityType
    });
  };

  handleSelect = options => {
    this.props.onSelect({
      ...options,
      type: this.props.type
    });
  };

  renderModal() {
    const {
      type,
      data: { searchLearners: data },
      moduleType
    } = this.props;

    const {
      groups: { data: groupsData },
      operationStatus,
      learners,
      profileFields: { data: profileFieldsData } = {},
      profileKeyData: { data: profileKeyData } = {}
    } = this.props.data;

    const { title, subtitle, getFooter } = LEARNERS_CONFIG[type];

    return (
      <ListingModal
        onClose={this.props.onClose}
        onSelect={this.handleSelect}
        data={data}
        operationStatus={operationStatus}
        groups={groupsData}
        learners={learners}
        profileFields={profileFieldsData}
        profileKeyData={profileKeyData}
        mode={LEARNERS_CONFIG[type].mode}
        actions={this.actions}
        title={`${title}  '${this.props.seriesName}'`}
        subtitle={subtitle}
        getFooter={getFooter}
        moduleType={moduleType}
      />
    );
  }

  render() {
    return this.props.data.loaded ? this.renderModal() : null;
  }
}

export default LearnersListingContainer;

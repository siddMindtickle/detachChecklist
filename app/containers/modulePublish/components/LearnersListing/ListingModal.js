// import classNames from 'classnames';
import React, { Component } from "react";
import PropTypes from "prop-types";

import MultiFilterPanel, { COMPONENT_TYPES } from "@components/multiFilterPanel";
import Button from "@components/button";
import Loader from "@components/loader";
import LearnersSelectionTable from "../learnersSelectionTable";
import LearnersViewTable from "../learnersViewTable";

import Modal from "@components/modal";

import { debounce } from "@utils/index";
import { OPERATIONS, MODES, INPUT_WAIT } from "../../config/constants";

import style from "./index.scss";
import classnames from "classnames";

const MODE_TO_FILTERS = {
  [MODES.SELECT]: [
    COMPONENT_TYPES.DROPDOWN,
    COMPONENT_TYPES.PROFILE_SELECTOR,
    COMPONENT_TYPES.SEARCH
  ],
  [MODES.VIEW]: [COMPONENT_TYPES.DROPDOWN, COMPONENT_TYPES.SEARCH]
};

class AllInvitedModal extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    data: PropTypes.object,
    operationStatus: PropTypes.object,
    groups: PropTypes.array,
    learners: PropTypes.object,
    mode: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    getFooter: PropTypes.func,
    actions: PropTypes.object,
    moduleType: PropTypes.string.isRequired,
    profileFields: PropTypes.array,
    profileKeyData: PropTypes.object,
    getProfileKeyData: PropTypes.func
  };

  static defaultProps = {
    getFooter: () => "OK",
    operationStatus: {}
  };

  state = {
    filters: {},
    isAllSelected: false,
    selectionData: []
  };

  componentWillMount() {
    this.debouncedSearch = debounce(this.handleSearch, INPUT_WAIT);
    this.setFilters(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profileKeyData !== this.props.profileKeyData) {
      this.setFilters(nextProps);
    }
  }

  setFilters = props => {
    this.filters = {
      [COMPONENT_TYPES.SEARCH]: {
        onSearch: this.debouncedSearch,
        placeholder: "Search Learners"
      },
      [COMPONENT_TYPES.DROPDOWN]: {
        onSelect: this.handleGroupsSelect,
        options: props.groups
      },
      [COMPONENT_TYPES.PROFILE_SELECTOR]: {
        profileFields: props.profileFields,
        profileKeyData: props.profileKeyData,
        onProfileSelect: this.handleProfileSelect,
        getProfileKeyData: props.actions.getProfileKeyData
      }
    };
    this.filtersByMode = MODE_TO_FILTERS[props.mode].map(filter => ({
      type: filter,
      props: this.filters[filter]
    }));
  };

  handleOperation = (params = {}) => {
    const newFilters = {
      ...this.state.filters,
      ...params
    };
    this.setState({ filters: newFilters });
    this.props.actions.manipulateData({
      operation: OPERATIONS.SEARCH,
      ...this.props.data,
      ...newFilters
    });
  };

  handleSearch = search => this.handleOperation({ search });

  handleGroupsSelect = groups => this.handleOperation({ groupIds: groups });

  handleProfileSelect = profileFields => this.handleOperation({ profileFields });

  handleLoadMore = () => {
    this.props.actions.manipulateData({
      operation: OPERATIONS.LOAD_MORE,
      start: this.props.data.data.length,
      ...this.props.data,
      ...this.state.filters
    });
  };

  handleLearnerSelection = selectionOptions => this.setState(selectionOptions);

  handleSelect = () => {
    const { isAllSelected, selectionData } = this.state;
    this.props.onSelect({
      ...this.state.filters,
      isAllSelected,
      totalSelected: isAllSelected ? this.props.data.total : selectionData.length,
      userIds: selectionData
    });
  };

  renderMoreButton() {
    const {
      operationStatus: { data: { operation } = {}, isLoading }
    } = this.props;
    const classes = classnames(style.lm_loadMore, "center_100_Percent");

    if (operation === OPERATIONS.LOAD_MORE && isLoading) {
      return (
        <div className={classes}>
          <Loader vCenter={true} />
        </div>
      );
    }
    if (this.props.data.hasMore) {
      return (
        <div className={classes}>
          <span onClick={this.handleLoadMore} className="link">
            Load More
          </span>
        </div>
      );
    }
    return null;
  }

  renderTitle() {
    return (
      <div className="modalHeader">
        <div className="modalHeader--title">{this.props.title}</div>
        {this.props.subtitle && <div className="modalHeader--subTitle">{this.props.subtitle}</div>}
      </div>
    );
  }

  renderTable() {
    const {
      operationStatus: { data: { operation } = {}, isLoading }
    } = this.props;
    const commonProps = {
      data: this.props.data,
      learners: this.props.learners,
      actions: this.props.actions,
      groups: this.props.groups,
      className: style.table,
      loading: operation === OPERATIONS.SEARCH && isLoading
    };

    if (this.props.mode === MODES.SELECT) {
      return (
        <LearnersSelectionTable
          {...commonProps}
          onSelect={this.handleLearnerSelection}
          isAllSelected={this.state.isAllSelected}
          selectionData={this.state.selectionData}
        />
      );
    }
    return <LearnersViewTable {...commonProps} />;
  }

  renderBody() {
    const {
      data: { data },
      moduleType
    } = this.props;

    return (
      <div className="lm_learnerListing">
        <MultiFilterPanel filters={this.filtersByMode} className="lm_multifilter" />
        {(() => {
          if (!data.length) {
            return (
              <div className="centerDiv">
                <div className={style.lm_noLearnerText}>No Results Found.</div>
                <div className={style.lm_noLearnerMsg}>
                  You can invite new learners after publishing the {moduleType}.
                </div>
              </div>
            );
          } else {
            return (
              <div>
                {this.renderTable()}
                {this.renderMoreButton()}
              </div>
            );
          }
        })()}
      </div>
    );
  }

  renderFooter() {
    const {
      mode,
      data: { total }
    } = this.props;
    const { selectionData, isAllSelected } = this.state;
    const numOfLearners = selectionData.length;
    return (
      <Button
        className="btnAllInvitedModal"
        type="PrimarySm"
        key="primaryBtnChecklistInviteFilter12"
        disabled={mode === MODES.SELECT && !(isAllSelected || numOfLearners)}
        onClick={this.handleSelect}
      >
        {this.props.getFooter(isAllSelected ? total : numOfLearners)}
      </Button>
    );
  }

  render() {
    return (
      <Modal
        className="modalAllInvited"
        show={true}
        modaltype="ModalLarge"
        title={this.renderTitle()}
        close={this.props.onClose}
        body={this.renderBody()}
        footer={this.renderFooter()}
      />
    );
  }
}

export default AllInvitedModal;

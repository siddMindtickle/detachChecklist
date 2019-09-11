import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "@components/icon";
import DataTableWithSelection from "@components/dataTableWithSelection";
import LoadMore from "@components/loadMore";
import MultiFilterPanel, { COMPONENT_TYPES } from "@components/multiFilterPanel";
import { Column } from "@components/dataTable";

import InviteFooter from "../../components/inviteFooter";

import { debounce } from "@utils/index";

import style from "./index.scss";
import ModuleRelevanceCell from "../moduleRelevanceCell";
import ModuleRelevanceHeader from "../moduleRelevanceHeader";

import {
  DEFAULT_INPUT_WAIT,
  INVITE_TYPE,
  OPERATIONS as ALL_OPERATIONS,
  RELEVANCE_KEY
} from "../../config/constants";

const OPERATIONS = ALL_OPERATIONS[INVITE_TYPE.INVITE_EXISTING];

const columnPropTypes = {
  data: PropTypes.array.isRequired,
  rowIndex: PropTypes.number,
  learners: PropTypes.object,
  selectionData: PropTypes.any,
  moduleRelevanceSelection: PropTypes.any,
  handleRelevanceUpdate: PropTypes.any,
  defaultModuleRelevanceSelection: PropTypes.any,
  isAllSelected: PropTypes.any
};

const FirstColumnSelection = ({ data, rowIndex, learners }) => {
  return (
    <div className={style.learner}>
      {data.profilePic ? (
        <img src={data.profilePic} />
      ) : (
        <div className={style.learnerPicHolder}>
          <Icon type="userProfile" className={style.userProfileIcon} />
        </div>
      )}
      <div title={learners[data[rowIndex]].email} className={style.learnerDescText}>
        {learners[data[rowIndex]].displayName}
      </div>
    </div>
  );
};
FirstColumnSelection.propTypes = columnPropTypes;

class InviteExistingLearners extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    learners: PropTypes.object,
    searchedLearners: PropTypes.object,
    groups: PropTypes.array,
    status: PropTypes.object,
    profileFields: PropTypes.array,
    profileKeyData: PropTypes.object,
    getProfileKeyData: PropTypes.func,
    close: PropTypes.func,
    invite: PropTypes.func,
    onSearch: PropTypes.func,
    enabledFeatures: PropTypes.object,
    defaultModuleRelevance: PropTypes.string,
    inviteToSeries: PropTypes.bool.isRequired
  };

  static defaultProps = {
    data: {},
    status: {}
  };

  state = {
    selectionData: [],
    isAllSelected: false,
    moduleRelevanceSelection: {},
    defaultModuleRelevanceSelection: this.props.defaultModuleRelevance || "NONE"
  };

  debouncedSearch = debounce(query => this.handleOperation({ query }), DEFAULT_INPUT_WAIT);

  handleGroupsSelect = groups => this.handleOperation({ groupIds: groups });

  onProfileSelect = profileFields => {
    this.handleOperation({ profileFields });
  };

  handleSelect = options => {
    this.setState(options);
  };
  inviteAll = () => {
    const { moduleRelevanceEnabled } = this.props.enabledFeatures;

    this.props.invite(
      INVITE_TYPE.INVITE_EXISTING,
      this.state.isAllSelected ? [] : this.state.selectionData,
      this.state.filters,
      moduleRelevanceEnabled
        ? {
            moduleRelevanceEnabled: moduleRelevanceEnabled,
            moduleRelevanceSelection: this.state.moduleRelevanceSelection,
            defaultModuleRelevanceSelection: this.state.defaultModuleRelevanceSelection
          }
        : { moduleRelevanceEnabled: moduleRelevanceEnabled }
    );
    this.props.close();
  };

  getFilters = () => {
    const props = this.props;
    return [
      {
        type: COMPONENT_TYPES.DROPDOWN,
        props: {
          onSelect: this.handleGroupsSelect,
          options: props.groups
        }
      },
      {
        type: COMPONENT_TYPES.PROFILE_SELECTOR,
        props: {
          profileFields: props.profileFields,
          profileKeyData: props.profileKeyData,
          onProfileSelect: this.onProfileSelect,
          getProfileKeyData: props.getProfileKeyData
        }
      },
      {
        type: COMPONENT_TYPES.SEARCH,
        props: {
          onSearch: this.debouncedSearch,
          placeholder: "Search Learners"
        }
      }
    ];
  };

  handleLoad = () => {
    const { onSearch, searchedLearners } = this.props;
    onSearch({
      operation: OPERATIONS.LOAD_MORE,
      ...this.state.filters,
      start: searchedLearners.start
    });
  };

  handleOperation = (params = {}) => {
    const newFilters = {
      ...this.state.filters,
      ...params
    };
    this.setState({ filters: newFilters });
    this.props.onSearch({
      operation: OPERATIONS.SEARCH,
      ...newFilters
    });
  };

  handleRelevanceUpdate = (params = {}) => {
    const { learners } = this.props;
    const { key, value } = params;
    let newState = {};
    let newModuleRelevanceSelection = {
      ...this.state.moduleRelevanceSelection
    };

    newModuleRelevanceSelection[key] = value;

    if (key === RELEVANCE_KEY.ALL) {
      newState["defaultModuleRelevanceSelection"] = value;
      Object.keys(learners).forEach(function(userId) {
        newModuleRelevanceSelection[userId] = value;
      });
    } else {
      delete newModuleRelevanceSelection[RELEVANCE_KEY.ALL];
    }

    newState["moduleRelevanceSelection"] = newModuleRelevanceSelection;

    this.setState(newState);
  };

  renderTable() {
    const {
      searchedLearners = {},
      learners,
      status: { data: { operation } = {}, isLoading },
      enabledFeatures: { moduleRelevanceEnabled },
      inviteToSeries,
      defaultModuleRelevance
    } = this.props;

    const {
      isAllSelected,
      selectionData,
      moduleRelevanceSelection,
      defaultModuleRelevanceSelection
    } = this.state;
    const { total: totalLearners, data, hasMore } = searchedLearners;
    return (
      <div className={style.inviteExistingTableCustom}>
        <DataTableWithSelection
          {...this.state}
          onSelect={this.handleSelect}
          data={data}
          rowsCount={data.length}
          width="1024px"
          noData="No Learners Found"
          loading={operation === OPERATIONS.SEARCH && isLoading}
          enableRowSelection={false}
        >
          <Column
            hidden={false}
            header={<div className={style.header}>{`${totalLearners} Learner(s)`}</div>}
            cell={<FirstColumnSelection data={data} learners={learners} />}
          />
          {!inviteToSeries &&
            moduleRelevanceEnabled && (
              <Column
                hidden={false}
                header={
                  <ModuleRelevanceHeader
                    isAllSelected={isAllSelected}
                    moduleRelevanceSelection={moduleRelevanceSelection}
                    handleRelevanceUpdate={this.handleRelevanceUpdate}
                    defaultModuleRelevanceSelection={defaultModuleRelevance}
                  />
                }
                cell={
                  <ModuleRelevanceCell
                    isAllSelected={isAllSelected}
                    data={data}
                    selectionData={selectionData}
                    moduleRelevanceSelection={moduleRelevanceSelection}
                    learners={learners}
                    handleRelevanceUpdate={this.handleRelevanceUpdate}
                    defaultModuleRelevanceSelection={defaultModuleRelevanceSelection}
                    type={INVITE_TYPE.INVITE_EXISTING}
                  />
                }
              />
            )}
        </DataTableWithSelection>
        {hasMore && (
          <LoadMore
            loading={operation === OPERATIONS.LOAD_MORE && isLoading}
            handleLoad={this.handleLoad}
          />
        )}
      </div>
    );
  }

  render() {
    const { close } = this.props;
    const { selectionData } = this.state;
    return (
      <div className="inviteExist_inviteLearner">
        <MultiFilterPanel filters={this.getFilters()} className="inviteExist_multifilter" />
        {this.renderTable()}
        <InviteFooter
          cancel={close}
          invite={this.inviteAll}
          disableInvite={!selectionData.length}
        />
      </div>
    );
  }
}

export default InviteExistingLearners;

import React, { Component } from "react";
import PropTypes from "prop-types";

import { debounce } from "@utils";

import { INVITE_TYPE, RELEVANCE_KEY } from "../../config/constants";

import InviteFooter from "../../components/inviteFooter";

import { Column } from "@components/dataTable";
import DataTableWithSelection from "@components/dataTableWithSelection";
import MultiFilterPanel, { COMPONENT_TYPES } from "@components/multiFilterPanel";

import ModuleRelevanceCell from "../moduleRelevanceCell";
import ModuleRelevanceHeader from "../moduleRelevanceHeader";

import style from "./index.scss";

const FirstColumn = ({ data, rowIndex }) => {
  return <div className={style.inviteGroupNames}>{data[rowIndex].text}</div>;
};
FirstColumn.propTypes = {
  data: PropTypes.array.isRequired,
  rowIndex: PropTypes.number
};

export default class InviteGroups extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    invite: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    groups: PropTypes.array.isRequired,
    enabledFeatures: PropTypes.object,
    defaultModuleRelevance: PropTypes.string,
    inviteToSeries: PropTypes.bool.isRequired
  };

  state = {
    isAllSelected: false,
    selectionData: [],
    disableInvite: true,
    moduleRelevanceSelection: {},
    defaultModuleRelevanceSelection: this.props.defaultModuleRelevance || "NONE"
  };

  componentWillMount() {
    this.filters = [
      {
        type: COMPONENT_TYPES.SEARCH,
        props: {
          onSearch: debounce(this.props.search, 100),
          placeholder: "Search Groups"
        }
      }
    ];
  }

  handleSelection = ({ selectionData, isAllSelected }) => {
    let disableInvite = !selectionData.length;
    this.setState({ selectionData, isAllSelected, disableInvite });
  };

  inviteGroups = () => {
    const { moduleRelevanceEnabled } = this.props.enabledFeatures;
    const { selectionData, moduleRelevanceSelection, defaultModuleRelevanceSelection } = this.state;

    const recalculatedModuleRelevanceSelection = {};
    selectionData.forEach(groupId => {
      recalculatedModuleRelevanceSelection[groupId] = moduleRelevanceSelection[groupId]
        ? moduleRelevanceSelection[groupId]
        : defaultModuleRelevanceSelection;
    });

    const moduleRelevanceOptions = moduleRelevanceEnabled
      ? {
          moduleRelevanceSelection: recalculatedModuleRelevanceSelection,
          defaultModuleRelevanceSelection: defaultModuleRelevanceSelection,
          moduleRelevanceEnabled: moduleRelevanceEnabled
        }
      : { moduleRelevanceEnabled: moduleRelevanceEnabled };

    if (selectionData.length) {
      this.props.invite(INVITE_TYPE.INVITE_GROUP, selectionData, null, moduleRelevanceOptions);
    }
    this.props.close();
  };

  handleRelevanceUpdate = (params = {}) => {
    const { groups } = this.props;
    const { key, value } = params;
    let newState = {};
    let newModuleRelevanceSelection = {
      ...this.state.moduleRelevanceSelection
    };

    newModuleRelevanceSelection[key] = value;

    if (key === RELEVANCE_KEY.ALL) {
      newState["defaultModuleRelevanceSelection"] = value;
      Object.keys(groups).forEach(function(id) {
        newModuleRelevanceSelection[id] = value;
      });
    } else {
      delete newModuleRelevanceSelection[RELEVANCE_KEY.ALL];
    }

    newState["moduleRelevanceSelection"] = newModuleRelevanceSelection;

    this.setState(newState);
  };

  render() {
    const {
      isAllSelected,
      selectionData,
      disableInvite,
      moduleRelevanceSelection,
      defaultModuleRelevanceSelection
    } = this.state;
    const {
      groups,
      close,
      enabledFeatures: { moduleRelevanceEnabled },
      inviteToSeries,
      defaultModuleRelevance
    } = this.props;
    return (
      <div key="inviteGroups" className={style.inviteGroups}>
        <div className="inviteGroupsSearch">
          <MultiFilterPanel filters={this.filters} />
        </div>
        <div className={style.inviteGroupsList}>
          <DataTableWithSelection
            width="1024px"
            data={groups}
            rowsCount={groups.length}
            onSelect={this.handleSelection}
            isAllSelected={isAllSelected}
            selectionData={selectionData}
            noData="No Groups Found"
            enableRowSelection={false}
          >
            <Column
              header={<div className={style.header}>Group Name</div>}
              cell={<FirstColumn data={groups} />}
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
                      data={groups}
                      selectionData={selectionData}
                      moduleRelevanceSelection={moduleRelevanceSelection}
                      handleRelevanceUpdate={this.handleRelevanceUpdate}
                      defaultModuleRelevanceSelection={defaultModuleRelevanceSelection}
                      type={INVITE_TYPE.INVITE_GROUP}
                    />
                  }
                />
              )}
          </DataTableWithSelection>
        </div>
        <InviteFooter disableInvite={disableInvite} invite={this.inviteGroups} cancel={close} />
      </div>
    );
  }
}

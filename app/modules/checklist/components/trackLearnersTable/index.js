import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Dropdown from "@components/dropdown";
import Icon from "@components/icon";
import { Column } from "@components/dataTable";
import Info from "@components/info";
import ModuleRelevanceInfoPopupContent from "@components/moduleRelevanceInfoPopupContent";
import DataTableWithSelection from "@components/dataTableWithSelection";
import { noop } from "@utils";
import style from "./index.scss";
import { SUPPORTED_SORTINGS, SORTING_ORDER, LEARNER_TYPES } from "../../config/track.constants";

import { LEARNER_OPERATIONS, LEARNER_OPERATIONS_DD_OPTIONS } from "./constants";

class ColumnHeader extends Component {
  static propTypes = {
    title: PropTypes.node.isRequired,
    sort: PropTypes.object,
    onSort: PropTypes.func,
    activeSort: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    className: PropTypes.string,
    info: PropTypes.object
  };
  static defaultProps = {
    sort: {},
    onSort: noop,
    activeSort: false
  };
  getSortingOrder = ({ activeSort, sort }) => {
    if (activeSort !== sort.type) return SORTING_ORDER.DESC;
    return sort.order == SORTING_ORDER.DESC ? SORTING_ORDER.ASC : SORTING_ORDER.DESC;
  };
  onSort = () => {
    const { sort, activeSort, onSort } = this.props;
    onSort({
      ...sort,
      order: this.getSortingOrder({ activeSort, sort })
    });
  };

  showInfo = info => {
    const allInfoComponents = {
      ModuleRelevanceInfo: ModuleRelevanceInfoPopupContent
    };

    if (!info) return;

    const { type, content } = info;
    let infoContent = "";
    let InfoComponent = "";
    switch (type) {
      case "text":
      case "node":
        infoContent = content;
        break;
      case "component":
        InfoComponent = allInfoComponents[content || "foo"];
        infoContent = <InfoComponent />;
        break;
    }

    return infoContent;
  };

  render() {
    const { sort, activeSort, title, info } = this.props;
    const sortOrder = this.getSortingOrder({ activeSort, sort });
    return (
      <div
        className={classnames(style.header, this.props.className, {
          [style.activeSort]: !!activeSort
        })}
        onClick={this.onSort}
      >
        <div className={style.allTaskTitle}>
          <span className="marginR5">{title} </span>
          {info && <Info content={this.showInfo(info)} className={style.infoOverlay} />}
        </div>

        <div className={classnames(style[`sort-${sort.order}`], style.sortIcon)}>
          <Icon
            type="Sort_Down"
            className={classnames(style.sortIconStyle, {
              [style.active]: !!activeSort && sortOrder === SORTING_ORDER.DESC
            })}
          />
          <Icon
            type="Sort_Up"
            className={classnames(style.sortIconStyle, {
              [style.active]: !!activeSort && sortOrder === SORTING_ORDER.ASC
            })}
          />
        </div>
      </div>
    );
  }
}

const GenericColumn = ({
  data,
  rowIndex,
  fieldToShow,
  containerClass = "",
  iconType,
  iconStyle,
  title,
  innerClass
}) => {
  return (
    <div className={containerClass}>
      {iconType && <Icon type={iconType} className={iconStyle} />}
      <div title={(data[rowIndex] && data[rowIndex][title]) || ""} className={innerClass}>
        {data[rowIndex] && data[rowIndex][fieldToShow]}
      </div>
    </div>
  );
};
GenericColumn.propTypes = {
  data: PropTypes.array.isRequired,
  rowIndex: PropTypes.number,
  fieldToShow: PropTypes.any.isRequired,
  containerClass: PropTypes.any,
  iconType: PropTypes.any,
  iconStyle: PropTypes.any,
  title: PropTypes.any,
  innerClass: PropTypes.any
};

const SecondColumn = ({ data, rowIndex }) => {
  const statusColorMap = {
    [LEARNER_TYPES.IN_PROGRESS]: "bg_Halfcompleted",
    [LEARNER_TYPES.COMPLETED]: "bg_Completed",
    [LEARNER_TYPES.ADDED]: "bg_DidNotStart"
  };
  return (
    <div className={style.tableDropdownHolder}>
      <div
        className={classnames(
          style.checklistLearnerTableDrpdown,
          style[statusColorMap[data[rowIndex].status]]
        )}
      >
        {data[rowIndex].completionStatus}
      </div>
    </div>
  );
};
SecondColumn.propTypes = {
  data: PropTypes.array.isRequired,
  rowIndex: PropTypes.number
};

const FifthColumn = ({ data, operations, rowIndex, handleOperation }) => {
  return (
    <div className="moreDropdownWrapper">
      <Dropdown
        id={"dots3dropdown"}
        options={operations}
        customIcon="more_vertical"
        noCaret={true}
        className="moreCustomDropdown"
        onSelect={(value, event) => {
          event.stopPropagation();
          handleOperation({ operation: value, data: [data[rowIndex]] });
        }}
      />
    </div>
  );
};
FifthColumn.propTypes = {
  data: PropTypes.array.isRequired,
  handleOperation: PropTypes.func.isRequired,
  rowIndex: PropTypes.number,
  operations: PropTypes.array.isRequired
};

class TrackLearnersTable extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    sort: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onResetProgress: PropTypes.func.isRequired,
    onChangeRelevance: PropTypes.func.isRequired,
    onViewProfile: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    selectionData: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    moduleRelevanceEnabled: PropTypes.bool.isRequired
  };

  learnerOperationActionMap = {
    [LEARNER_OPERATIONS.REMOVE_LEARNERS]: this.props.onRemove,
    [LEARNER_OPERATIONS.RESET_PROGRESS]: this.props.onResetProgress,
    [LEARNER_OPERATIONS.VIEW_PROFILE]: this.props.onViewProfile,
    [LEARNER_OPERATIONS.CHANGE_RELEVANCE]: this.props.onChangeRelevance
  };

  handleOperation = ({ operation, data }) => {
    this.learnerOperationActionMap[operation](data);
  };

  render() {
    const { data, sort, onSort, onSelect, selectionData, moduleRelevanceEnabled } = this.props;

    let operationDropdownFilters;
    if (moduleRelevanceEnabled) operationDropdownFilters = LEARNER_OPERATIONS_DD_OPTIONS;
    else {
      operationDropdownFilters = LEARNER_OPERATIONS_DD_OPTIONS.filter(
        option => option.value != LEARNER_OPERATIONS.CHANGE_RELEVANCE
      );
    }

    return (
      <div
        className={classnames({
          [style.trackLearnersTable]: true,
          trackLearnerCustom: true,
          removeMoreDropdown: selectionData.length
        })}
      >
        <DataTableWithSelection
          rowsCount={data.length}
          data={data}
          onSelect={onSelect}
          isAllSelected={selectionData.length == data.length}
          enableRowSelection={false}
          loading={this.props.loading}
        >
          <Column
            hidden={false}
            header={
              <ColumnHeader
                title="Learner"
                sort={{ ...sort, type: SUPPORTED_SORTINGS.NAME }}
                activeSort={sort.type == SUPPORTED_SORTINGS.NAME && SUPPORTED_SORTINGS.NAME}
                onSort={onSort}
                className={style.headerFirstCol}
              />
            }
            cell={
              <GenericColumn
                data={data}
                fieldToShow={"learner"}
                containerClass={style.learnerDescription}
                iconType="userProfile"
                iconStyle={style.userIcon}
                title={"email"}
                innerClass={style.learnerName}
              />
            }
          />
          {moduleRelevanceEnabled && (
            <Column
              hidden={false}
              header={
                <ColumnHeader
                  title="Module Relevance"
                  sort={{ ...sort, type: SUPPORTED_SORTINGS.MODULE_RELEVANCE }}
                  activeSort={
                    sort.type == SUPPORTED_SORTINGS.MODULE_RELEVANCE &&
                    SUPPORTED_SORTINGS.MODULE_RELEVANCE
                  }
                  onSort={onSort}
                  className={style.headerFourthCol}
                  info={{ type: "component", content: "ModuleRelevanceInfo" }}
                />
              }
              cell={
                <GenericColumn
                  data={data}
                  fieldToShow={"moduleRelevance"}
                  containerClass={style.inviteOn}
                />
              }
            />
          )}
          <Column
            hidden={false}
            header={
              <ColumnHeader
                title="Completion Status"
                sort={{ ...sort, type: SUPPORTED_SORTINGS.STATUS }}
                activeSort={sort.type == SUPPORTED_SORTINGS.STATUS && SUPPORTED_SORTINGS.STATUS}
                onSort={onSort}
                className={style.headerSecondCol}
              />
            }
            cell={<SecondColumn data={data} />}
          />
          <Column
            hidden={false}
            header={
              <ColumnHeader
                title="Score"
                sort={{ ...sort, type: SUPPORTED_SORTINGS.SCORE }}
                activeSort={sort.type == SUPPORTED_SORTINGS.SCORE && SUPPORTED_SORTINGS.SCORE}
                onSort={onSort}
                className={style.headerThirdCol}
              />
            }
            cell={
              <GenericColumn
                data={data}
                fieldToShow={"score"}
                containerClass={style.scoreColumn}
                innerClass={style.thirdCol}
              />
            }
          />
          <Column
            hidden={false}
            header={
              <ColumnHeader
                title="Invited on"
                sort={{ ...sort, type: SUPPORTED_SORTINGS.INVITED_ON }}
                activeSort={
                  sort.type == SUPPORTED_SORTINGS.INVITED_ON && SUPPORTED_SORTINGS.INVITED_ON
                }
                onSort={onSort}
                className={style.headerFourthCol}
              />
            }
            cell={
              <GenericColumn
                data={data}
                fieldToShow={"invitedOn"}
                containerClass={style.inviteOn}
              />
            }
          />
          <Column
            hidden={false}
            header={""}
            cell={
              <FifthColumn
                data={data}
                operations={operationDropdownFilters}
                handleOperation={this.handleOperation}
              />
            }
            className={style.headerFifthCol}
          />
        </DataTableWithSelection>
      </div>
    );
  }
}
export default TrackLearnersTable;

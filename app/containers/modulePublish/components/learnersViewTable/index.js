import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "@components/icon";
import Info from "@components/info";

import classnames from "classnames";

import { DataTable, Column } from "@components/dataTable";

import style from "./index.scss";

const columnPropTypes = {
  data: PropTypes.array.isRequired,
  rowIndex: PropTypes.number,
  learners: PropTypes.object
};

const FirstColumn = ({ data, rowIndex, learners }) => <div>{learners[data[rowIndex]].email}</div>;
FirstColumn.propTypes = columnPropTypes;

const DotsContainer = props => {
  return (
    <div {...props} className={style.moreHorizontalIcon}>
      <Icon type="more_horizontal" />
    </div>
  );
};

class SecondColumn extends Component {
  renderGroup = (group, id) => <div key={`${group.id}-${id}`}>{group.name}</div>;

  renderOverlay() {
    const { learners, data, rowIndex } = this.props;
    const [a, ...newGroups] = learners[data[rowIndex]].groups; // eslint-disable-line
    return (
      <Info
        id="more"
        className={style.groupsOverlay}
        node={<DotsContainer />}
        content={<div className={style.groupsList}>{newGroups.map(this.renderGroup)}</div>}
      />
    );
  }

  renderMore() {
    const { learners, rowIndex, data } = this.props;
    const learner = learners[data[rowIndex]];
    const numOfGroups = learner.groups.length;
    if (numOfGroups > 1) {
      return (
        <div className={classnames(style.groupsMore, "groupsMore")}>
          <div className={style.moreGroups}>{`  + ${numOfGroups - 1} more`}</div>
          {this.renderOverlay()}
        </div>
      );
    }
    return null;
  }
  render() {
    const { learners, data, rowIndex, className } = this.props;
    const learner = learners[data[rowIndex]];

    return (
      <div className={className}>
        {learner.groups.length ? (
          <div>
            <div className={style.pd_learnerName}>{learner.groups[0].name}</div>
            {this.renderMore()}
          </div>
        ) : (
          <div>No Groups</div>
        )}
      </div>
    );
  }
}

SecondColumn.propTypes = {
  ...columnPropTypes,
  className: PropTypes.string
};

class LearnersViewTable extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    learners: PropTypes.object,
    groups: PropTypes.array,
    className: PropTypes.string,
    loading: PropTypes.bool
  };

  render() {
    const data = this.props.data;
    const { total: totalLearners, data: dataIds } = data;
    return [
      <div key="allLearnersTable" className="learnerTableCustom">
        <DataTable
          rowsCount={dataIds.length}
          width="100%"
          className={this.props.className}
          loading={this.props.loading}
        >
          <Column
            hidden={false}
            header={<div className={style.header}>{`${totalLearners} Learner(s)`}</div>}
            cell={<FirstColumn data={dataIds} learners={this.props.learners} />}
            width="600px"
          />
          <Column
            hidden={false}
            header={<div className={style.header}>Group(s)</div>}
            cell={<SecondColumn data={dataIds} learners={this.props.learners} />}
            className={style.groupCell}
            width="600px"
          />
        </DataTable>
      </div>
    ];
  }
}

export default LearnersViewTable;

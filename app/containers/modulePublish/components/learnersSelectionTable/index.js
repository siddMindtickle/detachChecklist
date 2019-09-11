import React, { Component } from "react";
import PropTypes from "prop-types";

import DataTableWithSelection from "@components/dataTableWithSelection";
import { Column } from "@components/dataTable";

import style from "./index.scss";

const columnPropTypes = {
  data: PropTypes.array.isRequired,
  rowIndex: PropTypes.number,
  learners: PropTypes.object
};

const FirstColumnSelection = ({ data, rowIndex, learners }) => {
  const learner = learners[data[rowIndex]];
  return <div>{learner.name || learner.email}</div>;
};

FirstColumnSelection.propTypes = columnPropTypes;

const SecondColumnSelection = ({ data, rowIndex, learners }) => {
  const { entity_count = 0, total_count = 0 } = learners[data[rowIndex]];
  return <div>{`${entity_count}/${total_count} Modules`}</div>;
};
SecondColumnSelection.propTypes = columnPropTypes;

class LearnersSelectionTable extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    learners: PropTypes.object,
    onSelect: PropTypes.func,
    isAllSelected: PropTypes.bool,
    selectionData: PropTypes.array,
    className: PropTypes.string
  };

  render() {
    const { data, learners, ...restProps } = this.props;
    const { total: totalLearners, data: dataIds } = data;
    return [
      <div key="learnersSelectionTable" className={style.learnersSelectionTableCustom}>
        <DataTableWithSelection
          {...restProps}
          data={dataIds}
          rowsCount={dataIds.length}
          width="100%"
        >
          <Column
            hidden={false}
            header={<div className={style.header}>{`${totalLearners} Learner(s)`}</div>}
            cell={<FirstColumnSelection data={dataIds} learners={learners} />}
          />
          <Column
            hidden={false}
            header={<div className={style.header}>Modules invited to in this series</div>}
            cell={<SecondColumnSelection data={dataIds} learners={learners} />}
          />
        </DataTableWithSelection>
      </div>
    ];
  }
}

export default LearnersSelectionTable;

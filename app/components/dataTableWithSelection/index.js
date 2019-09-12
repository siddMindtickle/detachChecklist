import React, { Component } from "react";
import PropTypes from "prop-types";

import { DataTable, Column } from "@components/dataTable";
import Checkbox from "@components/checkbox";

import { deepEqual, isObject } from "@utils";
/***********  need to refactor this component ************/

const setCellSelection = (data, value) => {
  const selectionValue = !!value;
  return data.reduce((acc, val) => {
    let id = val;
    if (isObject(val)) id = val.id;
    acc[id] = selectionValue;
    return acc;
  }, {});
};

const ColumnCell = ({ onClick, ...params }) => (
  <Checkbox checked={ColumnCell.getCheckedState(params)} onClick={() => onClick(params.rowIndex)} />
);

ColumnCell.propTypes = {
  rowIndex: PropTypes.number,
  onClick: PropTypes.func.isRequired
};

ColumnCell.getCheckedState = ({ data, rowIndex, selectionData }) => {
  const id = isObject(data[rowIndex]) ? data[rowIndex].id : data[rowIndex];
  return !!selectionData[id];
};

class DataTableWithSelection extends Component {
  static propTypes = {
    data: PropTypes.array,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    selectionData: PropTypes.array,
    isAllSelected: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
    enableRowSelection: PropTypes.bool
  };

  static defaultProps = {
    selectionData: [],
    isAllSelected: false,
    enableRowSelection: true
  };

  state = {
    cellSelectionData: setCellSelection(this.props.data, this.props.isAllSelected),
    isAllSelected: this.props.isAllSelected
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      !deepEqual(this.props.data, nextProps.data) ||
      this.props.isAllSelected !== nextProps.isAllSelected
    ) {
      this.setState(() => {
        return {
          cellSelectionData: nextProps.isAllSelected
            ? setCellSelection(nextProps.data, nextProps.isAllSelected)
            : nextProps.data.reduce((result, id) => {
                id = isObject(id) ? id.id : id;
                result[id] = nextProps.selectionData.includes(id);
                return result;
              }, {}),
          isAllSelected: nextProps.isAllSelected
        };
      });
    }
  }

  handleRowSelection = (event, index) => {
    let target = this.props.data[index]; // the cell id which has been selected
    target = isObject(target) ? target.id : target;
    const isChecked = !this.state.cellSelectionData[target]; // toggle selection
    const isAllSelected = this.state.isAllSelected && isChecked;
    const newSelectionData = {
      ...this.state.cellSelectionData,
      [target]: isChecked
    };
    const selectedIds = Object.keys(newSelectionData).filter(id => newSelectionData[id]);
    this.setState({
      cellSelectionData: newSelectionData,
      isAllSelected
    });
    this.props.onSelect({ selectionData: selectedIds, isAllSelected });
  };

  handleSelectAll = () => {
    const isAllSelected = !this.state.isAllSelected;
    const cellSelectionData = Object.keys(this.state.cellSelectionData).reduce((acc, id) => {
      id = isObject(id) ? id.id : id;
      acc[id] = isAllSelected;
      return acc;
    }, {});
    const selectionData = isAllSelected ? Object.keys(cellSelectionData) : [];
    this.props.onSelect({ selectionData, isAllSelected });
    this.setState({
      isAllSelected,
      cellSelectionData
    });
  };

  render() {
    const { children, enableRowSelection, onSelect, ...restProps } = this.props; // eslint-disable-line no-unused-vars
    const { isAllSelected } = this.state;
    const { cellSelectionData } = this.state;
    const childNodes = Array.isArray(children) ? children : [children];
    const columnsWithHeader = [
      <Column
        key="header"
        hidden={false}
        header={<Checkbox checked={isAllSelected} onClick={this.handleSelectAll} />}
        cell={
          <ColumnCell
            data={this.props.data}
            selectionData={cellSelectionData}
            onClick={checked => this.handleRowSelection(null, checked)}
          />
        }
      />,
      ...childNodes
    ];
    delete restProps.selectionData;
    delete restProps.isAllSelected;
    return (
      <DataTable
        {...restProps}
        onRowClick={enableRowSelection ? this.handleRowSelection : undefined}
      >
        {columnsWithHeader}
      </DataTable>
    );
  }
}

export default DataTableWithSelection;

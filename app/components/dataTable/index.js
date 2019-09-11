import React, { Component } from "react";
import PropTypes from "prop-types";

import classNames from "classnames";
import logger from "@utils/logger";
import Loader from "@components/loader";

import style from "./index.scss";

const ReactChildren = React.Children;

export class Column extends Component {
  static __TableColumn__ = true;

  render() {
    // if (__DEV__) {
    //   throw new Error(
    //     'Component <FixedDataTableColumn /> should never render'
    //   );
    // }
    return null;
  }
}

//eslint-disable-next-line no-unused-vars
export const Cell = ({ children, className, rowIndex, ...props }) => (
  <div className={classNames(style.tableCell, className)} {...props}>
    {children}
  </div>
);

Cell.propTypes = {
  children: PropTypes.node.isRequired,
  rowIndex: PropTypes.number,
  className: PropTypes.string
};

const DataTableCell = ({ column, rowIndex }) => {
  let content;
  let cell = column.props.cell;
  let cellStyle = column.props.style || {};
  const className = column.props.className;

  if (column.props.width) {
    cellStyle.width = column.props.width;
  }

  if (React.isValidElement(cell)) {
    content = React.cloneElement(cell, { rowIndex });
  } else if (typeof cell === "function") {
    content = cell({ rowIndex });
  } else {
    content = cell;
  }

  return (
    <td className={classNames(style.tableColumn, className)} style={cellStyle} valign="top">
      {content}
    </td>
  );
};

DataTableCell.propTypes = {
  column: PropTypes.node.isRequired,
  rowIndex: PropTypes.number.isRequired
};

const DataTableRow = ({
  index,
  columns,
  onClick,
  activeRowIndex,
  rowClassNameGetter,
  showHoverStyle = true
}) => {
  let tableColumns = [];

  for (let i = 0; i < columns.length; i++) {
    if (columns[i].props.hidden) {
      continue;
    }

    tableColumns[i] = <DataTableCell column={columns[i]} rowIndex={index} key={`column-${i}`} />;
  }

  const rowClassName = rowClassNameGetter ? rowClassNameGetter(index) : "";

  return (
    <tr
      className={classNames(style.tableDataRow, {
        [style.rowHover]: showHoverStyle,
        [style.active]: activeRowIndex === index,
        [rowClassName]: rowClassNameGetter
      })}
      onClick={onClick ? e => onClick(e, index) : null}
      style={rowClassNameGetter ? {} : { cursor: onClick ? "pointer" : "default" }}
    >
      {tableColumns}
    </tr>
  );
};

DataTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  columns: PropTypes.node.isRequired,
  showHoverStyle: PropTypes.bool,
  activeRowIndex: PropTypes.number,
  onClick: PropTypes.func,
  rowClassNameGetter: PropTypes.func
};

export class DataTable extends Component {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rowsCount: PropTypes.number.isRequired,
    height: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    showHoverStyle: PropTypes.bool,
    activeRowIndex: PropTypes.number,
    onRowClick: PropTypes.func,
    noData: PropTypes.node,
    rowClassNameGetter: PropTypes.func,
    loading: PropTypes.bool
  };

  static defaultProps = {
    noData: "No Results Found"
  };

  render() {
    const {
      children,
      rowsCount,
      width,
      className,
      showHoverStyle,
      activeRowIndex,
      onRowClick,
      noData,
      rowClassNameGetter,
      loading,
      ...otherProps
    } = this.props;

    let columns = [];

    //eslint-disable-next-line no-unused-vars
    ReactChildren.forEach(children, (child, index) => {
      if (child == null) {
        return;
      }

      if (!child.type.__TableColumn__) {
        logger.error("child type should be <Column />");
      }

      columns.push(child);
    });

    let dataRows = [];
    for (let i = 0; i < rowsCount; i++) {
      dataRows[i] = (
        <DataTableRow
          index={i}
          columns={columns}
          key={`row-${i}`}
          showHoverStyle={showHoverStyle}
          activeRowIndex={activeRowIndex}
          onClick={onRowClick}
          rowClassNameGetter={rowClassNameGetter}
        />
      );
    }

    const tableHeaders = [];

    columns.forEach((column, i) => {
      if (column.props.hidden) {
        return;
      }

      let headerStyle = {};
      const header = column.props.header || "";

      if (column.props.width) {
        headerStyle.width = column.props.width;
      }

      tableHeaders.push(
        <th className={style.tableCell} key={`header-${i}`} style={headerStyle}>
          <div>{header}</div>
        </th>
      );
    });

    return (
      <table
        width={width}
        colSpan="0"
        rowSpan="0"
        className={classNames(className, style.dataTable)}
        {...otherProps}
      >
        <tbody>
          <tr>{tableHeaders}</tr>
          {loading ? (
            <tr>
              <td className={style.loading} align="center" colSpan={tableHeaders.length}>
                <Loader vCenter={true} />
              </td>
            </tr>
          ) : dataRows.length ? (
            dataRows
          ) : (
            <tr>
              <td align="center" colSpan={tableHeaders.length} className={style.defaultTableColumn}>
                <div className={style.tableStyling}>{noData}</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

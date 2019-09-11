import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Dropdown from "@components/dropdown";
import Icon from "@components/icon";

import { pageSizeOptions } from "./constants";
import style from "./index.scss";

class Pagination extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: props.current,
      rowSize: 10,
      total: 5
    };
  }

  static propTypes = {
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    rowSize: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onRowSizeChange: PropTypes.func.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.current !== this.props.current) {
      this.setState({
        inputValue: nextProps.current
      });
    }
  }

  onShowRowsChange = selected => {
    this.setState({
      rowSize: selected.value
    });
  };

  _hasPrev = () => {
    return this.props.current > 1;
  };

  _hasNext() {
    return this.props.current < this.calcPage();
  }

  calcPage() {
    return Math.floor((this.props.total - 1) / this.props.rowSize) + 1;
  }

  prev = () => {
    if (this._hasPrev()) {
      // this._handleChange(this.state.currentPage - 1);
      this.props.onChange(this.props.current - 1);
    }
  };

  next = () => {
    if (this._hasNext()) {
      // this._handleChange(this.state.currentPage - 1);
      this.props.onChange(this.props.current + 1);
    }
  };

  _resetInput = () => {
    this.setState({
      inputValue: this.props.current
    });
  };

  _isValid(page) {
    return typeof page === "number" && page >= 1 && page <= this.calcPage();
  }

  onInputChange = e => {
    e.stopPropagation();
    this.setState({
      inputValue: e.target.value
    });
  };

  onInputBlur = () => {
    this._resetInput();
  };

  onInputSubmit = e => {
    e.preventDefault();

    const newValue = parseInt(this.state.inputValue);

    if (this._isValid(newValue)) {
      this.props.onChange(newValue);
    } else {
      this.setState({
        inputValue: this.props.current
      });
    }
  };

  render() {
    const { rowSize, onRowSizeChange, ...paginationProps } = this.props;

    const { inputValue } = this.state;

    return (
      <div className={style.paginationContainer} {...paginationProps}>
        <div className={style.pagination}>
          <span className={style.paginationTextStyling}>Show rows</span>
          <div className="floatL">
            <Dropdown
              id="pagination"
              setTitle={true}
              title={rowSize}
              options={pageSizeOptions}
              onSelect={value => onRowSizeChange(value)}
              className="paginationDropdown"
            />
          </div>
        </div>

        <div className={style.pagination}>
          <span className={style.paginationTextStyling}>Go to</span>
          <div style={{ float: "floatL" }} className={style.paginationCount}>
            <form onSubmit={this.onInputSubmit}>
              <input
                type="text"
                value={inputValue}
                onChange={this.onInputChange}
                onBlur={this.onInputBlur}
              />
            </form>
          </div>

          <div className={classnames(style.paginationTextStyling)}>of {this.calcPage()}</div>
          <div className={style.prevNextButtons}>
            <div className={style.prevButton} onClick={this.prev}>
              <Icon type="left_triangle" />
            </div>
            <div className={style.nextButton} onClick={this.next}>
              <Icon type="right_triangle" />
            </div>
            <div className="clear" />
          </div>
          <div className="clear" />
        </div>
        <div className="clear" />
      </div>
    );
  }
}

export default Pagination;

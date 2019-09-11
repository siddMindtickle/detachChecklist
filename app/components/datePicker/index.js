import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import moment from "moment";

import DatePicker from "antd/lib/date-picker";
import { noop } from "@utils";
import "antd/lib/date-picker/style/css";
import style from "./index.scss";

/**
 * DatePicker provided by ant-design takes in a moment object and returns the same.
 * This DatePicker takes in an epoch value and returns an epoch value onChange or onOk
 */
export default class CustomDatePicker extends Component {
  static propTypes = {
    value: PropTypes.number,
    className: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = {
    onChange: noop
  };

  onChange = date => {
    this.props.onChange(+date);
  };

  render() {
    const { value, className } = this.props;
    return (
      <DatePicker
        {...this.props}
        className={classnames(style.datePicker, className)}
        showTime={false}
        allowClear={false}
        value={value ? moment(value) : undefined}
        onChange={this.onChange}
      />
    );
  }
}

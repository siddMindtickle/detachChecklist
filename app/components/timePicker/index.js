import React, { Component } from "react";
import PropTypes from "prop-types";
import TimePicker from "antd/lib/time-picker";

import "antd/lib/time-picker/style/css";
import moment from "moment";

/**
 * DatePicker provided by ant-design takes in a moment object and returns the same.
 * This DatePicker takes in an epoch value and returns an epoch value onChange or onOk
 */
export default class CustomTimePicker extends Component {
  static propTypes = {
    value: PropTypes.number,
    className: PropTypes.string,
    onChange: PropTypes.func
  };

  onChange = time => {
    this.props.onChange && this.props.onChange(+time);
  };

  render() {
    const { value, className } = this.props;
    return (
      <TimePicker
        {...this.props}
        className={className}
        allowEmpty={false}
        value={value ? moment(value) : undefined}
        onChange={this.onChange}
      />
    );
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { isString, hasValue } from "@utils";

import style from "./index.scss";
const noop = () => undefined;
const MAX_INT = 9999999;

class Input extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maxLength: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    className: PropTypes.string,
    maxLengthClassName: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    max: PropTypes.number,
    min: PropTypes.number,
    type: PropTypes.oneOf(["text", "number", "password", "file"]),
    errors: PropTypes.array,
    fontSize: PropTypes.number
  };
  static defaultProps = {
    onChange: noop,
    onFocus: noop,
    errors: [],
    type: "text"
  };

  state = {};

  handleValue = value => {
    value = hasValue(value) ? value : "";
    const trimmedValue = isString(value) ? value.trim() : value;
    value = trimmedValue.length ? value : trimmedValue;
    const { maxLength, max, min, type } = this.props;
    if (type == "number") {
      if (!value) return min || 0;
      return max < value || min > value ? this.state.value : value;
    }

    if (maxLength) {
      return maxLength <= value.length ? value : value.substring(0, maxLength);
    }
    return value;
  };

  onPaste = event => {
    if (this.props.type == "number") event.preventDefault();
  };

  onChange = event => {
    const { onChange } = this.props;
    const value = this.handleValue(event.target.value);
    this.setState({ value });
    onChange(event, value);
  };

  moveCaretAtEnd = e => {
    var temp_value = e.target.value;
    e.target.value = "";
    e.target.value = temp_value;
    this.props.onFocus(e);
  };

  componentWillMount() {
    const { value = "" } = this.props;
    this.setState({ value: this.handleValue(value) });
  }

  componentWillReceiveProps(newProps) {
    const { value } = this.props;
    let { value: newValue } = newProps;
    if (newValue !== value) {
      this.setState({ value: this.handleValue(newValue) });
    }
  }

  render() {
    const { name, type, errors, maxLength, className, maxLengthClassName, ...rest } = this.props;
    const { value } = this.state;
    return (
      <div className={classnames("posRelative", style.displayInline)}>
        <input
          {...rest}
          key={name}
          name={name}
          value={value}
          type={type}
          maxLength={maxLength || MAX_INT}
          onChange={this.onChange}
          onFocus={this.moveCaretAtEnd}
          onPaste={this.onPaste}
          autoComplete={"off"}
          className={classnames(style.input, className)}
        />
        <div
          key="maxLength"
          className={classnames(
            { [style.counterStyle]: maxLength, displayN: !maxLength },
            maxLengthClassName
          )}
        >
          {maxLength && maxLength - value.length}
        </div>
        <div key="error" className={classnames(errors[0] ? style.error : "displayN")}>
          {errors[0]}
        </div>
      </div>
    );
  }
}
export default Input;

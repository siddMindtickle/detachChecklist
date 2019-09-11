import React, { Component } from "react";
import PropTypes from "prop-types";
import { isUndefined } from "@utils";
const noop = () => undefined;
class Radio extends Component {
  static propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    label: PropTypes.string
  };

  static defaultProps = {
    name: "radio",
    type: "radio",
    value: "radioBtnValue",
    checked: false,
    onChange: noop,
    onClick: noop
    // radioBtnValue: ''
  };

  render() {
    const { name, type, value, checked, onChange, onClick, label } = this.props;
    return (
      <div>
        <input
          key={"radio"}
          name={name}
          type={type}
          value={value}
          checked={checked}
          onChange={onChange}
          onClick={onClick}
        />
        {!isUndefined(label) && <label>{label}</label>}
      </div>
    );
  }
}

export default Radio;

import React, { Component } from "react";
import PropTypes from "prop-types";
import ToggleButton from "react-toggle-button";

class Toggle extends Component {
  static propTypes = {
    onToggle: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired
  };

  state = {
    checked: !!this.props.checked
  };

  onToggle = () => {
    const { checked } = this.state;
    this.setState({ checked: !checked });
    this.props.onToggle(!checked);
  };
  render() {
    const { checked } = this.state;
    const { onToggle, checked: checkedProp, ...rest } = this.props; //eslint-disable-line
    return (
      <ToggleButton
        {...rest}
        value={checked}
        onToggle={this.onToggle}
        colors={{
          activeThumb: {
            base: "rgb(255, 255, 255)"
          },
          inactiveThumb: {
            base: "rgb(255, 255, 255)"
          },
          inactive: {
            base: "rgb(199, 199, 199)",
            hover: "rgb(199, 199, 199)"
          },
          active: {
            base: "rgb(70, 200, 87)",
            hover: "rgb(70, 200, 87)"
          }
        }}
      />
    );
  }
}
export default Toggle;

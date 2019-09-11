import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "@components/button";
// import style from "./index.scss";

export default class SubmitButton extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    submit: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    buttonType: PropTypes.string,
    form: PropTypes.object,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    children: "Submit",
    buttonType: "PrimaryLg",
    className: "",
    disabled: false
  };

  onClick = event => {
    event.preventDefault();
    if (this.props.disabled) return;
    this.props.form.submit();
  };

  render() {
    return (
      <Button
        key="button"
        tabIndex={10}
        name={this.props.name}
        onClick={this.onClick}
        type={this.props.buttonType}
        disabled={this.props.disabled}
        className={this.props.className}
      >
        {this.props.children}
      </Button>
    );
  }
}

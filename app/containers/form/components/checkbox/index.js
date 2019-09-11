import React, { Component } from "react";
import PropTypes from "prop-types";

import Checkbox from "@components/checkbox";

import withValidation from "../../utils/withValidation";

class CheckboxWithValidation extends Component {
  static propTypes = {
    name: PropTypes.string,
    form: PropTypes.object,
    update: PropTypes.func
  };

  static defaultProps = {
    form: {},
    className: ""
  };

  onClick = () => {
    this.props.update({
      value: !this.props.form.state[this.props.name].value,
      errors: this.props.form.state[this.props.name].errors
    });
  };

  render() {
    const { form, name, ...rest } = this.props;
    const checkboxValue = form.state[name] || {};
    const checked = checkboxValue.value;
    return <Checkbox onClick={this.onClick} checked={checked} name={name} {...rest} />;
  }
}

export default withValidation(CheckboxWithValidation);

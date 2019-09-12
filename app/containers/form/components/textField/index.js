import React, { Component } from "react";
import PropTypes from "prop-types";

import classnames from "classnames";
import style from "./index.scss";
import withValidation from "../../utils/withValidation";

import Input from "@components/input";

class TextField extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    form: PropTypes.object,
    update: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.string
  };

  static defaultProps = {
    type: "text",
    value: ""
  };

  updateValueInStore = value => {
    const { form: { state = {} } = {}, name } = this.props;
    const errors = state[name] ? state[name].errors : [];
    this.props.update({
      value,
      errors
    });
  };

  onBlur = event => {
    this.updateValueInStore(event.target.value);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.updateValueInStore(nextProps.value);
    }
  }

  componentDidMount() {
    const { value } = this.props;
    value && this.updateValueInStore(value);
  }

  render() {
    return (
      <Input
        key="input"
        type={this.props.type}
        name={this.props.name}
        placeholder={this.props.placeholder}
        onBlur={this.onBlur}
        label={this.props.label}
        className={classnames(this.props.className || "", style.inputStyle)}
        errors={
          this.props.form.state[this.props.name] && this.props.form.state[this.props.name].errors
        }
        onChange={this.props.onChange}
        value={this.props.value}
        {...this.props}
      />
    );
  }
}

export default withValidation(TextField);

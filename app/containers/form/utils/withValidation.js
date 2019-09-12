import React, { Component } from "react";
import PropTypes from "prop-types";

import * as validator from "./validator";

export default function withValidation(WrappedComponent) {
  class ValidatorComponent extends Component {
    static propTypes = {
      validate: PropTypes.arrayOf(PropTypes.string),
      form: PropTypes.object,
      name: PropTypes.string.isRequired
    };

    static defaultProps = {
      validate: [],
      form: {}
    };

    static initialState = { value: null, errors: [] };

    update = ({ value, errors }) => {
      this.props.form.update(this.props.name, { value, errors });
    };

    isValid = showError => {
      const {
        form: { state },
        name
      } = this.props;
      const errors = this.props.validate.reduce((status, validatorName) => {
        let validationError = validator[validatorName](state[name].value);
        if (validationError) {
          status = status.concat([validationError]);
        }
        return status;
      }, []);
      if (showError) {
        this.update({
          value: state[name].value,
          errors
        });
      }
      return !errors.length;
    };
    UNSAFE_componentWillMount() {
      this.removeValidation = this.props.form.registerValidation(showError =>
        this.isValid(showError)
      );
      if (!this.props.form.state[this.props.name]) {
        this.update(ValidatorComponent.initialState);
      }
    }

    componentWillUnmount() {
      this.removeValidation();
    }

    render() {
      return <WrappedComponent update={this.update} {...this.props} />;
    }
  }
  return ValidatorComponent;
}

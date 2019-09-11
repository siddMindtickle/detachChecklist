import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";

import { injectReducer, getActions } from "@core/helpers";

import { without } from "@utils";

import { ERROR_HIDE_DURATION } from "./config/constants";
import reducer from "./reducer";
import { RESET, RESET_ERROR, UPDATE } from "./actionTypes";

const noop = () => undefined;

class Form extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    update: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    resetError: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func,
    formsData: PropTypes.object,
    className: PropTypes.string
  };

  validations = [];

  registerValidation = isValidFunc => {
    this.validations = [...this.validations, isValidFunc];
    return this.removeValidation.bind(null, isValidFunc);
  };

  removeValidation = ref => {
    this.validations = without(this.validations, ref);
  };

  isFormValid = showErrors => {
    const isValid = this.validations.reduce((memo, isValidFunc) => {
      return isValidFunc(showErrors) && memo;
    }, true);
    return isValid;
  };

  submit = () => {
    if (this.isFormValid(true)) {
      this.props.onSubmit({
        ...this.props.formsData
      });
    } else {
      window.setTimeout(this.props.resetError, ERROR_HIDE_DURATION);
    }
  };

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        form: {
          registerValidation: this.registerValidation,
          isFormValid: this.isFormValid,
          submit: this.submit,
          reset: this.props.reset,
          update: this.props.update,
          state: this.props.formsData || {}
        }
      })
    );

    return (
      <div>
        <form
          onKeyDown={this.props.onKeyDown ? this.props.onKeyDown : noop}
          autoComplete="off"
          className={this.props.className}
        >
          {childrenWithProps}
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    formsData: state.forms[ownProps.name] || {},
    ...ownProps
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    reset: () => {
      dispatch(getActions(RESET)(null, { formName: ownProps.name }));
    },
    resetError: () => {
      dispatch(getActions(RESET_ERROR)(null, { formName: ownProps.name }));
    },
    update: (name, { value, errors }) => {
      dispatch(
        getActions(UPDATE)(
          {
            name,
            value,
            errors
          },
          { formName: ownProps.name }
        )
      );
    }
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({ name: "forms", reducer: reducer });

export default compose(
  withReducer,
  withConnect
)(Form);

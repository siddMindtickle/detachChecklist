import React, { Component } from "react";
import PropTypes from "prop-types";
import classname from "classnames";

import { isString } from "@utils";
import Button, { BUTTON_TYPES } from "@components/button";
import Icon from "@components/icon";

import "./index.scss";

export default function(WrapComponent, buttonProps = {}) {
  const newButtonProps = {
    primaryName: "ok",
    secondaryName: "cancel",
    primaryType: BUTTON_TYPES.PRIMARY_ROUND,
    secondaryType: BUTTON_TYPES.DEFAULT_ROUND,
    primaryChild: <Icon type="tick" />,
    secondaryChild: <Icon type="close" />,
    ...buttonProps,
    primaryClassname: classname("marginL5", buttonProps.primaryClassname),
    secondaryClassname: classname("marginL5", buttonProps.secondaryClassname)
  };

  class WrappedComponent extends Component {
    static propTypes = {
      ok: PropTypes.func.isRequired,
      cancel: PropTypes.func.isRequired,
      className: PropTypes.string,
      componentClassName: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      allowEmpty: PropTypes.bool
    };

    static defaultProps = {
      allowEmpty: true
    };

    state = {
      newValue: this.props.value || ""
    };

    onChange = event => {
      this.setState({ newValue: event.target.value });
    };

    onOk = () => {
      let newValue = this.state.newValue;
      newValue = isString(newValue) ? newValue.trim() : newValue;
      this.props.ok(newValue);
    };

    onCancel = () => {
      this.props.cancel();
    };

    checkIfDisabled = () => {
      const { value, allowEmpty } = this.props;
      let newValue = this.state.newValue;
      newValue = isString(newValue) ? newValue.trim() : newValue;
      return newValue === value || !(allowEmpty || newValue);
    };

    render() {
      const { className, componentClassName, ...rest } = this.props;
      let { newValue } = this.state;
      return (
        <div className={className}>
          <WrapComponent
            {...rest}
            value={newValue}
            onChange={this.onChange}
            className={componentClassName}
          />
          <span className="withBtns">
            <Button
              name={newButtonProps.primaryName}
              type={newButtonProps.primaryType}
              disabled={this.checkIfDisabled()}
              onClick={this.onOk}
              className={newButtonProps.primaryClassname}
            >
              {newButtonProps.primaryChild}
            </Button>
            <Button
              name={newButtonProps.secondaryName}
              type={newButtonProps.secondaryType}
              onClick={this.onCancel}
              className={newButtonProps.secondaryClassname}
            >
              {newButtonProps.secondaryChild}
            </Button>
          </span>
        </div>
      );
    }
  }

  return WrappedComponent;
}

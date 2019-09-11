import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import style from "./index.scss";

export default function(WrapComponent) {
  class WrappedComponent extends Component {
    static propTypes = {
      label: PropTypes.string.isRequired,
      position: PropTypes.oneOf(["left", "right", "top"]),
      childProps: PropTypes.object,
      className: PropTypes.string,
      labelClassName: PropTypes.string
    };
    static defaultProps = {
      childProps: {},
      position: "top"
    };
    render() {
      const { label, position, childProps, className, labelClassName } = this.props;
      return (
        <div className={className}>
          <label className={classnames(style.labelStyle, position, labelClassName)}>{label}</label>
          <WrapComponent {...childProps} />
        </div>
      );
    }
  }
  return WrappedComponent;
}

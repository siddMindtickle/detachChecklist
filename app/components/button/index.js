import React, { Component } from "react";
import PropTypes from "prop-types";

import classnames from "classnames";
import style from "./index.scss";

const noop = () => undefined;

export const BUTTON_TYPES = {
  PRIMARY_SM: "PrimarySm",
  DEFAULT_SM: "DefaultSm",
  YELLOW_SM: "YellowBtnSm",
  PRIMARY_LG: "PrimaryLg",
  DEFAULT_LG: "DefaultLg",
  YELLOW_LG: "YellowBtnLg",
  PRIMARY_ROUND: "PrimaryRoundBtn",
  DEFAULT_ROUND: "DefaultRoundBtn",
  OK_SM: "OkBtnSm",
  PRIMARY_NEW_SM: "PrimaryNewSm",
  DEFAULT_NEW_SM: "DefaultNewSm",
  PRIMARY_SM_BORDER: "PrimarySmBorder"
};

class Button extends Component {
  static propTypes = {
    name: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(Object.values(BUTTON_TYPES)),
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool
  };
  static defaultProps = {
    onClick: noop,
    type: "Primary",
    children: "Submit",
    disabled: false
  };

  getBtnStyle = type => {
    switch (type) {
      case BUTTON_TYPES.PRIMARY_SM:
        return `${style.primaryBtnSm} ${style.smbtn}`;
      case BUTTON_TYPES.PRIMARY_SM_BORDER:
        return `${style.primaryBtnSmBorder} ${style.smbtn}`;
      case BUTTON_TYPES.DEFAULT_SM:
        return `${style.defaultBtnSm} ${style.smbtn}`;
      case BUTTON_TYPES.YELLOW_SM:
        return `${style.yellowBtnLg} ${style.smbtn}`;
      case BUTTON_TYPES.PRIMARY_LG:
        return `${style.primaryBtnLg} ${style.lgbtn}`;
      case BUTTON_TYPES.DEFAULT_LG:
        return `${style.defaultBtnLg} ${style.lgbtn}`;
      case BUTTON_TYPES.YELLOW_LG:
        return `${style.yellowBtnLg} ${style.lgbtn}`;
      case BUTTON_TYPES.PRIMARY_ROUND:
        return `${style.roundBtn} ${style.primaryBtn}`;
      case BUTTON_TYPES.DEFAULT_ROUND:
        return `${style.roundBtn} ${style.defaultBtn}`;
      case BUTTON_TYPES.OK_SM:
        return style.okBtnSm;
      case BUTTON_TYPES.PRIMARY_NEW_SM:
        return `${style.smNewBtn} ${style.primaryNewSm}`;
      case BUTTON_TYPES.DEFAULT_NEW_SM:
        return `${style.smNewBtn} ${style.defaultNewSm}`;
      default:
        return "";
    }
  };

  render() {
    return (
      <button
        disabled={this.props.disabled}
        name={this.props.name}
        onClick={this.props.onClick}
        className={classnames(
          this.getBtnStyle(this.props.type),
          this.props.className,
          style.commonButtonStyle
        )}
      >
        {this.props.children}
        {/* <Icon type="close" className={classnames(style.icon)} /> */}
      </button>
    );
  }
}
export default Button;

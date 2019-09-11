import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { MT_MODULES } from "@config/global.config";

import "./index.scss";
const ModuleTypeMap = {
  [MT_MODULES.CHECKLIST]: "L",
  [MT_MODULES.ILT]: "I",
  [MT_MODULES.COURSE]: "C",
  [MT_MODULES.UPDATE]: "Q",
  [MT_MODULES.MISSION]: "M",
  [MT_MODULES.ASSESSMENT]: "A",
  [MT_MODULES.COACHING]: "S"
};

export const ICON_SIZES = {
  SMALL: "Small",
  MEDIUM: "Medium"
};

export default class ModuleIcon extends Component {
  static propTypes = {
    moduleType: PropTypes.oneOf(Object.values(MT_MODULES)),
    className: PropTypes.string,
    size: PropTypes.oneOf(Object.values(ICON_SIZES))
  };

  static defaultProps = {
    size: ICON_SIZES.MEDIUM
  };

  render() {
    const { moduleType, className, size } = this.props;
    return (
      <span
        key="moduleType"
        className={classnames(
          `color-${ModuleTypeMap[moduleType]}`,
          "moduleIcon",
          `moduleIcon-${size}`,
          className
        )}
      >
        {ModuleTypeMap[moduleType]}
      </span>
    );
  }
}

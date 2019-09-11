import React, { Component } from "react";
import PropTypes from "prop-types";
import Toggle from "@components/toggle";

import classnames from "classnames";
import style from "./index.scss";

class ScoreBox extends Component {
  static propTypes = {
    children: PropTypes.array,
    className: PropTypes.string,
    headerText: PropTypes.string,
    checked: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired
  };
  render() {
    const { children, onToggle, checked } = this.props;
    return (
      <div
        key="scoring"
        className={classnames(
          style.scoreWrapper,
          "floatL",
          "marginB25",
          "boxStyle",
          this.props.className
        )}
      >
        <div className={style.box_headingSection}>
          <div className={style.box_heading}>{this.props.headerText}</div>
        </div>
        <div className="marginT15">
          <Toggle onToggle={onToggle} checked={checked} />
        </div>
        {children}
      </div>
    );
  }
}
export default ScoreBox;

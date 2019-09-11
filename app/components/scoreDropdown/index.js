import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Dropdown from "@components/dropdown";
import Info from "@components/info";
import "./index.scss";
import { scoreOptions } from "./constants";

class ScoreDropdown extends Component {
  static propTypes = {
    infoText: PropTypes.string,
    options: PropTypes.array,
    isOpen: PropTypes.bool,
    disabled: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };
  static defaultProps = {
    infoText: "dummy text",
    options: scoreOptions,
    isOpen: false
  };

  state = {
    isOpen: this.props.isOpen
  };
  render() {
    const { infoText, options, isOpen, disabled, title } = this.props;
    const isOpenDD = isOpen ? "isOpenDD" : "isClosedDD";
    return (
      <span className={classnames("scoreDropdown", { isOpenDD })}>
        <span className="roundDropdown">
          <Dropdown
            {...this.props}
            title={title || "Off"}
            options={options}
            horizontal={true}
            noCaret={true}
            setTitle={true}
            className="scoreDropdownStyle"
            isOpen={isOpen}
          />
        </span>
        <span className={classnames("points", "marginR5", disabled && "disabled")}>pts</span>
        <Info content={infoText} className="ptsInfo" />
      </span>
    );
  }
}
export default ScoreDropdown;

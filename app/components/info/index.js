import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Tooltip from "antd/lib/tooltip";

import Icon from "@components/icon";
import "antd/lib/tooltip/style/css";
import "./index.scss";

class InfoIcon extends Component {
  static propTypes = {
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
    icon: PropTypes.string,
    iconClassName: PropTypes.string,
    className: PropTypes.string,
    node: PropTypes.node,
    trigger: PropTypes.string,
    placement: PropTypes.string
  };

  static defaultProps = {
    icon: "info",
    trigger: "hover",
    placement: "bottom"
  };

  render() {
    const { iconClassName, icon, content, node, className, ...overlayProps } = this.props;
    return (
      <Tooltip
        {...overlayProps}
        overlayClassName={classnames(className, "infoOverlay")}
        title={content}
        autoAdjustOverflow={true}
      >
        <div className="infoIcon">
          {node || <Icon type={icon} className={classnames(iconClassName)} />}
        </div>
      </Tooltip>
    );
  }
}

export default InfoIcon;

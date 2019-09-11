import React, { Component } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

import Icon from "@components/icon";

import style from "./index.scss";

export default class Notify extends Component {
  static propTypes = {
    content: PropTypes.node.isRequired,
    className: PropTypes.string,
    close: PropTypes.bool,
    iconType: PropTypes.string
  };
  static defaultProps = {
    close: false
  };
  state = {
    closed: false
  };
  render() {
    const { close, content, className, iconType } = this.props;
    const { closed } = this.state;
    if (closed) return null;
    return (
      <div className={classnames(style.notify, className)}>
        {iconType && (
          <div className={style.notifyIcon}>
            <Icon type={iconType} />
          </div>
        )}
        <div className={style.notifyContent}>{content}</div>
        {close && (
          <div
            className={style.notifyCloseButton}
            onClick={() => {
              this.setState({ closed: true });
            }}
          >
            <Icon type="close" />
          </div>
        )}
        <div className="clear" />
      </div>
    );
  }
}

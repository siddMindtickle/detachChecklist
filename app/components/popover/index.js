import React, { Component } from "react";
import PropTypes from "prop-types";
import Popover from "react-bootstrap/lib/Popover";
import Icon from "@mindtickle/mt-ui-components/Icon";
import { isFunction } from "@utils";

import style from "./index.scss";

const noop = () => undefined;
class CustomPopover extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    close: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    className: PropTypes.string
  };
  static defaultProps = {
    close: false,
    placement: "bottom"
  };
  render() {
    let { close, ...rest } = this.props;
    close = close ? (isFunction(close) ? close : noop) : close;
    return (
      <div className={style.popoverWrapper} key="popOver">
        <Popover {...rest}>
          {close && (
            <div className={style.closeIcon} onClick={close}>
              <Icon type="close" tabIndex={10} />
            </div>
          )}
          {this.props.children}
        </Popover>
      </div>
    );
  }
}
export default CustomPopover;

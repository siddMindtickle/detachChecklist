import React, { Component } from "react";
import PropTypes from "prop-types";

import GetHelp from "@components/getHelp";
import style from "./index.scss";

export default function(WrapComponent) {
  class WrappedComponent extends Component {
    static propTypes = {
      componentClassName: PropTypes.string,
      title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
      ])
    };

    render() {
      const { title, componentClassName, ...rest } = this.props;
      return (
        <WrapComponent
          {...rest}
          className={componentClassName}
          title={
            <div className="clearfix">
              <GetHelp className={style.helpIcon} />
              <div className={style.titleStyle}>{title}</div>
            </div>
          }
        />
      );
    }
  }
  return WrappedComponent;
}

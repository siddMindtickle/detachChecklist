import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import style from "./index.scss";

const LOADING_STYLE = {
  sizeBig: style.big,
  sizeXSmall: style.xsmall,
  sizeSmall: style.small
};

const LOADER_STYLE = {
  Small: style.smallPageLoadingScreen,
  Full: style.fullPageloadingScreen
};

class Loader extends Component {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(["Full", "Small"]),
    size: PropTypes.oneOf(["sizeBig", "sizeSmall", "sizeXSmall"]),
    message: PropTypes.string,
    loadingMessage: PropTypes.string,
    vCenter: PropTypes.bool
  };
  static defaultProps = {
    type: "Small",
    size: "sizeBig"
  };

  render() {
    const { className, message, vCenter, size, type } = this.props;
    const wrapperClasses = classnames(
      { centerDiv: vCenter },
      LOADER_STYLE[type],
      style.loader,
      className
    );
    return (
      <div className={wrapperClasses}>
        <div className={style.loadingHeading}>{this.props.loadingMessage}</div>
        <div className={classnames(style.spinner, LOADING_STYLE[size])}>
          <div className={style.bounce1} />
          <div className={style.bounce2} />
          <div className={style.bounce3} />
        </div>
        <p>{message}</p>
      </div>
    );
  }
}

export default Loader;

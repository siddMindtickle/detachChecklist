import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import style from "./index.scss";

const Loader = props => (
  <div className={props.className}>
    <div className={classnames(style.delayLoader, props.classNameLoader)} />
  </div>
);
Loader.propTypes = {
  className: PropTypes.string,
  classNameLoader: PropTypes.string
};

export default Loader;

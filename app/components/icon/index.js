import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const noop = () => undefined;
export default class Icon extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func
  };
  static defaultProps = {
    onClick: noop
  };
  render() {
    const { type, className, onClick } = this.props;
    return <span className={classnames(`icon-${type}`, className)} onClick={onClick} />;
  }
}

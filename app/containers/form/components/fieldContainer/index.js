import React, { Component } from "react";
import PropTypes from "prop-types";

class FieldContainer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };
  static defaultProps = {
    className: ""
  };
  renderChildren = () => {
    const { children, className, ...rest } = this.props;
    const childElements = React.Children.map(children, child => {
      if (child)
        return React.cloneElement(child, {
          ...rest
        });
      return child;
    });
    return <div className={className}>{childElements}</div>;
  };
  render() {
    return this.renderChildren();
  }
}

export default FieldContainer;

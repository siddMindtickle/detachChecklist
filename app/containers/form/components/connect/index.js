import React, { Component } from "react";
import PropTypes from "prop-types";

class Connect extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    form: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };
  static defaultProps = {
    className: "",
    form: {}
  };
  update = (fieldName, { value, errors }) => {
    this.props.form.update(fieldName, { value, errors });
    this.props.onChange(fieldName, { value, errors });
  };
  renderChildren = () => {
    const { children, className, form, ...rest } = this.props;
    const childElements = React.Children.map(children, child =>
      React.cloneElement(child, {
        ...rest,
        form: {
          ...form,
          update: this.update
        }
      })
    );
    return <div className={className}>{childElements}</div>;
  };
  render() {
    return this.renderChildren();
  }
}

export default Connect;

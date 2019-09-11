import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

class InnerHTML extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
    className: PropTypes.string
  };
  componentDidMount() {
    document.querySelectorAll(`#${this.props.id} script`).forEach(script => {
      window.eval(script.text);
    });
  }
  render() {
    const { id, className, content } = this.props;
    return (
      <div
        id={id}
        className={classnames(className)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
}

export default InnerHTML;

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
    let elements = document.querySelectorAll(`#${this.props.id} script`);

    for (let i = 0; i < elements.length; i++) {
      window.eval(elements[i].text);
    }
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

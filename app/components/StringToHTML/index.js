import React from "react";
import PropTypes from "prop-types";

class StringToHTML extends React.Component {
  static propTypes = {
    content: PropTypes.any
  };
  static defaultProps = {
    content: "dsadsadasd"
  };
  render() {
    let { content } = this.props;
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
}

export default StringToHTML;

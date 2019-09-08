import React, { Component } from "react";
import PropTypes from "prop-types";
import PublishDraft from "@containers/modulePublish";
import PublishHistory from "@containers/moduleUpdate";

import { noop } from "@utils";

class Publish extends Component {
  static propTypes = {
    isPublished: PropTypes.bool,
    onPublish: PropTypes.func
  };

  static defaultProps = {
    onPublish: noop
  };

  render() {
    const { isPublished, onPublish, ...restProps } = this.props;
    return isPublished ? (
      <PublishHistory onPublish={onPublish} {...restProps} />
    ) : (
      <PublishDraft onPublish={onPublish} {...restProps} />
    );
  }
}

export default Publish;

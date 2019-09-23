import React from "react";
import { Card } from "antd";
import PropTypes from "prop-types";
import MtMedia from "@components/mtMedia";
const { Meta } = Card;

class Overview extends React.Component {
  static propTypes = {
    title: PropTypes.any.isRequired,
    description: PropTypes.node,
    medias: PropTypes.array.isRequired
  };

  static defaultProps = {
    medias: []
  };
  getDescription() {
    return (
      <div>
        {this.props.description}
        <MtMedia medias={this.props.medias} />
      </div>
    );
  }
  render() {
    return (
      <Meta
        className="paddingL20 paddingR20 F13 lineHeight18"
        title={<div className="F13 bold lineHeight18">{this.props.title}</div>}
        description={this.getDescription()}
      />
    );
  }
}

export default Overview;

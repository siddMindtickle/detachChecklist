import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

export default function(WrapComponent) {
  class WrappedComponent extends Component {
    static propTypes = {
      moduleName: PropTypes.string.isRequired,
      moduleType: PropTypes.string.isRequired,
      tabName: PropTypes.string.isRequired
    };

    render() {
      const { moduleType, tabName } = this.props;
      return [
        <Helmet key="pageTitle" title={`${tabName} - ${moduleType}`} />,
        <WrapComponent key="component" {...this.props} />
      ];
    }
  }
  return WrappedComponent;
}

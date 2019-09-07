import React, { Component } from "react";
import PropTypes from "prop-types";

import CoreLayout from "~/components/CoreLayout";
import Routes from "~/config/Routes";

const headerMenuItems = [
  { label: "Test", to: Routes.test },
  { label: "Another Route", to: "/random" }
];

class Layout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return <CoreLayout headerMenuItems={headerMenuItems}>{this.props.children}</CoreLayout>;
  }
}

export default Layout;

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import AntLayout from "@mt-ui-components/Layout";
import Menu from "@mt-ui-components/Menu";

const { Header, Content, Footer } = AntLayout;

class Layout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    headerMenuItems: PropTypes.array
  };

  static defaultProps = {
    headerMenuItems: []
  };

  render() {
    return (
      <AntLayout>
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["0"]}
            style={{ lineHeight: "64px" }}
          >
            {this.props.headerMenuItems.map((menuItem, index) => (
              <Menu.Item key={index}>
                <Link to={menuItem.to}>{menuItem.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px", marginTop: 64 }}>{this.props.children}</Content>
        <Footer style={{ textAlign: "center" }}>© Mindtickle</Footer>
      </AntLayout>
    );
  }
}

export default Layout;

import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Navbar from "react-bootstrap/lib/Navbar";
import Nav from "react-bootstrap/lib/Nav";
import NavItem from "react-bootstrap/lib/NavItem";
import { Link } from "react-router-dom";

import style from "./index.scss";

const TabItems = ({ path, label, active, onLinkClick }) => {
  return (
    <li role="presentation" className={active ? "active" : ""}>
      <Link to={path} onClick={onLinkClick}>
        <div className={style.leftsideText}>{label}</div>
        <div className={style.clear} />
      </Link>
    </li>
  );
};

TabItems.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onLinkClick: PropTypes.func
};

export class Tabbing extends Component {
  static propTypes = {
    links: PropTypes.array.isRequired,
    activeIndex: PropTypes.number
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  render() {
    const { links } = this.props;

    return (
      <div className={classnames(style.sidebar, "tabbing-container")}>
        <Navbar>
          <Nav>
            {links.map((link, index) => {
              if (link.border) {
                return (
                  <NavItem className={style.customSeparator} key={`link-${index}`}>
                    <div className={style.seperator} />
                  </NavItem>
                );
              }

              const isActive = link.path === location.pathname;
              // const isActive = false;

              return <TabItems {...link} key={`link-${index}`} active={isActive} />;
            })}
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default Tabbing;

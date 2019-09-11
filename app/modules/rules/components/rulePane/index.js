import React from "react";
import PropTypes from "prop-types";

// components
import { NavItem } from "react-bootstrap";
import Status from "../status";

// constants
import { RULE_STATUS } from "../../config/constants";

// styles
import style from "./index.scss";
import classname from "classnames";

const Pane = ({ name, description, status, isActive }) => (
  <div className={style.paneContainer}>
    <div className={style.paneInfo}>
      <div className={style.paneName}>{name}</div>
      {isActive && <Status active={status} showAsTooltip />}
    </div>
    {description && <div className={style.paneDesc}>{description}</div>}
  </div>
);

Pane.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  createdAt: PropTypes.number,
  createdBy: PropTypes.string,
  status: PropTypes.oneOf(Object.values(RULE_STATUS)),
  isActive: PropTypes.bool
};

const RuleItem = ({ ruleId, isActivePane, data, ...otherProps }) => {
  const items = [<Pane key={ruleId} {...data} />];
  isActivePane && items.push(<div key="arrowLeft" className={style.arrowLeft} />);
  return (
    <NavItem
      {...otherProps}
      key={ruleId}
      eventKey={ruleId}
      className={classname(style.ruleItem, {
        [style.ruleItemActive]: isActivePane
      })}
    >
      {items}
    </NavItem>
  );
};

RuleItem.propTypes = {
  ruleId: PropTypes.string.isRequired,
  data: PropTypes.object,
  isActivePane: PropTypes.bool
};

export default RuleItem;

import React from "react";
import PropTypes from "prop-types";
import classname from "classnames";

import Tooltip from "@components/info";

import { RULE_STATUS, STATUS_CONFIG } from "../../config/constants";

import style from "./index.scss";

const Status = ({ active, className, showDisplayName }) => {
  return (
    <div
      className={classname(
        style.statusContainer,
        { [style.isActive]: active === RULE_STATUS.ACTIVE },
        className
      )}
    >
      <div className={style.stIcon} />
      {showDisplayName && (
        <span className={style.stDisplayName}>{STATUS_CONFIG[active].displayName}</span>
      )}
    </div>
  );
};

Status.propTypes = {
  active: PropTypes.oneOf(Object.keys(RULE_STATUS)),
  className: PropTypes.string,
  showDisplayName: PropTypes.bool
};

const StatusContainer = ({ showAsTooltip, active, ...restProps }) => {
  const statusProps = { active, ...restProps };
  return showAsTooltip ? (
    <Tooltip content={STATUS_CONFIG[active].displayInfo} node={<Status {...statusProps} />} />
  ) : (
    <Status {...statusProps} />
  );
};

StatusContainer.propTypes = {
  showAsTooltip: PropTypes.bool,
  ...Status.propTypes
};

export default StatusContainer;

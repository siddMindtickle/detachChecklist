import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import style from "./index.scss";

import { LEARNERS_CONFIG } from "../../config/constants";

const MenuItem = ({ type, onViewClick, count, showViewOption }) => {
  const { text, subText } = LEARNERS_CONFIG[type].getOptions(count);
  return (
    <div className={style.inviteOption}>
      <div
        className={classnames("inviteOption--cont", {
          inviteOption__disabled: !count
        })}
      >
        <div className="inviteOption--title">{text}</div>
        {showViewOption && (
          <div
            className={classnames("inviteOption--view", "link")}
            data-type={type}
            onClick={onViewClick}
          >
            View
          </div>
        )}
      </div>
      <div className="inviteOption--subtitle">{subText}</div>
    </div>
  );
};

MenuItem.propTypes = {
  count: PropTypes.number,
  type: PropTypes.string,
  onViewClick: PropTypes.func,
  showViewOption: PropTypes.bool
};

export default MenuItem;

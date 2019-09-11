import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Toggle from "@components/toggle";
import { GENERAL_SETTINGS_OPTIONS } from "../../config/constants";

import style from "./index.scss";

const { SEQUENTIAL_ORDERING } = GENERAL_SETTINGS_OPTIONS;

const SequentialLocking = ({ sequentialLock, onUpdate }) => {
  return (
    <div key="taskSequence" className={classnames("boxStyle", style.taskSequence)}>
      <div className={style.headerSection}>
        <div className={style.heading}>Unlock Tasks In a Sequence</div>
      </div>
      <div className={style.sequenceTextStyle}>
        If ON, the Learner has to complete the previous Tasks to mark the next Task complete.
      </div>
      <div className="marginT15">
        <Toggle
          onToggle={value => onUpdate(SEQUENTIAL_ORDERING, value)}
          checked={!!sequentialLock}
        />
      </div>
    </div>
  );
};

SequentialLocking.propTypes = {
  sequentialLock: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default SequentialLocking;

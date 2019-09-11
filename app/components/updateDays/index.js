import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import withRoundButtons from "@hocs/withButtons";
import Input from "@components/input";
import style from "./index.scss";

const UpdateDays = props => {
  return (
    <div className={style.ud_updateDays}>
      <div className={classnames("clearfix", style.ud_top)}>
        <div className="floatL">
          <Input
            type="number"
            max={365}
            min={1}
            name="editDays"
            {...props}
            className={style.ud_input}
          />
        </div>
        <div className={style.ud_daysText}>day(s)</div>
      </div>
      <div className={style.ud_daysTextDesc}>(Enter between 1-365)</div>
    </div>
  );
};
UpdateDays.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default withRoundButtons(UpdateDays);

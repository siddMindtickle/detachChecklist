import React from "react";
import Icon from "@components/icon";

import style from "./index.scss";

const BuildNoData = () => {
  return (
    <div className={style.buildNoLearner} key="buildNoLearner">
      <p>Start with adding the first Task or Section</p>
      <Icon type="ES_Build" className={style.icon} />
    </div>
  );
};

export default BuildNoData;

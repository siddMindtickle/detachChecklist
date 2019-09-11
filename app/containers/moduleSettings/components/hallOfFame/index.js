import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { SCORING_SETTINGS_OPTIONS } from "../../config/constants";
import ScoreBox from "../../components/scoreBox";

import style from "./index.scss";

const { HALL_OF_FAME } = SCORING_SETTINGS_OPTIONS;

const HallOfFame = ({ hallOfFame, onToggle }) => {
  return (
    <ScoreBox
      key="hallfame"
      headerText="Hall of fame"
      className={classnames("marginR20", style.scoreWrapper)}
      checked={hallOfFame}
      onToggle={value => {
        onToggle(HALL_OF_FAME, value);
      }}
    />
  );
};

HallOfFame.propTypes = {
  hallOfFame: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default HallOfFame;

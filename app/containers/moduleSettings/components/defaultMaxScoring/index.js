import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import ScoreDropdown from "@components/scoreDropdown";

import { SCORING_SETTINGS_OPTIONS, SETTING_MESSAGE } from "../../config/constants";
import ScoreBox from "../../components/scoreBox";

import style from "./index.scss";

const { DEFAULT_SCORE } = SCORING_SETTINGS_OPTIONS;

const DefaultMaxScoring = ({ scoring, score, onSelect, onToggle }) => {
  return (
    <ScoreBox
      key="defaultTask"
      headerText="Default Scoring on Task"
      className={classnames("marginR20", style.scoreWrapper)}
      checked={scoring}
      onToggle={value => {
        onToggle(DEFAULT_SCORE, value);
      }}
    >
      {scoring
        ? [
            <div className={style.divider} key="divider_scoring" />,
            <div className={style.headingSection} key="score_heading">
              <div className={style.heading}>Default Max Score On Task Completion</div>
            </div>,
            <ScoreDropdown
              key="score_dropdown"
              id="settings_score_dd"
              infoText={SETTING_MESSAGE.INFO.SCORE}
              onSelect={value => onSelect(DEFAULT_SCORE, value)}
              disabled={!scoring}
              title={score}
            />
          ]
        : []}
    </ScoreBox>
  );
};

DefaultMaxScoring.propTypes = {
  scoring: PropTypes.bool.isRequired,
  score: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default DefaultMaxScoring;

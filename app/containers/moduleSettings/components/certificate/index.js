import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Dropdown from "@components/dropdown";

import { SCORING_SETTINGS_OPTIONS, CUTOFF_OPTIONS } from "../../config/constants";
import ScoreBox from "../../components/scoreBox";

import style from "./index.scss";

const { CERTIFICATE } = SCORING_SETTINGS_OPTIONS;

const Certicate = ({ certificate, cutoff, onSelect, onToggle }) => {
  return (
    <ScoreBox
      key="certificateCutoff"
      headerText="Certificate"
      className={classnames("marginR20", style.scoreWrapper)}
      checked={certificate}
      onToggle={value => {
        onToggle(CERTIFICATE, value);
      }}
    >
      {certificate && [
        <div className={style.divider} key="divider_certificate" />,
        <div className={style.headingSection} key="certificateDropdown">
          <div className={style.heading}>Certificate Cut-off</div>
          <Dropdown
            title={cutoff + "%"}
            setTitle={true}
            onSelect={value => onSelect(CERTIFICATE, value)}
            disabled={!certificate}
            className="ss_customDropdownStyle"
            options={CUTOFF_OPTIONS}
            id="breadcrumb_dd_scoring"
          />
        </div>
      ]}
    </ScoreBox>
  );
};

Certicate.propTypes = {
  certificate: PropTypes.bool.isRequired,
  cutoff: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default Certicate;

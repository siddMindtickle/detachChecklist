import React, { Component } from "react";
import PropTypes from "prop-types";

import { STATIC, SETTINGS, SCORING_SETTINGS_OPTIONS } from "../../config/constants";

import DefaultMaxScoring from "../../components/defaultMaxScoring";
import DefaultSessionScoring from "../../components/defaultSessionScoring";
import HallOfFame from "../../components/hallOfFame";
import Certificate from "../../components/certificate";

const {
  DEFAULT_SCORE,
  DEFAULT_SESSION_SCORE,
  CERTIFICATE,
  HALL_OF_FAME
} = SCORING_SETTINGS_OPTIONS;

class Scoring extends Component {
  static propTypes = {
    className: PropTypes.string,
    settings: PropTypes.object.isRequired,
    details: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    enableSettings: PropTypes.array
  };

  static defaultProps = {
    enableSettings: ["DEFAULT_SCORE"]
  };

  isEnabled = settingType => {
    return this.props.enableSettings.includes(settingType);
  };

  onSelect = (type, value) => {
    const { update } = this.props;
    switch (type) {
      case DEFAULT_SCORE:
      case DEFAULT_SESSION_SCORE:
        update({ type: STATIC, score: value });
        break;
      case CERTIFICATE:
        update({ type: SETTINGS, passingScore: { ...value } });
        break;
    }
  };

  onToggle = (type, value) => {
    const { update } = this.props;
    switch (type) {
      case DEFAULT_SCORE:
      case DEFAULT_SESSION_SCORE:
        update({ type: STATIC, scoring: value });
        break;
      case CERTIFICATE:
        update({ type: SETTINGS, certificate: value });
        break;
      case HALL_OF_FAME:
        update({ type: STATIC, hallOfFame: value });
    }
  };

  render() {
    const {
      details: { scoring, score, hallOfFame },
      settings: {
        certificate,
        passingScore: { value: cutoff }
      }
    } = this.props;
    return [
      this.isEnabled("DEFAULT_SCORE") && (
        <DefaultMaxScoring
          key="defaultScoring"
          scoring={scoring}
          score={score}
          onSelect={this.onSelect}
          onToggle={this.onToggle}
        />
      ),
      this.isEnabled("DEFAULT_SESSION_SCORE") && (
        <DefaultSessionScoring
          key="defaultSessionScoring"
          scoring={scoring}
          score={score}
          onSelect={this.onSelect}
          onToggle={this.onToggle}
        />
      ),
      this.isEnabled("CERTIFICATE") && (
        <Certificate
          key="certificate"
          certificate={certificate}
          cutoff={cutoff}
          onSelect={this.onSelect}
          onToggle={this.onToggle}
        />
      ),
      this.isEnabled("HALL_OF_FAME") && (
        <HallOfFame key="hallOfFame" hallOfFame={hallOfFame} onToggle={this.onToggle} />
      )
    ];
  }
}
export default Scoring;

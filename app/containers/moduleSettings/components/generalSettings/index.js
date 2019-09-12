import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Description from "@components/description";

import Tags from "@containers/tags";
import Thumbnail from "@containers/thumbnail";

import SequentialLocking from "../../components/sequentialLocking";
import SettingTupleCard from "../../components/settingTupleCard";

import { STATIC, GENERAL_SETTINGS_OPTIONS, GENERAL_SETTINGS_KEY_MAP } from "../../config/constants";
import { deepEqual } from "@utils";

import style from "./index.scss";

const { DESCRIPTION, THUMBNAIL } = GENERAL_SETTINGS_OPTIONS;

class GeneralSetting extends Component {
  static propTypes = {
    taggingEnabled: PropTypes.bool.isRequired,
    moduleRelevanceEnabled: PropTypes.bool.isRequired,
    update: PropTypes.func.isRequired,
    details: PropTypes.object.isRequired,
    seriesId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    enableSettings: PropTypes.array,
    sequentiallyLockedSeries: PropTypes.bool.isRequired
  };

  state = {
    details: this.props.details
  };

  static defaultProps = {
    enableSettings: ["DESCRIPTION", "THUMBNAIL", "TAGS", "SEQUENTIAL_ORDERING", "MODULE_RELEVANCE"]
  };

  isEnabled = settingType => {
    return this.props.enableSettings.includes(settingType);
  };

  onUpdate = (type, value) => {
    const { update } = this.props;

    let newStateObject = {};

    newStateObject[GENERAL_SETTINGS_KEY_MAP[type]] = value;

    this.setState({ details: { ...this.state.details, ...newStateObject } });

    newStateObject["type"] = STATIC;
    update(newStateObject);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!deepEqual(nextProps.details, this.state.details)) {
      this.setState({
        details: nextProps.details
      });
    }
  }

  render() {
    const {
      taggingEnabled,
      seriesId,
      moduleRelevanceEnabled,
      sequentiallyLockedSeries
    } = this.props;
    const {
      description,
      sequentialLock,
      companyId,
      id: moduleId,
      name,
      type,
      thumb,
      defaultThumb,
      multipleEnrollment,
      learnerCnfSsnEmail,
      restrictLearnerEnroll,
      showLearnerTimezone,
      moduleRelevance
    } = this.state.details;

    return [
      this.isEnabled("DESCRIPTION") && (
        <div
          key="description"
          className={classnames("floatL marginR20 boxStyle", style.description)}
        >
          <Description
            id="moduleDescription"
            heading="Description"
            preview={true}
            maxLength={1000}
            ok={value => this.onUpdate(DESCRIPTION, value)}
            content={description}
            placeholder="Type here..."
          />
        </div>
      ),

      this.isEnabled("THUMBNAIL") && (
        <Thumbnail
          key="thumbnail"
          className={classnames(style.thumbnailBlock)}
          companyId={companyId}
          defaultThumb={defaultThumb}
          appliedThumb={thumb}
          update={value => this.onUpdate(THUMBNAIL, value)}
        />
      ),

      this.isEnabled("TAGS") &&
        taggingEnabled && (
          <Tags
            key="tags"
            moduleId={moduleId}
            seriesId={seriesId}
            companyId={companyId}
            moduleName={name}
            moduleType={type}
            className={classnames("boxStyle marginR20", style.tagBlock)}
          />
        ),

      this.isEnabled("SEQUENTIAL_ORDERING") && (
        <SequentialLocking
          key="sequentialLocking"
          sequentialLock={sequentialLock}
          onUpdate={this.onUpdate}
        />
      ),
      this.isEnabled("MULTIPLE_ENROLLMENT") && (
        <SettingTupleCard
          className={style.customCard}
          key="multipleEnrollment"
          cardType="MULTIPLE_ENROLLMENT"
          checked={!!multipleEnrollment}
          onUpdate={this.onUpdate}
        />
      ),
      this.isEnabled("LEARNER_CNF_SSN_EMAIL") && (
        <SettingTupleCard
          className={style.customCard}
          key="learnerCnfSsnEmail"
          cardType="LEARNER_CNF_SSN_EMAIL"
          checked={!!learnerCnfSsnEmail}
          onUpdate={this.onUpdate}
        />
      ),
      this.isEnabled("RESTRICT_LEARNER_ENROLL") && (
        <SettingTupleCard
          className={style.customCard}
          key="restrictLearnerEnroll"
          cardType="RESTRICT_LEARNER_ENROLL"
          checked={!!restrictLearnerEnroll}
          onUpdate={this.onUpdate}
        />
      ),
      this.isEnabled("SHOW_LEARNER_TIMEZONE") && (
        <SettingTupleCard
          className={style.customCard}
          key="showLearnerTimezone"
          cardType="SHOW_LEARNER_TIMEZONE"
          value={showLearnerTimezone}
          onUpdate={this.onUpdate}
        />
      ),
      this.isEnabled("MODULE_RELEVANCE") &&
        moduleRelevanceEnabled && (
          <SettingTupleCard
            className={classnames("boxStyle marginR20", style.tagBlock)}
            key="moduleRelevance"
            cardType="MODULE_RELEVANCE"
            value={moduleRelevance}
            onUpdate={this.onUpdate}
            extraConfig={{ sequentialLockedSeries: sequentiallyLockedSeries }}
          />
        ),
      <div key="clearfix-gs" className="clearfix" />
    ];
  }
}
export default GeneralSetting;

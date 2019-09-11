import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Info from "@components/info";
import Toggle from "@components/toggle";
import { Radio, Icon } from "@mindtickle/mt-ui-components";
import ModuleRelevanceInfoPopupContent from "@components/moduleRelevanceInfoPopupContent";

import { GENERAL_SETTINGS_OPTIONS, CARD_DETAILS, SELECTOR_TYPE } from "../../config/constants";

import style from "./index.scss";

const getToggleSwitch = (settingToToggle, checked, onUpdate) => {
  return <Toggle onToggle={value => onUpdate(settingToToggle, value)} checked={!!checked} />;
};

const getRadioOptions = (settingToSelect, options, currentValue, onUpdate, extraConfig) => {
  const allOptions = options.map(option => {
    return (
      <div key={option.value}>
        <Radio
          className={style.radioOptionStyle}
          value={option.value}
          checked={option.value === currentValue}
        >
          <span className={style.radioTextStyle}>{option.optionText} </span>
        </Radio>
        {option.value === currentValue &&
          option.optionWarning &&
          option.optionWarningConditional &&
          extraConfig[option.optionWarningConditional] && (
            <div id={"conditionalOptionWarning"} className={style.infoBox}>
              <Icon type={option.optionWarning.iconType} className={style.iconStyle} />
              <div className={style.noteText}>{option.optionWarning.text}</div>
            </div>
          )}
      </div>
    );
  });

  return (
    <div className={style.radioStyleWrapper}>
      <Radio.Group
        className={style.radioGroupStyle}
        value={currentValue}
        onChange={e => onUpdate(settingToSelect, e.target.value)}
      >
        {allOptions}
      </Radio.Group>
    </div>
  );
};

const showInfo = info => {
  const allInfoComponents = {
    ModuleRelevanceInfo: ModuleRelevanceInfoPopupContent
  };

  if (!info) return;

  const { type, content } = info;
  let infoContent = "";
  let InfoComponent = "";
  switch (type) {
    case "text":
    case "node":
      infoContent = content;
      break;
    case "component":
      InfoComponent = allInfoComponents[content || "foo"];
      infoContent = <InfoComponent />;
      break;
  }

  return (
    <div>
      <Info
        iconClassName={style.infoIconContainer}
        content={infoContent}
        className={style.infoOverlay}
      />
    </div>
  );
};

const SettingTupleCard = ({ cardType, onUpdate, checked, value, className, extraConfig }) => {
  const { header, desc, options, selectorType, info, footer } = CARD_DETAILS[cardType];

  let settingSelector;

  switch (selectorType) {
    case SELECTOR_TYPE.RADIO_OPTIONS:
      settingSelector = getRadioOptions(
        GENERAL_SETTINGS_OPTIONS[cardType],
        options,
        value,
        onUpdate,
        extraConfig
      );
      break;
    case SELECTOR_TYPE.TOGGLE_SWITCH:
      settingSelector = getToggleSwitch(GENERAL_SETTINGS_OPTIONS[cardType], checked, onUpdate);
      break;
  }

  return (
    <div key="taskSequence" className={classnames("boxStyle", style.wrapper, className)}>
      <div className={style.headerSection}>
        <div className={style.heading}>{header}</div>
        {showInfo(info)}
      </div>
      {desc && <div className={style.textStyle}>{desc}</div>}
      <div className="marginT15">{settingSelector}</div>
      {footer}
    </div>
  );
};

SettingTupleCard.propTypes = {
  cardType: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
  className: PropTypes.string,
  value: PropTypes.any,
  extraConfig: PropTypes.object
};

export default SettingTupleCard;

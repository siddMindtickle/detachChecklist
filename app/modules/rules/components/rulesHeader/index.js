import React from "react";
import PropTypes from "prop-types";
import classname from "classnames";

//hocs
import withContext from "../../hocs/withModuleContext";

// components
import { Switch as RuleSwitch } from "antd";
import Info from "@components/info";

// styles
import style from "./index.scss";

// constants
import {
  OPERATIONS,
  RULE_STATUS,
  STATUS_CONFIG,
  AR_LEFT_HEADER,
  AR_MAIN_SWITCH_DISABLED
} from "../../config/constants";

// assets
import automationBot from "../../assets/automation-bot.svg";

const MainSwitchWithInfo = ({
  toggleRulesStatus,
  checked,
  loading,
  disabled,
  switchDisplayText,
  switchInfoText
}) => {
  return (
    <div className={style.mainSwitch}>
      <RuleSwitch
        className="msSwitch"
        checked={checked}
        onChange={toggleRulesStatus}
        loading={loading}
        disabled={disabled}
      />
      <span className={style.msTitle}>{switchDisplayText}</span>
      <Info content={switchInfoText} />
    </div>
  );
};

MainSwitchWithInfo.propTypes = {
  toggleRulesStatus: PropTypes.func,
  checked: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  switchDisplayText: PropTypes.string,
  switchInfoText: PropTypes.string
};

const Header = ({
  className,
  status,
  toggleRulesStatus,
  operationStatus: { data: { operation } = {}, isLoading },
  context: {
    actions: { TOGGLE_MAIN_SWITCH: toggleMainSwitch }
  }
}) => {
  const loading = operation === OPERATIONS.UPDATE_MAIN_SWITCH && isLoading;
  const isActive = status === RULE_STATUS.ACTIVE;
  const { switchDisplay, switchInfo, accessDeniedInfo } = STATUS_CONFIG[status];
  const mainSwitchAccessDenied = !toggleMainSwitch;
  const switchInfoText = mainSwitchAccessDenied ? accessDeniedInfo : switchInfo;

  return (
    <div className={classname(style.rulesHeaderContainer, className)}>
      <div className={style.rulesHeader}>
        <div className={style.headerInfo}>
          <img src={automationBot} className={style.headerIcon} />
          <div className={style.headerTitle}>{AR_LEFT_HEADER}</div>
        </div>
        <MainSwitchWithInfo
          toggleRulesStatus={toggleRulesStatus}
          checked={isActive}
          loading={loading}
          disabled={mainSwitchAccessDenied}
          switchDisplayText={switchDisplay}
          switchInfoText={switchInfoText}
        />
      </div>
      {!isActive && (
        <div className={style.inActiveWarning}>
          <div className={style.arrowTop} />
          {AR_MAIN_SWITCH_DISABLED}
        </div>
      )}
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string,
  status: PropTypes.string,
  operationStatus: PropTypes.object,
  toggleRulesStatus: PropTypes.func,
  context: PropTypes.object
};

export default withContext(Header);

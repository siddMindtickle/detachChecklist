import React, { Component } from "react";
import PropTypes from "prop-types";
import classname from "classnames";

// components
import Condition from "./components/condition";
import Action from "./components/action";

// constants
import { RULE_TABS as TABS, TAB_CONFIG } from "./constants";

import style from "./index.scss";

const RuleTab = ({ tab }) => {
  const { title, description } = TAB_CONFIG[tab];
  return (
    <div className={style.ruleViewerTab}>
      <div className={style.tabTitleContainer}>
        <span className={style.tabTitle}>{title}</span>
      </div>
      <div className={style.tabDescription}>{description}</div>
    </div>
  );
};

RuleTab.propTypes = { tab: PropTypes.oneOf(Object.values(TABS)) };

class RuleViewer extends Component {
  static propTypes = {
    conditions: PropTypes.object,
    actions: PropTypes.object
  };

  renderAction = (action, index) => <Action action={action} key={`action-${index}`} />;

  renderCondition = (condition, index) => {
    const { type, ...props } = condition;
    return <Condition key={`condition-${index}`} type={type} condition={props} />;
  };

  renderConditions() {
    const {
      conditions: { data }
    } = this.props;
    return (
      <div className={style.ruleBlockContainer}>
        <ul className={classname(style.tree, style.conditionList)}>
          {data.map(this.renderCondition)}
        </ul>
      </div>
    );
  }

  renderActions() {
    const {
      actions: { data }
    } = this.props;
    return (
      <div className={style.ruleBlockContainer}>
        <ul className={classname(style.tree)}>{data.map(this.renderAction)}</ul>
      </div>
    );
  }

  renderConditionsBlock() {
    return (
      <div className={style.ruleTabsHeader}>
        <RuleTab tab={TABS.CONDITION} />
        {this.renderConditions()}
      </div>
    );
  }

  renderActionsBlock() {
    return (
      <div className={style.ruleTabsHeader}>
        <RuleTab tab={TABS.ACTION} />
        {this.renderActions()}
      </div>
    );
  }

  render() {
    return (
      <div className={style.ruleViewer}>
        {this.renderConditionsBlock()}
        {this.renderActionsBlock()}
      </div>
    );
  }
}

export default RuleViewer;

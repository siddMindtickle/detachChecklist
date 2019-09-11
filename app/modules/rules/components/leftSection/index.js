import React, { Component } from "react";
import PropTypes from "prop-types";
import classname from "classnames";

import { Nav, Row, Col, Tab } from "react-bootstrap";
import TabCont from "../tabContent";
import Header from "../rulesHeader";
import RulePane from "../rulePane";

import { OPERATIONS, RULE_STATUS } from "../../config/constants";

import style from "./index.scss";
import "antd/lib/switch/style/css";

import noRulesPlaceholder from "../../assets/no-rules-placeholder.svg";
import GetSupport from "@containers/getSupport";

class LeftSection extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.string).isRequired,
    rules: PropTypes.object,
    status: PropTypes.string,
    ruleStatus: PropTypes.object,
    operationStatus: PropTypes.object,
    fetchRule: PropTypes.func,
    manipulateData: PropTypes.func
  };

  static defaultProps = {
    operationStatus: {}
  };

  state = {
    activeTab: this.props.data[0]
  };

  handleSelect = activeKey => {
    this.setState({ activeTab: activeKey });
  };

  renderNavItem = ruleId => {
    const {
      rules: { [ruleId]: ruleData }
    } = this.props;
    return (
      <RulePane
        key={ruleId}
        ruleId={ruleId}
        data={ruleData}
        isActivePane={ruleId === this.state.activeTab}
      />
    );
  };

  renderTabPane = ruleId => {
    const {
      rules: { [ruleId]: ruleData },
      ruleStatus,
      fetchRule,
      manipulateData,
      operationStatus
    } = this.props;
    return (
      <Tab.Pane key={`tabPane-${ruleId}`} eventKey={ruleId}>
        <TabCont
          {...ruleStatus}
          id={ruleId}
          data={ruleData}
          fetchRule={fetchRule}
          manipulateRule={manipulateData}
          operationStatus={operationStatus}
        />
      </Tab.Pane>
    );
  };

  toggleRulesStatus = checked =>
    this.props.manipulateData({
      operation: OPERATIONS.UPDATE_MAIN_SWITCH,
      status: checked ? RULE_STATUS.ACTIVE : RULE_STATUS.INACTIVE
    });

  renderRules() {
    return (
      <Tab.Container
        id="rulesTab"
        className={style.rulesTabContainer}
        activeKey={this.state.activeTab}
        onSelect={this.handleSelect}
      >
        <Row>
          <Col className={style.leftCol}>
            <div className={style.leftColListWrapper}>
              <Nav className={style.rulesList} bsStyle="pills" stacked>
                {this.props.data.map(this.renderNavItem)}
              </Nav>
            </div>
          </Col>
          <Col className={style.rightCol}>
            <Tab.Content animation mountOnEnter unmountOnExit>
              {this.props.data.map(this.renderTabPane)}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
  }

  renderEmptyState() {
    return (
      <div className={classname(style.emptyContainer, "centerDiv")}>
        <img className="" src={noRulesPlaceholder} />
        <div className={style.emptyInfoText}>
          <span>There are no Automation Rules. Please </span>
          <GetSupport
            initiator="contact Support"
            className={classname(style.contactSupportLink, "link")}
          />
          <span> to create some!</span>
        </div>
      </div>
    );
  }

  render() {
    const hasRules = !!this.props.data.length;
    return (
      <div
        className={classname(style.leftSection, {
          [style.sectionEmpty]: !hasRules
        })}
      >
        <Header
          className={classname({ [style.leftHeader]: hasRules })}
          status={this.props.status}
          operationStatus={this.props.operationStatus}
          toggleRulesStatus={this.toggleRulesStatus}
        />
        {hasRules ? this.renderRules() : this.renderEmptyState()}
      </div>
    );
  }
}

export default LeftSection;

import React, { Component } from "react";
import PropTypes from "prop-types";
import classname from "classnames";

import Loader from "@components/loader";
import TabHeader from "../tabHeader";
import RuleViewer from "../ruleViewer";
import { OPERATIONS } from "../../config/constants";

import style from "./index.scss";

import ruleFailLoad from "../../assets/ruleLoadFail.png";

class TabContent extends Component {
  static propTypes = {
    id: PropTypes.string,
    data: PropTypes.object,
    operationStatus: PropTypes.object,
    isLoading: PropTypes.bool,
    loaded: PropTypes.bool,
    hasError: PropTypes.bool,
    fetchRule: PropTypes.func,
    manipulateRule: PropTypes.func
  };

  state = {
    isLoading: true,
    operationStatus: {}
  };

  componentDidMount() {
    this.handleRuleFetch();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isLoading !== nextProps.isLoading) {
      this.setState({ isLoading: nextProps.isLoading });
    }
  }

  handleRuleManipulate = data => {
    this.props.manipulateRule({
      operation: OPERATIONS.UPDATE_RULE,
      id: this.props.id,
      ...data
    });
  };

  handleRuleFetch = () => this.props.fetchRule(this.props.id);

  renderRuleHeader() {
    const {
      data: { status, name, description, createdBy, createdAt },
      operationStatus
    } = this.props;
    const headerProps = {
      name,
      description,
      status,
      createdBy,
      createdAt,
      operationStatus
    };
    return <TabHeader {...headerProps} manipulateRule={this.handleRuleManipulate} />;
  }

  renderRuleBody() {
    const {
      data: { conditions, actions }
    } = this.props;
    return <RuleViewer conditions={conditions} actions={actions} />;
  }

  renderBody() {
    return (
      <div>
        {this.renderRuleHeader()}
        {this.renderRuleBody()}
      </div>
    );
  }

  renderError() {
    return (
      <div className={classname(style.tabContentError, "centerDiv")}>
        <img src={ruleFailLoad} className={style.tabContErrImage} />
        <p className={style.tabContErrDesc}>Something went wrong!</p>
        <p>
          Failed to load the rule.{" "}
          <span className="link" onClick={this.handleRuleFetch}>
            Try Again
          </span>
        </p>
      </div>
    );
  }

  render() {
    const { isLoading } = this.state;
    if (this.props.hasError) {
      return this.renderError();
    }
    return !isLoading ? this.renderBody() : <Loader />;
  }
}

export default TabContent;

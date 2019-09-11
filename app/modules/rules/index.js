import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Loader from "@components/loader";
import LeftSection from "./components/leftSection";
import ModuleContext from "./components/ModuleContext";

import { getActions, injectSaga, injectReducer } from "@core/helpers";

import rulesReducer from "./reducer";
import rulesSaga from "./saga";

import { getAllowedActionsByPermissions } from "./utils";

import { LOAD_DATA, FETCH_RULE, MANIPULATE_DATA } from "./actionTypes";

import style from "./index.scss";

class AutomationRules extends Component {
  static propTypes = {
    loadData: PropTypes.func,
    fetchRule: PropTypes.func,
    manipulateData: PropTypes.func,
    isLoading: PropTypes.bool,
    loaded: PropTypes.bool,
    status: PropTypes.object,
    rules: PropTypes.object,
    data: PropTypes.array,
    ruleStatus: PropTypes.object,
    operationStatus: PropTypes.object,
    auth: PropTypes.object
  };

  moduleContext = {
    actions: getAllowedActionsByPermissions(this.props.auth.permissions)
  };

  componentDidMount() {
    this.props.loadData();
  }

  renderComponent() {
    const {
      data,
      rules,
      status: { status },
      ruleStatus,
      operationStatus,
      fetchRule,
      manipulateData
    } = this.props;
    return (
      <ModuleContext.Provider value={this.moduleContext}>
        <div className={style.rulesContainer}>
          <LeftSection
            data={data}
            rules={rules}
            status={status}
            ruleStatus={ruleStatus}
            operationStatus={operationStatus}
            fetchRule={fetchRule}
            manipulateData={manipulateData}
          />
        </div>
      </ModuleContext.Provider>
    );
  }

  render() {
    return this.props.loaded ? this.renderComponent() : <Loader />;
  }
}

const mapStateToProps = ({ automationRules, auth: { data: auth } }) => ({
  isLoading: automationRules.isLoading,
  loaded: automationRules.loaded,
  status: automationRules.status,
  data: automationRules.data,
  rules: automationRules.rules,
  ruleStatus: automationRules.ruleStatus,
  operationStatus: automationRules.operationStatus,
  auth
});

const mapDispatchToProps = dispatch => {
  return {
    loadData: () => dispatch(getActions(LOAD_DATA)()),
    fetchRule: ruleId => dispatch(getActions(FETCH_RULE)({ ruleId })),
    manipulateData: options => dispatch(getActions(MANIPULATE_DATA)(options))
  };
};

const withReducer = injectReducer({
  name: "automationRules",
  reducer: rulesReducer
});
const withSaga = injectSaga({ name: "automationRules", saga: rulesSaga });
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withReducer,
  withSaga,
  withConnect
)(AutomationRules);

import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// import classnames from "classnames";

import { injectReducer, injectSaga, getActions } from "@core/helpers";

import { MANIPULATE_DATA, GET_REMINDER_DATA } from "./actionTypes";
import saga from "./saga";
import reducer from "./reducer";

import ReminderTable from "./components/reminderTable";
import Loader from "@components/loader";

import { OPERATIONS, MESSAGES } from "./config/constants";
import { showConfirmBox } from "@utils/alert";

const { UPDATE, ADD, REMOVE } = OPERATIONS;
class Reminders extends Component {
  static propTypes = {
    className: PropTypes.string,
    loaded: PropTypes.bool,
    isLoading: PropTypes.bool,
    hasError: PropTypes.bool,
    mailTemplates: PropTypes.object,
    mailReminders: PropTypes.object,
    learnerStatus: PropTypes.object,
    seriesLevelMailSettings: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
    manipulateData: PropTypes.func.isRequired,
    operationStatus: PropTypes.shape({
      loaded: PropTypes.bool,
      isLoading: PropTypes.bool,
      hasError: PropTypes.bool
    }),
    moduleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    companyId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };

  static defaultProps = {
    operationStatus: {},
    mailTemplates: {},
    mailReminders: {},
    learnerStatus: {}
  };

  state = {};
  updateReminder = (reminderId, data) => {
    this.manipulateData({ operation: UPDATE, reminderId, ...data });
  };
  deleteReminder = (reminderId, data) => {
    const callback = () => {
      this.manipulateData({ operation: REMOVE, reminderId, ...data });
    };
    if (this.props.mailReminders[reminderId]) {
      return showConfirmBox(MESSAGES.REMOVE_CONFIRMATION, {
        callback: confirmed => {
          confirmed && callback();
        }
      });
    }
    return callback();
  };
  createReminder = data => {
    this.manipulateData({ operation: ADD, ...data });
  };
  manipulateData = data => {
    const { moduleId, seriesId, companyId, manipulateData } = this.props;
    manipulateData({ moduleId, seriesId, companyId, ...data });
  };
  getTableData = () => {
    const { mailTemplates, mailReminders, learnerStatus } = this.props;
    const response = {};
    Object.keys(learnerStatus).forEach(learnerStatusId => {
      response[learnerStatusId] = {
        name: learnerStatus[learnerStatusId].name,
        multipleReminders: learnerStatus[learnerStatusId].multipleReminders,
        id: learnerStatusId,
        displayIndex: learnerStatus[learnerStatusId].displayIndex,
        data: []
      };
    });
    for (const [id, reminder] of Object.entries(mailReminders)) {
      if (reminder) {
        const { learnerStatusId, templateId, type, value, displayValue, mailJobId } = reminder;
        response[learnerStatusId].data.push({
          id,
          type,
          value,
          displayValue,
          templateId,
          mailJobId,
          templateName:
            (templateId && mailTemplates[templateId] && mailTemplates[templateId].name) ||
            mailTemplates["0"].name
        });
      }
    }
    return Object.values(response).sort((a, b) => a.displayIndex - b.displayIndex);
  };

  UNSAFE_componentWillReceiveProps() {}
  componentDidMount() {
    const { loaded, getData, moduleId, seriesId, companyId } = this.props;
    !loaded && getData({ moduleId, seriesId, companyId });
  }

  render() {
    const { mailTemplates, loaded, hasError, isLoading, seriesLevelMailSettings } = this.props;

    return [
      loaded &&
        !hasError && (
          <ReminderTable
            key="remindertable"
            data={this.getTableData()}
            mailTemplates={mailTemplates}
            updateReminder={this.updateReminder}
            deleteReminder={this.deleteReminder}
            createReminder={this.createReminder}
            seriesLevelMailSettings={seriesLevelMailSettings}
          />
        ),
      isLoading && <Loader key="loader" />
    ];
  }
}
const mapStateToProps = (state, ownProps) => {
  const {
    loaded,
    isLoading,
    hasError,
    mailTemplates,
    mailReminders,
    learnerStatus,
    operationStatus
  } = state.moduleReminders;
  const { moduleId, seriesId, companyId } = ownProps;
  return {
    loaded,
    isLoading,
    hasError,
    moduleId,
    seriesId,
    companyId,
    mailTemplates,
    mailReminders,
    learnerStatus,
    operationStatus
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getData: data => {
      dispatch(getActions(GET_REMINDER_DATA)(data));
    },
    manipulateData: data => {
      dispatch(getActions(MANIPULATE_DATA)(data));
    }
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({ name: "moduleReminders", reducer });
const withSaga = injectSaga({ name: "moduleReminders", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(Reminders);

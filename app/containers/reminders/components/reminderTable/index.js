import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Dropdown from "@components/dropdown";
import Icon from "@components/icon";
import { DataTable, Column } from "@components/dataTable";
import Notify from "@components/notify";
import Info from "@components/info";

import { deepEqual } from "@utils";
import UpdateDays from "@components/updateDays";
import UpdateDateTime from "@components/updateDateTime";
import {
  REMINDER_TYPE_OPTIONS_DISPLAY_NAME,
  REMINDER_TYPE_DEFAULT_VALUE,
  REMINDER_TYPES,
  EMAIL_SETTINGS_WARNING_MESSAGES,
  MESSAGES,
  DEFAULT_VALUE,
  TEMPLATE_ID_DEFAULT_VALUE
} from "../../config/constants";

import style from "./index.scss";

const LearnerStatus = ({ data, rowIndex }) => {
  return <div className={style.commonLineHeight}>{data[rowIndex] && data[rowIndex].name}</div>;
};
LearnerStatus.propTypes = {
  data: PropTypes.array.isRequired,
  rowIndex: PropTypes.number
};

class ReminderCell extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    rowIndex: PropTypes.number,
    deleteReminder: PropTypes.func.isRequired,
    createReminder: PropTypes.func.isRequired,
    updateReminder: PropTypes.func.isRequired,
    updateReminderState: PropTypes.func.isRequired
  };

  getReminderValues = (reminderType, index) => {
    const { data: propAllReminder, rowIndex } = this.props;
    const reminderDefaultValue = REMINDER_TYPE_DEFAULT_VALUE(reminderType);
    const propsReminder = propAllReminder[rowIndex].data[index] || {};

    if (reminderType === propsReminder.type) {
      return {
        value: propsReminder.value,
        displayValue: propsReminder.displayValue
      };
    }
    return {
      ...reminderDefaultValue
    };
  };

  onToggleEditMode = (reminderType, index, edit) => {
    const { rowIndex, updateReminderState, data: allReminders } = this.props;
    const reminder = allReminders[rowIndex].data[index] || {};
    const reminderValues = this.getReminderValues(reminderType, index);

    if (!reminder.id && !edit) {
      this.deleteReminder(index);
      return;
    }

    reminder.edit = edit;
    reminder.type = reminderType;
    allReminders[rowIndex].data[index] = { ...reminder, ...reminderValues };
    updateReminderState(allReminders);
  };

  addReminder = () => {
    const { rowIndex, updateReminderState, data: allReminders } = this.props;
    allReminders[rowIndex].data.push({
      id: null,
      type: null,
      value: null,
      templateId: TEMPLATE_ID_DEFAULT_VALUE(allReminders[rowIndex].id)
    });
    updateReminderState(allReminders);
  };

  deleteReminder = index => {
    const { deleteReminder, rowIndex, updateReminderState, data: allReminders } = this.props;
    const { id, ...data } = allReminders[rowIndex].data[index] || {};

    if (id) {
      deleteReminder(id, data);
    } else {
      allReminders[rowIndex].data = allReminders[rowIndex].data.filter((val, i) => i !== index);
      updateReminderState(allReminders);
    }
  };

  updateCreateReminder = (value, index) => {
    const { rowIndex, updateReminder, createReminder, data: allReminders } = this.props;
    const { id, type, templateId } = allReminders[rowIndex].data[index] || {};
    const params = {
      learnerStatusId: allReminders[rowIndex].id,
      type,
      value,
      templateId
    };
    id ? updateReminder(id, params) : createReminder(params);
  };

  updateComponentByType = ({ type, displayValue, index }) => {
    return (
      <div
        className={style.rt_calendarValue}
        onClick={() => this.onToggleEditMode(type, index, true)}
      >
        <div className={style.rt_editicon}>
          <Icon type="edit" className="pointer" />
        </div>
        <div className={style.rt_valueStyle}>{displayValue}</div>
        <div className="clear" />
      </div>
    );
  };

  editComponentByType = ({ type, value, index }) => {
    let Component;
    let componentProps = {};
    switch (type) {
      case REMINDER_TYPES.AFTER_DAYS:
      case REMINDER_TYPES.AFTER_DAYS_START:
        Component = UpdateDays;
        componentProps = { type: "number", name: "number" };
        break;
      case REMINDER_TYPES.EPOCH:
        Component = UpdateDateTime;
        componentProps = { showTime: true, showToday: false };
        break;
      default:
        Component = null;
    }
    return (
      <Component
        {...componentProps}
        ok={value => {
          this.updateCreateReminder(value, index);
          this.onToggleEditMode(type, index, false);
        }}
        value={value}
        cancel={() => this.onToggleEditMode(type, index, false)}
        className="floatL"
      />
    );
  };

  render() {
    const { rowIndex, data } = this.props;
    const { data: allReminders = [], multipleReminders, id: learnerStatusId } = data[rowIndex];
    const reminderDisplayNames = REMINDER_TYPE_OPTIONS_DISPLAY_NAME[learnerStatusId] || {};
    const options = Object.keys(reminderDisplayNames).map(type => {
      return {
        text: reminderDisplayNames[type],
        value: type
      };
    });
    return (
      <div className={classnames(style.commonLineHeight, style.rt_deleteDateOption)}>
        {allReminders.map((reminder, index) => {
          return reminder.type == REMINDER_TYPES.CONSTANT ? (
            <span key={`reminderdropdown${index}`}>{reminder.displayValue}</span>
          ) : (
            <div
              key={`reminderdropdown${index}`}
              className={classnames(index && "marginT15", "clearfix", style.rt_dropdownHolder)}
            >
              <Dropdown
                id={`reminderdropdown${index}`}
                name={`reminderdropdown${index}`}
                options={options}
                title={reminderDisplayNames[reminder.type] || DEFAULT_VALUE}
                fontSize={13}
                setTitle={true}
                onSelect={value => {
                  this.onToggleEditMode(value, index, true);
                }}
                className={classnames("rt_dropdownCustomClass", "floatL")}
              />
              {reminder.edit
                ? this.editComponentByType({ ...reminder, index })
                : this.updateComponentByType({ ...reminder, index })}

              <Icon
                type="delete"
                className={classnames(style.rt_icon, style.rt_deleteIcon)}
                onClick={() => this.deleteReminder(index)}
              />
            </div>
          );
        })}
        {multipleReminders ? (
          <div className={style.rt_addReminder} onClick={this.addReminder}>
            + Add Reminder
          </div>
        ) : null}
      </div>
    );
  }
}

class MailTemplateCell extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    rowIndex: PropTypes.number,
    mailTemplates: PropTypes.object.isRequired,
    updateReminder: PropTypes.func.isRequired,
    updateReminderState: PropTypes.func.isRequired
  };
  onSelect = (newTemplateId, index) => {
    const { data, rowIndex, mailTemplates, updateReminderState } = this.props;
    const reminder = data[rowIndex].data;
    const { id: reminderId, type, value } = reminder[index];
    const learnerStatusId = data[rowIndex].id;

    reminder[index] = {
      ...reminder[index],
      templateName: mailTemplates[newTemplateId].name,
      templateId: newTemplateId
    };
    const updatedData = {
      ...data,
      [rowIndex]: {
        ...data[rowIndex],
        data: reminder
      }
    };
    updateReminderState(Object.values(updatedData));
    reminderId &&
      this.props.updateReminder(reminderId, {
        templateId: newTemplateId,
        learnerStatusId,
        type,
        value
      });
  };
  render() {
    const { data: reminders, mailTemplates, rowIndex } = this.props;
    const options = Object.values(mailTemplates)
      .map(({ id, name }) => {
        return { text: name, value: id };
      })
      .sort((a, b) => {
        const textA = a.text ? a.text.toLowerCase() : "";
        const textB = b.text ? b.text.toLowerCase() : "";
        if (textA !== "none" && textB !== "none") {
          return textA > textB ? 1 : textB > textA ? -1 : 0;
        } else {
          return textA === "none" && textB === "none" ? 0 : textA === "none" ? -1 : 1;
        }
      });

    let distinctOptions = [];
    let flags = [];
    for (let i = 0; i < options.length; i++) {
      if (flags.indexOf(options[i].text) < 0) {
        flags.push(options[i].text);
        distinctOptions.push(options[i]);
      }
    }

    const { data } = reminders[rowIndex];

    return (
      <Fragment>
        {data.map(({ templateName, type, templateId }, index) => {
          return (
            <div
              key={`templateDD-${index}-${rowIndex}-${templateName}`}
              className={classnames(index && "marginT15", "clearfix", style.rt_dropdownHolder)}
            >
              <Dropdown
                id={`templatedropdown${index}-${rowIndex}-${templateName}`}
                name={`templatedropdown${index}-${rowIndex}-${templateName}`}
                options={distinctOptions}
                setTitle={true}
                title={templateName ? templateName : mailTemplates[templateId].name}
                disabled={type !== REMINDER_TYPES.EPOCH && type !== REMINDER_TYPES.CONSTANT}
                fontSize={13}
                onSelect={value => {
                  this.onSelect(value, index);
                }}
                className="rt_dropdownCustomClass"
              />
              {/* <div className={style.view}>View</div> */}
              {type !== REMINDER_TYPES.CONSTANT && (
                <Info
                  className="ptsInfo"
                  content={
                    <div key="staticText" className={style.rt_allModuleNoteText}>
                      <p>{MESSAGES.INFO_P1}</p>
                      <p>{MESSAGES.INFO_P2}</p>
                    </div>
                  }
                />
              )}
            </div>
          );
        })}
      </Fragment>
    );
  }
}

class ReminderTable extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    mailTemplates: PropTypes.object.isRequired,
    updateReminder: PropTypes.func.isRequired,
    deleteReminder: PropTypes.func.isRequired,
    createReminder: PropTypes.func.isRequired,
    seriesLevelMailSettings: PropTypes.shape({
      moduleInvitaionEmailEnabled: PropTypes.bool.isRequired,
      reminderMailEnabled: PropTypes.bool.isRequired
    })
  };
  static defaultProps = {
    mailTemplates: []
  };
  state = {
    showWarningMessage: false,
    mailWarningMessage: "",
    data: this.props.data
  };

  updateReminderState = data => {
    this.setState({ data });
  };

  setWarningMessage() {
    const { moduleInvitaionEmailEnabled, reminderMailEnabled } = this.props.seriesLevelMailSettings;
    const {
      BOTH_INVITE_AND_REMINDERS_DISABLED,
      ONLY_INVITE_DISABLED,
      ONLY_REMINDERS_DISABLED
    } = EMAIL_SETTINGS_WARNING_MESSAGES;

    let messageToShow = "";
    let showWarning = true;

    if (moduleInvitaionEmailEnabled && reminderMailEnabled) showWarning = false;
    else if (!moduleInvitaionEmailEnabled && !reminderMailEnabled)
      messageToShow = BOTH_INVITE_AND_REMINDERS_DISABLED;
    else if (!moduleInvitaionEmailEnabled) messageToShow = ONLY_INVITE_DISABLED;
    else if (!reminderMailEnabled) messageToShow = ONLY_REMINDERS_DISABLED;

    this.setState({
      mailWarningMessage: messageToShow,
      showWarningMessage: showWarning
    });
  }

  componentWillReceiveProps(newProps) {
    if (!deepEqual(newProps.data, this.props.data)) {
      this.setState({ data: newProps.data });
    }
  }

  componentDidMount() {
    this.setWarningMessage();
  }

  render() {
    const { mailWarningMessage, showWarningMessage, data } = this.state;
    return (
      <div className={style.rt_reminderTable}>
        <div className={style.rt_heading}>Reminders</div>
        {showWarningMessage && <Notify key="mailWarning" content={mailWarningMessage} />}
        <DataTable rowsCount={data.length}>
          <Column
            hidden={false}
            header={<div className={style.rt_header}>Learner Status</div>}
            cell={<LearnerStatus {...this.props} data={data} />}
            width="17%"
          />
          <Column
            hidden={false}
            header={<div className={style.rt_header}>When to Send</div>}
            cell={
              <ReminderCell
                {...this.props}
                data={data}
                updateReminderState={this.updateReminderState}
              />
            }
          />
          <Column
            hidden={false}
            header={<div className={style.rt_header}>Email Template</div>}
            cell={
              <MailTemplateCell
                {...this.props}
                data={data}
                updateReminderState={this.updateReminderState}
              />
            }
            width="33%"
          />
        </DataTable>
      </div>
    );
  }
}
export default ReminderTable;

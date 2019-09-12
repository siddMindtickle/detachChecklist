import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Toggle from "@components/toggle";
import Dropdown from "@components/dropdown";
import Icon from "@components/icon";
import UpdateDays from "@components/updateDays";
import UpdateDateTime from "@components/updateDateTime";
import Radio from "@components/radio";

import style from "./index.scss";

import {
  deepEqual,
  daysToMinutes,
  minutesToDays,
  milisecondsToSeconds,
  secondsToMiliseconds
} from "@utils";
import { STATIC } from "../../config/constants";
import { DUE_DATE_ACTION, DUE_DATE_TYPE_MAP, DUE_DATE_TYPE_DETAILS } from "../../config/constants";
import "./index.scss";

class LeftSection extends Component {
  static propTypes = {
    dueDate: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired
  };
  state = {
    dueDateType: this.props.dueDate.dueDateType,
    dueDateValue: this.props.dueDate.dueDateValue,
    edit: false
  };
  getDueDateOptions = () => {
    return Object.keys(DUE_DATE_TYPE_DETAILS)
      .map(type => {
        const displayName = DUE_DATE_TYPE_DETAILS[type].displayName;
        return {
          text: displayName,
          value: type
        };
      })
      .filter(option => option.value !== DUE_DATE_TYPE_MAP.NONE);
  };
  toggleEditMode = (value = true) => {
    this.setState({ edit: value });
  };
  updateValue = value => {
    const { dueDateType } = this.state;
    let dueDateValue = value;
    switch (dueDateType) {
      case DUE_DATE_TYPE_MAP.AFTER_DAYS:
        dueDateValue = daysToMinutes(value);
        break;
      case DUE_DATE_TYPE_MAP.SPECIFIC_TIME:
        dueDateValue = milisecondsToSeconds(value);
    }
    this.props.update({ dueDateType, dueDateValue });
    this.toggleEditMode(false);
  };
  onSelect = value => {
    const newState = {
      dueDateType: value,
      dueDateValue: DUE_DATE_TYPE_DETAILS[value].defaultValue
    };
    const oldState = {
      dueDateType: this.state.dueDateType,
      dueDateValue: this.state.dueDateValue
    };
    if (!deepEqual(newState, oldState)) {
      this.setState(newState);
      this.props.update(newState);
    }
  };
  toggleDueDateStatus = value => {
    if (value) {
      const type = DUE_DATE_TYPE_MAP.AFTER_DAYS;
      this.props.update({
        dueDateType: type,
        dueDateValue: DUE_DATE_TYPE_DETAILS[type].defaultValue
      });
    } else {
      const type = DUE_DATE_TYPE_MAP.NONE;
      this.props.update({
        dueDateType: type,
        dueDateValue: DUE_DATE_TYPE_DETAILS[type].defaultValue
      });
    }
  };
  renderActiveState = dueDateStatus => {
    const { dueDateType } = this.state;
    return dueDateStatus ? (
      <Dropdown
        key="duedate"
        name="duedate"
        id="duedateoptions"
        title={DUE_DATE_TYPE_DETAILS[dueDateType].displayName}
        onSelect={this.onSelect}
        options={this.getDueDateOptions()}
        className="duedate-dd"
      />
    ) : null;
  };
  renderEditState = dueDateStatus => {
    const { dueDateType, dueDateValue, edit } = this.state;
    if (!dueDateStatus) return null;
    if (edit) {
      switch (dueDateType) {
        case DUE_DATE_TYPE_MAP.AFTER_DAYS:
          return (
            <UpdateDays
              ok={this.updateValue}
              value={minutesToDays(dueDateValue)}
              cancel={() => this.toggleEditMode(false)}
            />
          );
        case DUE_DATE_TYPE_MAP.SPECIFIC_TIME:
          return (
            <UpdateDateTime
              value={secondsToMiliseconds(dueDateValue)}
              ok={this.updateValue}
              cancel={() => this.toggleEditMode(false)}
            />
          );
      }
    }
    return (
      <div className={style.calendarValue} onClick={() => this.toggleEditMode(true)}>
        <div className={style.editicon} key="editicon">
          <Icon type="edit" className="pointer" />
        </div>
        <div className={style.valueStyle} key="dateText">
          {DUE_DATE_TYPE_DETAILS[dueDateType].getDisplayValue(dueDateValue)}
        </div>
        <div className="clear" />
      </div>
    );
  };
  UNSAFE_componentWillReceiveProps(newProps) {
    if (!deepEqual(newProps.dueDate, this.props.dueDate)) {
      this.setState({
        dueDateType: newProps.dueDate.dueDateType,
        dueDateValue: newProps.dueDate.dueDateValue,
        edit: false
      });
    }
  }
  render() {
    const { dueDateType } = this.state;
    const dueDateStatus = DUE_DATE_TYPE_MAP.NONE !== dueDateType;
    return (
      <div className={classnames(style.leftSection, !dueDateStatus && "paddingB30")}>
        <div className={style.heading}>Due Date</div>
        <div className="marginT15">
          <Toggle onToggle={this.toggleDueDateStatus} value={true} checked={dueDateStatus} />
        </div>
        {this.renderActiveState(dueDateStatus)}
        {this.renderEditState(dueDateStatus)}
      </div>
    );
  }
}

class RightSection extends Component {
  static propTypes = {
    update: PropTypes.func.isRequired,
    dueDate: PropTypes.object.isRequired
  };
  onSelect = value => {
    this.props.update({
      dueDateExpiry: value
    });
  };
  render() {
    const {
      dueDate: { dueDateExpiry }
    } = this.props;
    return (
      <div className={style.rightSection}>
        <div className={style.heading}>What Happens After Due Date?</div>
        <div className={style.radiobtnSection}>
          <Radio
            checked={DUE_DATE_ACTION.NO_ACTION.value == dueDateExpiry}
            onClick={() => this.onSelect(DUE_DATE_ACTION.NO_ACTION.value)}
            label={DUE_DATE_ACTION.NO_ACTION.displayName}
          />
        </div>
        <div className={style.radiobtnSection}>
          <Radio
            checked={DUE_DATE_ACTION.FREEZE.value == dueDateExpiry}
            onClick={() => this.onSelect(DUE_DATE_ACTION.FREEZE.value)}
            label={DUE_DATE_ACTION.FREEZE.displayName}
          />
        </div>
      </div>
    );
  }
}

class DueDate extends Component {
  static propTypes = {
    details: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired
  };
  onUpdate = data => {
    const {
      update,
      details: { dueDate }
    } = this.props;
    update({ type: STATIC, dueDate: { ...dueDate, ...data } });
  };
  render() {
    const {
      details: { dueDate }
    } = this.props;
    return (
      <div key="duedate" className={classnames(style.scoreWrapper, "marginB25", "boxStyle")}>
        <LeftSection dueDate={dueDate} update={this.onUpdate} />
        <RightSection dueDate={dueDate} update={this.onUpdate} />
        <div className="clear" />
      </div>
    );
  }
}
export default DueDate;

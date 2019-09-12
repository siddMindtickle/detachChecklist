import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import DatePicker from "@components/datePicker";
import TimePicker from "@components/timePicker";
import Button from "@components/button";
import Icon from "@components/icon";

import { deepmerge, noop } from "@utils";
import "./index.scss";

import { Format, TYPES, HOURS, MINUTES, MINUTE_STEP } from "./constants";
import { getDateStart, getDayTime } from "./helper";

const getInitialState = value => {
  return {
    [TYPES.DATE]: getDateStart(value),
    [TYPES.TIME]: getDayTime(value)
  };
};
export default class UpdateDateTime extends Component {
  static propTypes = {
    value: PropTypes.number,
    ok: PropTypes.func,
    cancel: PropTypes.func,
    withBtns: PropTypes.bool,
    min: PropTypes.number,
    disable: PropTypes.bool
  };
  static defaultProps = {
    value: Date.now(),
    withBtns: true,
    ok: noop,
    cancel: noop
  };
  state = {
    ...getInitialState(this.props.value)
  };

  select = (type, value) => {
    const { withBtns, ok } = this.props;
    let updatedState;
    switch (type) {
      case TYPES.DATE:
        updatedState = {
          [TYPES.DATE]: getDateStart(value)
        };
        break;
      case TYPES.TIME:
        updatedState = {
          [TYPES.TIME]: getDayTime(value)
        };
        break;
    }
    updatedState = deepmerge(this.state, updatedState);
    this.setState(updatedState);
    !withBtns && ok(updatedState[TYPES.DATE] + updatedState[TYPES.TIME]);
  };

  disabledDate = date => {
    const { min, disable } = this.props;
    const current = disable ? moment(min) : moment();
    return date && date < current.startOf("day");
  };

  disabledHours = () => {
    const { date } = this.state;
    const { min, disable } = this.props;
    const current = disable ? moment(min) : moment();
    if (date == getDateStart(+current) && disable) {
      const filteredHours = HOURS.filter(
        hour => hour < current.hour() || (hour == current.hour() && current.minute() > 45)
      );
      filteredHours.push(0);
      return filteredHours;
    }
    return [];
  };
  disabledMinutes = hour => {
    const { date } = this.state;
    const { min, disable } = this.props;
    const momentObj = disable ? moment(min) : moment();
    if (date == getDateStart(+momentObj) && hour == momentObj.hour() && disable) {
      const filteredMinutes = MINUTES.filter(minute => minute < momentObj.minute());
      return filteredMinutes;
    }
    return [];
  };

  onOkBtn = () => {
    const { date, time } = this.state;
    const timestamp = date + time;
    this.props.ok(timestamp);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      const initialState = getInitialState(nextProps.value);
      this.setState(prevState => deepmerge(prevState, initialState));
    }
  }

  render() {
    const { cancel, withBtns } = this.props;
    const value = this.state[TYPES.DATE] + this.state[TYPES.TIME];
    return (
      <div className="datePicker">
        <DatePicker
          value={value}
          format={Format[TYPES.DATE]}
          disabledDate={this.disabledDate}
          showToday={false}
          onChange={value => this.select(TYPES.DATE, value)}
        />
        <TimePicker
          format={Format[TYPES.TIME]}
          value={value}
          hideDisabledOptions={true}
          disabledHours={this.disabledHours}
          disabledMinutes={this.disabledMinutes}
          minuteStep={MINUTE_STEP}
          onChange={value => this.select(TYPES.TIME, value)}
        />
        {withBtns && (
          <span className="dateTime_roundBtns">
            <Button name="ok" type="PrimaryRoundBtn" onClick={this.onOkBtn} className="marginL5">
              <Icon type="tick" />
            </Button>
            <Button name="cancel" type="DefaultRoundBtn" className="marginL5" onClick={cancel}>
              <Icon type="close" />
            </Button>
          </span>
        )}
      </div>
    );
  }
}

import React from "react";

const hrDivisor = 3600000;
const minDivisor = 60000;
const dayDivisor = 86400000;

const timezonenames = {
  "UTC-720": "Dateline Standard Time",
  "UTC-660": "Samoa Standard Time",
  "UTC-600": "Hawaiian Standard Time",
  "UTC-540": "Alaskan Standard Time",
  "UTC-480": "Pacific Standard Time",
  "UTC-420": "Mountain Standard Time",
  "UTC-360": "Central Standard Time",
  "UTC-300": "Eastern Standard Time",
  "UTC-240": "Atlantic Standard Time",
  "UTC-150": "Newfoundland Standard Time",
  "UTC-180": "S.A. Eastern Standard Time",
  "UTC-120": "Mid-Atlantic Standard Time",
  "UTC-60": "Azores Standard Time",
  "UTC+0": "GMT Standard Time",
  "UTC+60": "Central Europe Standard Time",
  "UTC+120": "Eastern Europe Standard Time",
  "UTC+180": "Arab,Russian Standard Time",
  "UTC+210": "Iran Standard Time",
  "UTC+240": "Arabian Standard Time",
  "UTC+270": "Afghanistan Standard Time",
  "UTC+300": "West Asia Standard Time",
  "UTC+330": "Indian Standard Time",
  "UTC+345": "Nepal Standard Time",
  "UTC+360": "Central Asia Standard Time",
  "UTC+390": "Myanmar Standard Time",
  "UTC+420": "S.E./North Asia Standard Time",
  "UTC+480": "China/Singapore Standard Time",
  "UTC+540": "Korea/Tokyo Standard Time",
  "UTC+570": "Australian Central Standard Time",
  "UTC+600": "Australian Eastern Standard Time",
  "UTC+660": "Central Pacific Standard Time",
  "UTC+720": "New Zealand Standard Time",
  "UTC+780": "Tonga Standard Time"
};

export const getTodaysTimestamp = inSeconds => {
  let x = new Date();
  x.setHours(0);
  x.setMinutes(0);
  x.setSeconds(0);
  x.setMilliseconds(0);
  const timestampInSeconds = x.getTime() / 1000;
  return inSeconds ? timestampInSeconds : x.getTime();
};

const convertMillisec = time => {
  if (time < 100000000000) {
    //Time in seconds convert it to milliseconds
    return time * 1000;
  }
  return time;
};
const getTimeText = time => {
  var date = new Date(convertMillisec(time));
  var isAm = true;
  var hour = date.getHours();
  if (hour > 12) {
    isAm = false;
    hour = hour - 12;
  } else if (hour == 12) {
    isAm = false;
  } else if (hour == 0) {
    hour = 12;
  }

  return `${`0${hour}`.slice(-2)}:${`0${date.getMinutes()}`.slice(-2)} ${isAm ? "AM" : "PM"}`;
};

/****
 * @params
 * * timestamp - timestamp in millisec
 * @return
 * * formattedUTCDate - 2014-01-11T00:00:00Z adjusted to UTC time
 ****/
export const getOutlookFormattedUTCTime = timestamp => {
  const dt = new Date(timestamp);
  const utcString =
    dt.getUTCFullYear() +
    "-" +
    (dt.getUTCMonth() + 1 > 9 ? dt.getUTCMonth() + 1 : "0" + (dt.getUTCMonth() + 1)) +
    "-" +
    (dt.getUTCDate() > 9 ? dt.getUTCDate() : "0" + dt.getUTCDate()) +
    "T" +
    (dt.getUTCHours() > 9 ? dt.getUTCHours() : "0" + dt.getUTCHours()) +
    ":" +
    (dt.getUTCMinutes() > 9 ? dt.getUTCMinutes() : "0" + dt.getUTCMinutes()) +
    ":" +
    (dt.getUTCSeconds() > 9 ? dt.getUTCSeconds() : "0" + dt.getUTCSeconds()) +
    "Z";
  return utcString;
};

const getTimezoneAbbreviation = timezoneDiff => {
  const timeKey = parseInt(timezoneDiff) >= 0 ? "UTC+" + timezoneDiff : "UTC" + timezoneDiff;
  return timezonenames[timeKey];
};

const getNiceDate = (t, formatMessage) => {
  var dt = new Date(convertMillisec(t));
  var mon = `${formatMessage({
    id: `MONTH_NAMES_SHORT_${dt.getMonth()}`
  })}`;
  return mon + " " + dt.getDate();
};

/**************************
 * Format MMM DD, HH:MM AM || Format HH:MM AM
 **************************/
export const getDateTimeFormatted = (time, formatMessage, giveMoreThanTime) => {
  const date = time instanceof Date ? time : new Date(convertMillisec(time));
  const month = formatMessage({
    id: `MONTH_NAMES_SHORT_${date.getMonth()}`
  });
  const day = date.getDate();

  const timeText = getTimeText(date.getTime()).toLowerCase();
  return `${giveMoreThanTime ? `${month} ${day},` : ""} ${timeText}`;
};

export const getFormattedTextTimezone = (
  time,
  formatMessage,
  giveMoreThanTime,
  timezone,
  zoneName
) => {
  const localDate = new Date(time);
  let utcEpoch = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
  const date = new Date(utcEpoch + parseInt(timezone) * 60000);
  return getDateTimeFormatted(date, formatMessage, true, timezone) + " (" + zoneName + ")";
};
/****
 * @params
 * * startOn - timestamp in millisec
 * * endOn - timestamp in millisec
 * @return
 * * {
 * * * durationString: Mar 11, 3:00 pm - 4:00 pm // or Mar 11, 3:00 pm - Mar 12, 10:00 am
 * * * duration: 1hr
 * * }
 *
 ****/
export const getDurationText = (
  startOn,
  endOn,
  formatMessage,
  timezone,
  zoneName,
  userTimezone,
  showLearnersTimezone
) => {
  startOn = convertMillisec(startOn);
  endOn = convertMillisec(endOn);

  if (showLearnersTimezone) timezone = userTimezone;

  //Get the Local Start date and Offset it with the local timezone offset and user profile timezone offset
  const localStartDate = new Date(startOn);
  var utcStartEpoch = localStartDate.getTime() + localStartDate.getTimezoneOffset() * 60000;
  const startDate = new Date(utcStartEpoch + parseInt(timezone) * 60000);

  const localEndDate = new Date(endOn);
  var utcEndEpoch = localEndDate.getTime() + localEndDate.getTimezoneOffset() * 60000;
  const endDate = new Date(utcEndEpoch + parseInt(timezone) * 60000);
  const isDays = endOn - startOn > dayDivisor;

  const durationTime = endDate - startDate;
  const durationHr = Math.floor(durationTime / hrDivisor);
  const durationMin = Math.floor((durationTime % hrDivisor) / minDivisor);
  const durationHrSuffix = durationMin === 0 && durationHr > 1 ? "hrs" : "hr";
  const durationMinSuffix = durationMin > 1 || durationHr > 1 ? "mins" : "min";

  const hrText = durationHr > 0 ? `${durationHr} ${durationHrSuffix}` : "";
  const minText = durationMin > 0 ? ` ${durationMin} ${durationMinSuffix}` : "";

  const startString = getDateTimeFormatted(startDate, formatMessage, true);
  const endString = getDateTimeFormatted(endDate, formatMessage, isDays);

  const timezoneString = showLearnersTimezone ? getTimezoneAbbreviation(timezone) : zoneName;

  return {
    durationString: `${startString} - ${endString}`,
    timeZone: timezoneString,
    duration: `${hrText}${minText}`
  };
};

export const getDueDateText = (duedate, intl) => {
  if (!intl) throw "No function for intl provided";
  if (!duedate) return "";

  const { formatMessage } = intl;
  const { canReAttempt, value: timestamp, expired } = duedate;
  const currentTimestamp = getTodaysTimestamp(true);
  const timeText = getTimeText(duedate.value);
  if (canReAttempt) {
    if (timestamp > currentTimestamp && timestamp < currentTimestamp + 86400) {
      return (
        <div className="errorColor">{`${formatMessage({
          id: "LB_TXT_DUE_TODAY"
        })}, ${timeText}`}</div>
      );
    } else if (timestamp >= currentTimestamp + 86400 && timestamp <= currentTimestamp + 172800) {
      return (
        <div className="errorColor">{`${formatMessage({
          id: "LB_TXT_DUE_TOMORROW"
        })}, ${timeText}`}</div>
      );
    } else {
      return `${formatMessage({ id: "LB_TXT_DUE_ON" })} ${getNiceDate(
        timestamp,
        formatMessage
      )}, ${timeText}`;
    }
  } else {
    if (timestamp < currentTimestamp) {
      return `${formatMessage({ id: "ENDED_ON" })} ${getNiceDate(
        timestamp,
        formatMessage
      )}, ${timeText}`;
    }
    if (timestamp > currentTimestamp && timestamp < currentTimestamp + 86400) {
      const messaseId = expired ? "ENDED_TODAY" : "LB_TXT_ENDS_TODAY";
      return (
        <div className="errorColor">{`${formatMessage({
          id: messaseId
        })}, ${timeText}`}</div>
      );
    } else if (timestamp >= currentTimestamp + 86400 && timestamp <= currentTimestamp + 172800) {
      return (
        <div className="errorColor">{`${formatMessage({
          id: "LB_TXT_ENDS_TOMORROW"
        })}, ${timeText}`}</div>
      );
    } else {
      return `${formatMessage({ id: "ENDS_ON" })} ${getNiceDate(
        timestamp,
        formatMessage
      )}, ${timeText}`;
    }
  }
};

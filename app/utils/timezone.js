import moment from "moment-timezone";
import { timezonesList, oldTimezonesList } from "timezones.json";

export const getTimezone_not_in_use = () => {
  var d = new Date();
  var usertime = d.toLocaleString();

  // Some browsers / OSs provide the timezone name in their local string:
  var tzsregex = /\b(ACDT|ACST|ACT|ADT|AEDT|AEST|AFT|AKDT|AKST|AMST|AMT|ART|AST|AWDT|AWST|AZOST|AZT|BDT|BIOT|BIT|BOT|BRT|BST|BTT|CAT|CCT|CDT|CEDT|CEST|CET|CHADT|CHAST|CIST|CKT|CLST|CLT|COST|COT|CST|CT|CVT|CXT|CHST|DFT|EAST|EAT|ECT|EDT|EEDT|EEST|EET|EST|FJT|FKST|FKT|GALT|GET|GFT|GILT|GIT|GMT|GST|GYT|HADT|HAEC|HAST|HKT|HMT|HST|ICT|IDT|IRKT|IRST|IST|JST|KRAT|KST|LHST|LINT|MART|MAGT|MDT|MET|MEST|MIT|MSD|MSK|MST|MUT|MYT|NDT|NFT|NPT|NST|NT|NZDT|NZST|OMST|PDT|PETT|PHOT|PKT|PST|RET|SAMT|SAST|SBT|SCT|SGT|SLT|SST|TAHT|THA|UYST|UYT|VET|VLAT|WAT|WEDT|WEST|WET|WST|YAKT|YEKT)\b/gi;

  // In other browsers the timezone needs to be estimated based on the offset:
  var timezonenames = {
    "UTC+0": "GMT",
    "UTC+1": "CET",
    "UTC+2": "EET",
    "UTC+3": "EEDT",
    "UTC+3.5": "IRST",
    "UTC+4": "MSD",
    "UTC+4.5": "AFT",
    "UTC+5": "PKT",
    "UTC+5.5": "IST",
    "UTC+6": "BST",
    "UTC+6.5": "MST",
    "UTC+7": "THA",
    "UTC+8": "AWST",
    "UTC+9": "AWDT",
    "UTC+9.5": "ACST",
    "UTC+10": "AEST",
    "UTC+10.5": "ACDT",
    "UTC+11": "AEDT",
    "UTC+11.5": "NFT",
    "UTC+12": "NZST",
    "UTC-1": "AZOST",
    "UTC-2": "GST",
    "UTC-3": "BRT",
    "UTC-3.5": "NST",
    "UTC-4": "CLT",
    "UTC-4.5": "VET",
    "UTC-5": "EST",
    "UTC-6": "CST",
    "UTC-7": "MST",
    "UTC-8": "PST",
    "UTC-9": "AKST",
    "UTC-9.5": "MIT",
    "UTC-10": "HST",
    "UTC-11": "SST",
    "UTC-12": "BIT"
  };

  var timezone = usertime.match(tzsregex);
  if (timezone) {
    timezone = timezone[timezone.length - 1];
  } else {
    var offset = (-1 * d.getTimezoneOffset()) / 60;
    offset = "UTC" + (offset >= 0 ? "+" + offset : offset);
    timezone = timezonenames[offset];
  }
  return timezone;
};

export const getTimezone = () => {
  const guessedRegion = moment.tz.guess();
  const timezone =
    timezonesList.find(timezone => {
      if (timezone.utc.includes(guessedRegion)) return true;
    }) || {};
  const timezoneStr = timezone.value ? `${timezone.abbr}` : `${guessedRegion}`;
  return timezoneStr;
};

export const getTimezoneDetails = () => {
  const result = [];
  timezonesList.forEach(timezone => {
    let offsetStr = moment
      .utc()
      .startOf("day")
      .add(Math.abs(timezone.offset * 60), "minutes")
      .format("hh:mm");
    offsetStr =
      timezone.offset < 0 ? `-${offsetStr}` : timezone.offset > 0 ? `+${offsetStr}` : "+00:00";

    timezone.utc.forEach(region => {
      if (region.indexOf("/") > -1) region = region.split(/\/(.+)/)[1];
      region = region.replace("_", " ");

      let regionDisplayName = `(GMT${offsetStr} ${timezone.value} - ${timezone.abbr} ) ${region}`;

      result.push({
        region: region,
        offset: timezone.offset,
        isdst: timezone.isdst,
        hasdst: timezone.hasdst ? true : false,
        code: timezone.abbr,
        name: timezone.value,
        displayName: regionDisplayName,
        shortDisplayName: `GMT ${offsetStr}`
      });
    });
  });
  return result.sort((a, b) => a.offset - b.offset);
};

export const getOldTimezoneDetails = () => {
  const result = [];
  oldTimezonesList.forEach(timezone => {
    let offsetStr = moment
      .utc()
      .startOf("day")
      .add(Math.abs(timezone.offset * 60), "minutes")
      .format("hh:mm");
    offsetStr = timezone.offset < 0 ? `-${offsetStr}` : `+${offsetStr}`;

    timezone.utc.forEach(region => {
      result.push({
        region: region,
        offset: timezone.offset,
        isdst: timezone.isdst,
        code: timezone.abbr,
        name: timezone.value,
        displayName: `${region} (${offsetStr})`,
        shortDisplayName: `GMT ${offsetStr}`
      });
    });
  });
  return result.sort((a, b) => a.offset - b.offset);
};

export const getTimezoneDetailsByKey = (key, value) => {
  if (!key) return {};
  if (value[0] === "(" || key === "offset") {
    return getTimezoneDetails().find(tz => {
      return tz[key] == value;
    });
  } else {
    return getOldTimezoneDetails().find(tz => {
      return tz[key] == value;
    });
  }
};

export const getOffsetDifference = (timestamp, offset) => {
  const time = moment(timestamp);
  if (time.isDST()) {
    while (!time.isDST()) {
      time.subtract(1, "month");
    }
  }
  const currentOffset = time.utcOffset() * 60000;
  return currentOffset - offset;
};

export const addOffsetDiff = (timestamp, offset) => {
  if (!offset) return timestamp;
  offset = getOffsetDifference(timestamp, offset);
  return new Date(timestamp + offset).getTime();
};

export const subtractOffsetDiff = (timestamp, offset) => {
  if (!offset) return timestamp;
  offset = getOffsetDifference(timestamp, offset);
  return new Date(timestamp - offset).getTime();
};

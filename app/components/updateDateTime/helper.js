import moment from "moment";
export const getDateStart = value => {
  return +moment(value).startOf("day");
};

export const getDayTime = value => {
  const current = +moment(value);
  const dayStart = +moment(value).startOf("day");
  return current - dayStart;
};

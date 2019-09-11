import { isUndefined } from "@utils";

export const getPublishVersionUrl = ({ baseUrl, version }) => {
  const path = [baseUrl];
  !isUndefined(version) && path.push(version);
  return path.join("/");
};

export const getVersionDisplayValue = value => {
  return new Date(value).toDateString();
};

export const getLatestVersion = publishHistory => {
  return publishHistory[0] && publishHistory[0].version;
};

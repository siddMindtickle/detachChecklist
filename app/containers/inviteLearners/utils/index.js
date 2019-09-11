import { CSV_CONSTANTS, FILE_HEADER } from "../config/constants";
import { getDownloadUrl } from "@utils/generateUrls";
import { openWindow, isValidEmail, numOnly, textOnly, textNum } from "@utils";
import { checkAccessByPermissionsMap } from "@utils/permissions";
import queryString from "query-string";
import {
  INVITE_TYPE,
  INVITE_TO_OPTIONS,
  INVITE_TYPE_DETAILS,
  MODULE_RELEVANCE_KEYS
} from "../config/constants";
import { INVITE_PERMISSIONS } from "../config/permissions";

export const getCsvFields = (profileFields = [], managerFields = [], moduleRelevanceEnabled) => {
  let csvData = {};
  let csvFields = CSV_CONSTANTS.BASE_FIELDS;
  let displayToShortKey = {};
  let shortKeyToDisplayType = {};

  if (moduleRelevanceEnabled) {
    csvFields += "," + "Module Relevance";

    displayToShortKey["Module Relevance"] = CSV_CONSTANTS.MODULE_RELEVANCE;
    shortKeyToDisplayType[CSV_CONSTANTS.MODULE_RELEVANCE] = {
      displayType: "TEXT",
      displayParams: []
    };
  }

  profileFields.forEach(profileField => {
    csvFields += "," + profileField.displayName;
    displayToShortKey[profileField.displayName] = CSV_CONSTANTS.PROFILE + profileField.shortKey;
    shortKeyToDisplayType[profileField.shortKey] = {
      displayType: profileField.displayType,
      displayParams: profileField.displayParams
    };
  });
  managerFields.forEach(managerField => {
    csvFields += "," + managerField.displayName;
    displayToShortKey[managerField.displayName] = CSV_CONSTANTS.MANGAERS + managerField.shortKey;
  });
  csvFields = csvFields.replace(/\n/g, "\r\n").replace(/\r\r/g, "\r");
  csvData.csvFields = csvFields;
  csvData.shortKeyToDisplayType = shortKeyToDisplayType;
  csvData.fileHeaders = setFileHeader(csvFields, displayToShortKey);
  return csvData;
};

export const setFileHeader = (csvFields, displayToShortKey) => {
  let fileHeaders = [...FILE_HEADER];
  let csvFieldArray = csvFields.split(",");

  for (let i = FILE_HEADER.length; i < csvFieldArray.length; i++) {
    fileHeaders.push([displayToShortKey[csvFieldArray[i]]]);
  }
  return fileHeaders;
};

export const downloadSample = (csvFields, cname) => {
  let queryParam = queryString.stringify({
    fn: CSV_CONSTANTS.SAMPLE_FILE_NAME,
    ct: CSV_CONSTANTS.CONTENT_TYPE,
    data: csvFields
  });
  openWindow(getDownloadUrl(cname, queryParam));
};

const getModuleRelevance = val => {
  const relevanceKey = MODULE_RELEVANCE_KEYS[val.toUpperCase()];
  return relevanceKey ? relevanceKey : MODULE_RELEVANCE_KEYS["UNMARKED"];
};

export const handleData = (parsedData, shortKeyToDisplayType) => {
  const regex = new RegExp(/profile\.|managers\./);
  const formattedObject = parsedData.map(obj => {
    return Object.keys(obj).reduce(
      (acc, key) => {
        let newKey = key;
        if (regex.test(key)) {
          let field = key.split(".")[0];
          newKey = key.split(".")[1];
          if (field === "managers" && obj[key]) {
            acc[field].push({ key: newKey, email: obj[key] });
          }
          acc[field][newKey] = obj[key];
        } else {
          acc[newKey] = newKey === "moduleRelevance" ? getModuleRelevance(obj[key]) : obj[key];
        }
        return acc;
      },
      { errors: [], profile: {}, managers: [] }
    );
  });

  return validateEachRow(formattedObject, shortKeyToDisplayType);
};

export const validateEachRow = (formattedObject, shortKeyToDisplayType) => {
  let uniqueUsers = [];
  let addedMails = {};
  for (let i = 0; i < formattedObject.length; i++) {
    let userObj = formattedObject[i];
    if (!userObj.errors) userObj.errors = [];
    userObj.email = userObj.email ? userObj.email.toLowerCase().trim() : undefined;
    if (!userObj.email || !isValidEmail(userObj.email)) {
      //Skip invalid emails
      userObj.errors.push("Invalid Email");
    }

    if (addedMails[userObj.email]) {
      continue;
    }
    addedMails[userObj.email] = userObj.email;
    uniqueUsers.push(userObj);

    if (userObj.profile !== {}) {
      let fields = Object.keys(userObj.profile);
      for (let j = 0; j < fields.length; j++) {
        let field = fields[j];
        let fieldObj = shortKeyToDisplayType[field];
        let fieldValue = userObj.profile[field];
        if (fieldValue) {
          if (fieldObj.displayType == "DROPDOWN") {
            let foundValue = false;
            for (let l = 0; l < fieldObj.displayParams.length; l++) {
              let ddValue = fieldObj.displayParams[l];
              if (ddValue.toLowerCase() == fieldValue.toLowerCase()) {
                foundValue = true;
                break;
              }
            }
            if (!foundValue) {
              userObj.errors.push("Invalid " + fieldObj.displayName);
            }
          } else if (fieldObj.validationType == "NUMBER_ONLY" && !numOnly(fieldValue)) {
            userObj.errors.push("Invalid " + fieldObj.displayName);
          } else if (fieldObj.validationType == "ALPHA_ONLY" && !textOnly(fieldValue)) {
            userObj.errors.push("Invalid " + fieldObj.displayName);
          } else if (fieldObj.validationType == "ALPHA_NUMERIC" && !textNum(fieldValue)) {
            userObj.errors.push("Invalid " + fieldObj.displayName);
          }
        }
      }
    }

    if (userObj.managers.length > 0) {
      for (let j = 0; j < userObj.managers.length; j++) {
        let mEmail = userObj.managers[j].email;
        if (mEmail && !isValidEmail(mEmail)) {
          userObj.errors.push("Invalid Manager Email");
        }
      }
    }
  }

  return uniqueUsers;
};

export const getInviteOptions = ({
  moduleType,
  globalPermissions,
  seriesPermissions,
  isSiteOwner
}) => {
  const inviteTo = INVITE_TO_OPTIONS(moduleType);
  const inviteOptions = [];

  Object.keys(INVITE_TYPE).map(type => {
    const typeValue = INVITE_TYPE[type];
    if (
      checkAccessByPermissionsMap({
        permissions: INVITE_PERMISSIONS.INVITE_TYPE[typeValue],
        globalPermissions,
        isSiteOwner
      })
    ) {
      inviteOptions.push({
        value: typeValue,
        title: INVITE_TYPE_DETAILS[typeValue].title
      });
    }
  });

  const options = [];
  for (const [value, title] of Object.entries(inviteTo)) {
    if (
      checkAccessByPermissionsMap({
        permissions: INVITE_PERMISSIONS.INVITE_TO[value],
        globalPermissions,
        contextPermissions: seriesPermissions,
        isSiteOwner
      })
    ) {
      options.push({
        title,
        value,
        children: inviteOptions
      });
    }
  }
  return options;
};

export const filterLearnersWithoutError = learners => {
  return (learners && learners.filter(learner => !learner.errors.length)) || [];
};

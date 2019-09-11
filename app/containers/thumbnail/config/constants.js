export const THUMB_TYPES = {
  MT: "default",
  CUSTOM: "custom"
};

export const NO_CUSTOM_IMAGE = "No custom thumbnails uploaded yet.";

export const HEADER_DISPLAY_NAMES = {
  [THUMB_TYPES.MT]: "Thumbnails",
  [THUMB_TYPES.CUSTOM]: "Custom"
};

export const OPERATIONS = {
  RENAME: "rename_thumb",
  REMOVE: "remove_thumb",
  GET: "get_thumb",
  UPDATE_LIST: "update_thumb_list"
};

export const THUMB_CATEGORIES = [
  "SERIES_THUMB",
  "COURSE_THUMB",
  "UPDATE_THUMB",
  "MISSION_THUMB",
  "ASSESSMENT_THUMB",
  "COACHING_THUMB",
  "CHECKLIST_THUMB"
];
export const SIZE = 200;

export const THUMB_RENAME_ERROR_CODES = {
  DUPLICATE: "DUPLICATE_THUMBNAME",
  EMPTY: "EMPTY_THUMBNAME"
};

export const THUMB_RENAME_ERROR_MESSAGES = {
  [THUMB_RENAME_ERROR_CODES.DUPLICATE]:
    "A thumbnail of this name already exists. Please choose a different name.",
  [THUMB_RENAME_ERROR_CODES.EMPTY]: "Field can't be empty!"
};

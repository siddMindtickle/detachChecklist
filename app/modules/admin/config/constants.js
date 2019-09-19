export const OPERATIONS = {
  ADD: "add",
  GET: "get",
  REMOVE: "remove",
  SELECT: "select",
  EXPAND: "expand",
  UPDATE: "update",
  RENAME: "rename",
  MOVE: "move",
  COPY: "copy",
  DISCARD: "discard",
  SEARCH: "search",
  LOAD_MORE: "loadMore",
  SORT: "sort",
  REFETCH: "refetch",
  ARCHIVE: "archive"
};

export const TREE_NODE_DEFAULT = {
  "0": {
    placeholder: "Enter Section Name",
    defaultValue: "Untitled Section",
    displayName: "Section"
  },
  leaf: {
    placeholder: "Type here",
    defaultValue: "",
    displayName: "Task"
  }
};

export const MODULE_OPTION = {
  RENAME: OPERATIONS.RENAME,
  DISCARD: OPERATIONS.DISCARD,
  ARCHIVE: OPERATIONS.ARCHIVE,
  VIEW_ANALYTICS: "view-analytics",
  MODULE_URL: "module-url"
};

export const BUILD_MESSAGE = {
  EMPTY_SECTION_NAME: "Section name can not be empty",
  INFO: {
    SCORE:
      "Learners will automatically receive this Score when their Task is marked as complete. Users with 'Manage Series' or 'Assign Content' permission can change the obtained Score anytime."
  }
};

export const DEBOUNCE_TIME = {
  DESCRIPTION: 200
};

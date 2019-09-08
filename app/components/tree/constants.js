export const SUPPORTED_OPERATIONS = {
  ADD: "add",
  REMOVE: "remove",
  SELECT: "select",
  EXPAND: "expand",
  UPDATE: "update",
  MOVE: "move",
  COPY: "copy",
  RENAME: "rename"
};

export const ENTITY_OPERATIONS = [
  { text: "Rename", icon: "edit", value: SUPPORTED_OPERATIONS.RENAME },
  { text: "Duplicate", icon: "duplicate", value: SUPPORTED_OPERATIONS.COPY },
  { text: "Delete", icon: "delete", value: SUPPORTED_OPERATIONS.REMOVE }
];

export const globalOperations = [
  {
    text: "Upload"
  }
];

export const DEFAULTS = {
  placeholder: "Add Title"
};

export const DEFAULT_NODE = (displayIndex, { leaf = false, defaultValue } = {}) => {
  const node = {
    data: {
      displayIndex
    },
    selected: leaf,
    expanded: !leaf
  };
  if (defaultValue) {
    node.data.name = defaultValue;
  }
  return node;
};

export const TIMINGS = {
  TITLE_CHANGE: 200,
  SEARCH: 100
};

export const IGNORE_COLLAPSED = true;

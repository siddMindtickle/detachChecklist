export const MODULE_OPTIONS = [
  { text: "Rename Module", value: "rename" },
  { text: "Get Module URL", value: "module-url" }
  // { text: "View Module Analytics", value: "view-analytics" }
];
export const DISCARD_OPTION = { text: "Discard Module", value: "discard" };
export const ARCHIVE_OPTION = { text: "Archive Module", value: "archive" };

export const OPERATIONS = {
  RENAME_MODULE: "rename",
  DISCARD: "discard",
  ARCHIVE: "archive",
  VIEW_ANALYTICS: "view-analytics",
  MODULE_URL: "module-url"
};

export const CONFIRM_MESSAGES = {
  DISCARD({ moduleType, seriesCount, isPublished }) {
    if (isPublished) {
      return `This ${moduleType} is available in ${seriesCount} Series. Are you sure you want to delete it from all  ${seriesCount} Series`;
    }
    return `Are you sure you want to discard this ${moduleType}?`;
  },
  ARCHIVE({ moduleType, seriesCount, isPublished }) {
    if (isPublished) {
      return `This ${moduleType} is available in ${seriesCount} Series. Are you sure you want to archive it from all  ${seriesCount} Series`;
    }
    return `Are you sure you want to archive this ${moduleType}?`;
  }
};

import React from "react";
import PropTypes from "prop-types";
const DeleteConfirmation = ({ level, levelConfig, selectedCount }) => {
  let displayName = levelConfig[level].displayName || "";
  displayName = selectedCount > 1 ? `${displayName}s` : displayName;

  if (level == "leaf") {
    return selectedCount ? (
      <span>
        Are you sure you want to delete the selected {selectedCount} {displayName}?
      </span>
    ) : (
      <span>Are you sure you want to delete this {displayName}? </span>
    );
  } else {
    if (selectedCount) {
      return (
        <div>
          <div>
            Are you sure you want to delete the selected {selectedCount} {displayName}?
          </div>
          <div>
            All the {levelConfig["leaf"].displayName}s in {selectedCount > 1 ? "these" : "this"}{" "}
            {displayName.toLowerCase()} will also be deleted.
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div>Are you sure you want to delete this {displayName}?</div>
          <div>
            All the {levelConfig["leaf"].displayName}s in this {displayName.toLowerCase()} will also
            be deleted.
          </div>
        </div>
      );
    }
  }
};

DeleteConfirmation.propTypes = {
  level: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  levelConfig: PropTypes.object.isRequired,
  selectedCount: PropTypes.number
};

export default DeleteConfirmation;

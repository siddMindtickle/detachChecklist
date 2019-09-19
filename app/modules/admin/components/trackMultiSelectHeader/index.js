import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Icon from "@components/icon";
import style from "./index.scss";

const TrackMultiSelectHeader = ({
  selectedLearners,
  resetProgress,
  removeLearners,
  changeRelevance,
  unselectAll,
  selectAll,
  totalLearners,
  moduleRelevanceEnabled
}) => {
  const isAllSelected = selectedLearners.length > 0 && selectedLearners.length == totalLearners;
  return (
    <div className={style.filterOptionsPanel}>
      <div className={style.totalLearnerSelected}>
        <span className={style.learnerSelect}>{selectedLearners.length} Learner Selected</span>
        <div
          className={classnames("link", style.deselectAll)}
          onClick={isAllSelected ? unselectAll : selectAll}
        >
          <span className={style.deselect}>{isAllSelected ? "Deselect All" : "Select All"}</span>
          <span className={classnames("link", style.divider)} />
        </div>
      </div>

      <div
        className={classnames("link", style.removeLearner)}
        onClick={() => removeLearners(selectedLearners)}
      >
        <Icon type="delete" className={style.deleteIcon} />
        <span>Remove learners</span>
      </div>

      <span className={classnames("link", style.divider)} />

      <div
        className={classnames("link", style.resetAll)}
        onClick={() => resetProgress(selectedLearners)}
      >
        Reset Progress
      </div>

      <span className={classnames("link", style.divider)} />

      {moduleRelevanceEnabled && (
        <div
          className={classnames("link", style.changeRelevanceAll)}
          onClick={() => changeRelevance(selectedLearners)}
        >
          Change Module Relevance
        </div>
      )}
    </div>
  );
};

TrackMultiSelectHeader.propTypes = {
  selectedLearners: PropTypes.array.isRequired,
  removeLearners: PropTypes.func.isRequired,
  resetProgress: PropTypes.func.isRequired,
  changeRelevance: PropTypes.func.isRequired,
  unselectAll: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  totalLearners: PropTypes.number.isRequired,
  moduleRelevanceEnabled: PropTypes.bool.isRequired
};

export default TrackMultiSelectHeader;

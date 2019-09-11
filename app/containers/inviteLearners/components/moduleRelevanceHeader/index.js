import React from "react";

import PropTypes from "prop-types";

import style from "./index.scss";
import Info from "@components/info";
import ModuleRelevanceInfoPopupContent from "@components/moduleRelevanceInfoPopupContent";
import RelevanceSelectionPopup from "@components/relevanceSelectionPopup";

const ModuleRelevanceHeader = ({
  isAllSelected,
  defaultModuleRelevanceSelection,
  handleRelevanceUpdate
}) => {
  return (
    <div className={style.relevanceHeader}>
      <span className={style.relevanceIcon}>
        <Info content={<ModuleRelevanceInfoPopupContent />} className={style.infoOverlay} />
      </span>
      <span className={style.relevanceHeaderText}>{"Module Relevance:"}</span>
      {isAllSelected && (
        <div className={style.relevanceHeaderDropdown}>
          <RelevanceSelectionPopup
            defaultValue={defaultModuleRelevanceSelection}
            select={handleRelevanceUpdate}
          />
        </div>
      )}
    </div>
  );
};

ModuleRelevanceHeader.propTypes = {
  moduleRelevanceSelection: PropTypes.any,
  handleRelevanceUpdate: PropTypes.func,
  isAllSelected: PropTypes.bool,
  defaultModuleRelevanceSelection: PropTypes.any
};

export default ModuleRelevanceHeader;
